import asyncio
import logging

import httpx

from app.config import get_settings
from app.models.pacifica import OrderbookLevel, PacificaMarketSnapshot

logger = logging.getLogger(__name__)


class PacificaClient:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.base_url = self.settings.pacifica_api_base.rstrip("/")
        self.timeout = self.settings.request_timeout_seconds
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "PacificaClient":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.aclose()

    async def get_market_snapshots(
        self,
        symbols: list[str] | None = None,
        limit: int | None = 6,
        include_flow: bool = True,
    ) -> list[PacificaMarketSnapshot]:
        market_info, market_prices = await asyncio.gather(
            self._get("/info"),
            self._get("/info/prices"),
        )

        symbols_filter = {symbol.upper() for symbol in symbols or []}
        info_by_symbol = {item["symbol"]: item for item in market_info}
        snapshots: list[PacificaMarketSnapshot] = []

        for item in market_prices:
            symbol = str(item["symbol"]).upper()
            if symbols_filter and symbol not in symbols_filter:
                continue

            metadata = info_by_symbol.get(symbol)
            if not metadata:
                continue

            snapshot = PacificaMarketSnapshot(
                symbol=symbol,
                base_asset=str(metadata.get("base_asset", symbol)).upper(),
                mark_price=self._to_float(item.get("mark")),
                mid_price=self._to_float(item.get("mid")),
                oracle_price=self._to_float(item.get("oracle")),
                yesterday_price=max(self._to_float(item.get("yesterday_price")), 1e-9),
                price_change_24h=self._price_change_24h(item),
                funding_rate=self._to_float(item.get("funding")),
                next_funding_rate=self._to_float(item.get("next_funding")),
                open_interest=self._to_float(item.get("open_interest")),
                volume_24h=self._to_float(item.get("volume_24h")),
                timestamp=int(item.get("timestamp", 0) or 0),
                tick_size=self._optional_float(metadata.get("tick_size")),
                lot_size=self._optional_float(metadata.get("lot_size")),
                min_order_size=self._optional_float(metadata.get("min_order_size")),
                max_leverage=self._optional_float(metadata.get("max_leverage")),
            )
            snapshots.append(snapshot)

        snapshots.sort(key=lambda snapshot: snapshot.volume_24h, reverse=True)
        if limit is not None:
            snapshots = snapshots[:limit]

        if not include_flow or not snapshots:
            return snapshots

        flow_context = await asyncio.gather(
            *(self._get_flow_context(snapshot.symbol) for snapshot in snapshots)
        )
        return [snapshot.model_copy(update=context) for snapshot, context in zip(snapshots, flow_context)]

    async def get_recent_trades(self, symbol: str, limit: int = 25) -> list[dict]:
        trades = await self._get("/trades", params={"symbol": symbol.upper()})
        return list(trades[:limit])

    async def get_orderbook(self, symbol: str, depth: int = 10) -> dict:
        data = await self._get("/book", params={"symbol": symbol.upper()})
        bids, asks = self._parse_orderbook_levels(data, depth=depth)
        return {
            "symbol": symbol.upper(),
            "bids": [level.model_dump() for level in bids],
            "asks": [level.model_dump() for level in asks],
            "timestamp": int(data.get("t", 0) or 0),
            "sequence": int(data.get("s", 0) or 0),
        }

    async def get_leaderboard(self) -> list[dict]:
        snapshots = await self.get_market_snapshots(limit=6, include_flow=True)
        return [
            {
                "symbol": snapshot.symbol,
                "volume_24h": snapshot.volume_24h,
                "open_interest": snapshot.open_interest,
                "price_change_24h": snapshot.price_change_24h,
                "orderbook_imbalance": snapshot.orderbook_imbalance,
            }
            for snapshot in snapshots
        ]

    async def _get_flow_context(self, symbol: str) -> dict:
        book_data, trade_data = await asyncio.gather(
            self._get("/book", params={"symbol": symbol}),
            self._get("/trades", params={"symbol": symbol}),
        )

        bids, asks = self._parse_orderbook_levels(book_data, depth=10)
        best_bid = bids[0].price if bids else None
        best_ask = asks[0].price if asks else None
        mid = ((best_bid + best_ask) / 2) if best_bid and best_ask else None
        spread_bps = (((best_ask - best_bid) / mid) * 10_000) if mid else None

        bid_size = sum(level.amount for level in bids[:5])
        ask_size = sum(level.amount for level in asks[:5])
        total_size = bid_size + ask_size
        orderbook_imbalance = ((bid_size - ask_size) / total_size) if total_size else 0.0

        recent_trades = list(trade_data[:25])
        buy_volume = 0.0
        sell_volume = 0.0
        for trade in recent_trades:
            amount = self._to_float(trade.get("amount"))
            side = str(trade.get("side", "")).lower()
            if side in {"open_long", "close_short"}:
                buy_volume += amount
            elif side in {"open_short", "close_long"}:
                sell_volume += amount

        total_trade_volume = buy_volume + sell_volume
        trade_flow_bias = (
            (buy_volume - sell_volume) / total_trade_volume if total_trade_volume else 0.0
        )

        last_trade = recent_trades[0] if recent_trades else {}

        return {
            "best_bid": best_bid,
            "best_ask": best_ask,
            "spread_bps": spread_bps,
            "orderbook_imbalance": orderbook_imbalance,
            "trade_flow_bias": trade_flow_bias,
            "recent_trade_count": len(recent_trades),
            "last_trade_price": self._optional_float(last_trade.get("price")),
            "last_trade_side": last_trade.get("side"),
            "bids": bids,
            "asks": asks,
        }

    def _parse_orderbook_levels(
        self,
        payload: dict,
        depth: int,
    ) -> tuple[list[OrderbookLevel], list[OrderbookLevel]]:
        sides = payload.get("l", [])
        bids_payload = sides[0] if len(sides) > 0 else []
        asks_payload = sides[1] if len(sides) > 1 else []

        bids = [self._parse_level(level) for level in bids_payload[:depth]]
        asks = [self._parse_level(level) for level in asks_payload[:depth]]
        return bids, asks

    def _parse_level(self, payload: dict) -> OrderbookLevel:
        return OrderbookLevel(
            price=self._to_float(payload.get("p")),
            amount=self._to_float(payload.get("a")),
            order_count=int(payload.get("n", 0) or 0),
        )

    async def _get(self, path: str, params: dict | None = None) -> list | dict:
        response = await self._client.get(path, params=params)
        response.raise_for_status()
        payload = response.json()

        return payload.get("data", payload)

    def _price_change_24h(self, item: dict) -> float:
        yesterday_price = self._to_float(item.get("yesterday_price"))
        if yesterday_price <= 0:
            return 0.0
        mark_price = self._to_float(item.get("mark"))
        return (mark_price - yesterday_price) / yesterday_price

    def _to_float(self, value: object) -> float:
        if value in (None, ""):
            return 0.0
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return 0.0
            if value.lower() in {"n/a", "null", "undefined"}:
                return 0.0
        try:
            return float(value)
        except (ValueError, TypeError):
            logger.debug("Unable to parse Pacifica float value: %r", value)
            return 0.0

    def _optional_float(self, value: object) -> float | None:
        if value in (None, ""):
            return None
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
            if value.lower() in {"n/a", "null", "undefined"}:
                return None
        try:
            return float(value)
        except (ValueError, TypeError):
            logger.debug("Unable to parse optional Pacifica float value: %r", value)
            return None
