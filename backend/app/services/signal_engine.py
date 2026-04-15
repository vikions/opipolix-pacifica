from app.models.market import Market
from app.models.pacifica import PacificaMarketSnapshot
from app.models.signal import Signal
from app.services.pacifica_client import PacificaClient
from app.services.polymarket_client import PolymarketClient


class SignalEngine:
    def __init__(self) -> None:
        self.pacifica = PacificaClient()
        self.polymarket = PolymarketClient()

    async def generate(self) -> list[Signal]:
        markets = await self.polymarket.get_markets()
        linked_symbols = sorted(
            {market.pacifica_symbol for market in markets if market.pacifica_symbol is not None}
        )
        snapshots = await self.pacifica.get_market_snapshots(
            symbols=linked_symbols,
            limit=None,
            include_flow=True,
        )
        return self.generate_from_context(markets, snapshots)

    def generate_from_context(
        self,
        markets: list[Market],
        snapshots: list[PacificaMarketSnapshot],
    ) -> list[Signal]:
        snapshots_by_symbol = {snapshot.symbol: snapshot for snapshot in snapshots}
        signals = [
            self._build_signal(market, snapshot)
            for market in markets
            if (snapshot := snapshots_by_symbol.get(market.pacifica_symbol)) is not None
        ]

        urgency_rank = {"monitor": 0, "elevated": 1, "immediate": 2}
        return sorted(
            signals,
            key=lambda signal: (urgency_rank[signal.urgency], signal.confidence),
            reverse=True,
        )

    def _build_signal(self, market: Market, snapshot: PacificaMarketSnapshot) -> Signal:
        prediction_move = self._prediction_move(market)
        pacifica_move = snapshot.price_change_24h if snapshot.price_change_24h is not None else 0.0
        suggested_side = "long" if prediction_move >= 0 else "short"

        if prediction_move == 0:
            suggested_side = "long" if market.probability >= 0.5 else "short"

        signal_type = self._signal_type(prediction_move, pacifica_move)
        confidence = self._confidence_score(market, snapshot, prediction_move)
        urgency = self._urgency_level(market, snapshot, prediction_move)
        suggested_notional_usd = self._suggested_notional_usd(confidence, snapshot)

        return Signal(
            signal_id=f"{market.slug}-{suggested_side}",
            market_question=market.question,
            market_slug=market.slug,
            related_asset=market.related_asset,
            pacifica_symbol=snapshot.symbol,
            signal_type=signal_type,
            suggested_side=suggested_side,
            confidence=confidence,
            urgency=urgency,
            suggested_notional_usd=suggested_notional_usd,
            polymarket_probability=market.probability,
            polymarket_move_1h=market.one_hour_price_change,
            polymarket_move_1d=market.one_day_price_change,
            polymarket_volume_24h=market.volume_24h,
            pacifica_mark_price=snapshot.mark_price,
            pacifica_price_change_24h=snapshot.price_change_24h,
            pacifica_funding_rate=snapshot.funding_rate,
            pacifica_orderbook_imbalance=snapshot.orderbook_imbalance,
            pacifica_trade_flow_bias=snapshot.trade_flow_bias,
            rationale=self._build_rationale(
                market=market,
                snapshot=snapshot,
                prediction_move=prediction_move,
                signal_type=signal_type,
                suggested_side=suggested_side,
                suggested_notional_usd=suggested_notional_usd,
            ),
        )

    def _prediction_move(self, market: Market) -> float:
        if market.one_day_price_change not in (None, 0):
            return float(market.one_day_price_change)
        if market.one_hour_price_change not in (None, 0):
            return float(market.one_hour_price_change)
        if market.one_week_price_change not in (None, 0):
            return float(market.one_week_price_change) * 0.35
        return market.probability - 0.5

    def _signal_type(self, prediction_move: float, pacifica_move: float) -> str:
        if prediction_move == 0:
            return "confirm"
        if pacifica_move == 0:
            return "lead"
        if prediction_move > 0 and pacifica_move < 0:
            return "lead"
        if prediction_move < 0 and pacifica_move > 0:
            return "fade"
        if abs(prediction_move) > abs(pacifica_move) * 1.4:
            return "lead"
        return "confirm"

    def _confidence_score(
        self,
        market: Market,
        snapshot: PacificaMarketSnapshot,
        prediction_move: float,
    ) -> float:
        move_score = min(abs(prediction_move) / 0.08, 1.0)
        volume_score = min((market.volume_24h if market.volume_24h is not None else 0.0) / 50_000, 1.0)
        liquidity_score = min((market.liquidity if market.liquidity is not None else 0.0) / 500_000, 1.0)

        flow_alignment = 0.5
        if snapshot.orderbook_imbalance is not None:
            flow_alignment += self._directional_alignment(prediction_move, snapshot.orderbook_imbalance) * 0.25
        if snapshot.trade_flow_bias is not None:
            flow_alignment += self._directional_alignment(prediction_move, snapshot.trade_flow_bias) * 0.25

        raw = 0.3 + (move_score * 0.28) + (volume_score * 0.16) + (liquidity_score * 0.12) + (flow_alignment * 0.14)
        return round(min(raw, 0.96), 2)

    def _urgency_level(
        self,
        market: Market,
        snapshot: PacificaMarketSnapshot,
        prediction_move: float,
    ) -> str:
        spread_ok = (market.spread or 0) <= 0.03
        tight_book = (snapshot.spread_bps or 999) <= 12

        if abs(prediction_move) >= 0.08 and spread_ok and tight_book:
            return "immediate"
        if abs(prediction_move) >= 0.04 or (snapshot.trade_flow_bias is not None and abs(snapshot.trade_flow_bias) >= 0.35):
            return "elevated"
        return "monitor"

    def _suggested_notional_usd(
        self,
        confidence: float,
        snapshot: PacificaMarketSnapshot,
    ) -> float:
        base_size = 6_000
        conviction_component = confidence * 18_000
        volume_24h = snapshot.volume_24h if snapshot.volume_24h is not None else 0.0
        open_interest = snapshot.open_interest if snapshot.open_interest is not None else 0.0
        liquidity_component = min(volume_24h * 0.0025, 16_000)
        oi_component = min(open_interest * 0.0004, 12_000)
        size = base_size + conviction_component + liquidity_component + oi_component
        return round(max(size, 5_000), -2)

    def _build_rationale(
        self,
        market: Market,
        snapshot: PacificaMarketSnapshot,
        prediction_move: float,
        signal_type: str,
        suggested_side: str,
        suggested_notional_usd: float,
    ) -> str:
        move_text = self._format_pct(prediction_move)
        pacifica_text = self._format_pct(snapshot.price_change_24h if snapshot.price_change_24h is not None else 0.0)
        orderbook_text = self._format_pct(snapshot.orderbook_imbalance or 0)
        trade_text = self._format_pct(snapshot.trade_flow_bias or 0)

        signal_text = {
            "lead": "Prediction flow is leading the perp tape",
            "confirm": "Prediction flow and perp tape are moving together",
            "fade": "Prediction flow is leaning against the current perp move",
        }[signal_type]

        return (
            f"{signal_text}: {market.question} shows {move_text} repricing in the prediction market "
            f"while {snapshot.symbol} is {pacifica_text} over 24h. "
            f"Pacifica book imbalance sits at {orderbook_text} and recent trade flow at {trade_text}, "
            f"so the desk can express the move with a {suggested_side} {snapshot.symbol} perp for about "
            f"${suggested_notional_usd:,.0f}."
        )

    def _directional_alignment(self, prediction_move: float, flow_bias: float) -> float:
        if prediction_move == 0 or flow_bias == 0:
            return 0.5
        if prediction_move > 0 and flow_bias > 0:
            return 1.0
        if prediction_move < 0 and flow_bias < 0:
            return 1.0
        return 0.0

    def _format_pct(self, value: float) -> str:
        sign = "+" if value > 0 else ""
        return f"{sign}{value * 100:.1f}%"
