import asyncio
import json
import re

import httpx

from app.config import get_settings
from app.models.market import Market


class PolymarketClient:
    SEARCH_TERMS: dict[str, list[str]] = {
        "BTC": ["bitcoin", "btc"],
        "ETH": ["ethereum", "eth"],
        "SOL": ["solana", "sol"],
        "LINK": ["chainlink", "link"],
    }

    PACIFICA_SYMBOLS: dict[str, str] = {
        "BTC": "BTC",
        "ETH": "ETH",
        "SOL": "SOL",
        "LINK": "LINK",
    }

    def __init__(self) -> None:
        self.settings = get_settings()
        self.base_url = self.settings.polymarket_gamma_api_base.rstrip("/")
        self.timeout = self.settings.request_timeout_seconds
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "PolymarketClient":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.aclose()

    async def get_markets(self, assets: list[str] | None = None, per_asset: int = 2) -> list[Market]:
        tracked_assets = assets or self._tracked_assets()
        search_tasks = []

        for asset in tracked_assets:
            for term in self.SEARCH_TERMS.get(asset, [asset.lower()]):
                search_tasks.append(self._search_markets(term))

        search_results = await asyncio.gather(*search_tasks)

        candidates: dict[str, tuple[str, dict]] = {}
        for asset in tracked_assets:
            patterns = self._asset_patterns(asset)
            for result_set in search_results:
                for raw_market in result_set:
                    if not self._matches_asset(raw_market, patterns):
                        continue
                    if not self._is_binary_yes_no_market(raw_market):
                        continue
                    if not raw_market.get("acceptingOrders", False):
                        continue
                    if raw_market.get("closed", False) or not raw_market.get("active", False):
                        continue

                    market_id = str(raw_market["id"])
                    current = candidates.get(market_id)
                    current_score = self._candidate_score(current[1]) if current else -1.0
                    next_score = self._candidate_score(raw_market)
                    if next_score > current_score:
                        candidates[market_id] = (asset, raw_market)

        markets_by_asset: dict[str, list[tuple[dict, dict]]] = {asset: [] for asset in tracked_assets}
        if not candidates:
            return []

        details = await asyncio.gather(
            *(self._get(f"/markets/{market_id}") for market_id in candidates),
            return_exceptions=True,
        )

        for (market_id, (asset, raw_market)), detail in zip(candidates.items(), details):
            detailed_market = raw_market if isinstance(detail, Exception) else detail
            markets_by_asset[asset].append((raw_market, detailed_market))

        selected: list[Market] = []
        for asset, asset_markets in markets_by_asset.items():
            sorted_markets = sorted(
                asset_markets,
                key=lambda item: self._candidate_score(item[0]),
                reverse=True,
            )
            for raw_market, detailed_market in sorted_markets[:per_asset]:
                market = self._normalize_market(asset=asset, raw_market=raw_market, detailed_market=detailed_market)
                if market:
                    selected.append(market)

        selected.sort(key=lambda market: market.volume_24h, reverse=True)
        return selected

    async def get_signals(self) -> list[Market]:
        return await self.get_markets(per_asset=1)

    async def _search_markets(self, term: str) -> list[dict]:
        payload = await self._get(
            "/markets",
            params={
                "active": "true",
                "closed": "false",
                "limit": 30,
                "search": term,
            },
        )
        if isinstance(payload, dict):
            if isinstance(payload.get("data"), list):
                return payload["data"]
            if isinstance(payload.get("results"), list):
                return payload["results"]
            if isinstance(payload.get("markets"), list):
                return payload["markets"]
            return list(payload.values())
        return list(payload)

    def _normalize_market(self, asset: str, raw_market: dict, detailed_market: dict) -> Market | None:
        outcomes = self._parse_json_list(raw_market.get("outcomes"))
        prices = self._parse_json_list(raw_market.get("outcomePrices"))
        token_ids = self._parse_json_list(raw_market.get("clobTokenIds"))

        yes_index = self._yes_index(outcomes)
        if yes_index is None or yes_index >= len(prices):
            return None

        best_bid = self._optional_float(raw_market.get("bestBid"))
        best_ask = self._optional_float(raw_market.get("bestAsk"))
        spread = (best_ask - best_bid) if best_bid is not None and best_ask is not None else None

        return Market(
            id=str(raw_market["id"]),
            question=str(raw_market.get("question", "")),
            slug=str(raw_market.get("slug", "")),
            related_asset=asset,
            pacifica_symbol=self.PACIFICA_SYMBOLS.get(asset, asset),
            probability=self._to_float(prices[yes_index]),
            one_hour_price_change=self._optional_float(detailed_market.get("oneHourPriceChange")),
            one_day_price_change=self._optional_float(detailed_market.get("oneDayPriceChange")),
            one_week_price_change=self._optional_float(detailed_market.get("oneWeekPriceChange")),
            volume_24h=self._to_float(raw_market.get("volume24hr")),
            liquidity=self._to_float(raw_market.get("liquidity")),
            best_bid=best_bid,
            best_ask=best_ask,
            last_trade_price=self._optional_float(raw_market.get("lastTradePrice")),
            spread=spread,
            accepting_orders=bool(raw_market.get("acceptingOrders", False)),
            clob_token_id=token_ids[yes_index] if yes_index < len(token_ids) else None,
        )

    def _tracked_assets(self) -> list[str]:
        return [
            asset.strip().upper()
            for asset in self.settings.tracked_assets.split(",")
            if asset.strip()
        ]

    def _asset_patterns(self, asset: str) -> list[re.Pattern[str]]:
        patterns = {
            "BTC": [r"\bbitcoin\b", r"\bbtc\b"],
            "ETH": [r"\bethereum\b", r"\beth\b"],
            "SOL": [r"\bsolana\b", r"\bsol\b"],
            "LINK": [r"\bchainlink\b", r"\blink\b"],
        }
        return [re.compile(pattern, re.IGNORECASE) for pattern in patterns.get(asset, [asset])]

    def _matches_asset(self, raw_market: dict, patterns: list[re.Pattern[str]]) -> bool:
        haystacks = [
            str(raw_market.get("question", "")),
            str(raw_market.get("slug", "")),
            str(raw_market.get("description", "")),
        ]
        return any(pattern.search(haystack) for pattern in patterns for haystack in haystacks)

    def _is_binary_yes_no_market(self, raw_market: dict) -> bool:
        outcomes = self._parse_json_list(raw_market.get("outcomes"))
        return self._yes_index(outcomes) is not None and len(outcomes) == 2

    def _yes_index(self, outcomes: list[str]) -> int | None:
        normalized = [str(outcome).strip().lower() for outcome in outcomes]
        if "yes" not in normalized or "no" not in normalized:
            return None
        return normalized.index("yes")

    def _parse_json_list(self, value: object) -> list[str]:
        if isinstance(value, list):
            return [str(item) for item in value]
        if isinstance(value, str) and value:
            try:
                parsed = json.loads(value)
            except json.JSONDecodeError:
                return []
            if isinstance(parsed, list):
                return [str(item) for item in parsed]
        return []

    def _candidate_score(self, raw_market: dict) -> float:
        return self._to_float(raw_market.get("volume24hr")) + (self._to_float(raw_market.get("liquidity")) * 0.1)

    async def _get(self, path: str, params: dict | None = None) -> list | dict:
        response = await self._client.get(path, params=params)
        response.raise_for_status()
        return response.json()

    def _to_float(self, value: object) -> float:
        if value is None:
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
            return None
