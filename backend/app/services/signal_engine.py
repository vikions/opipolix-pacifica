from app.models.market import Market
from app.models.position import Position
from app.models.signal import Signal
from app.services.pacifica_client import PacificaClient
from app.services.polymarket_client import PolymarketClient


class SignalEngine:
    def __init__(self) -> None:
        self.pacifica = PacificaClient()
        self.polymarket = PolymarketClient()

    async def generate(self) -> list[Signal]:
        markets = await self.polymarket.get_markets()
        positions = await self.pacifica.get_positions()

        signals = [
            self._build_signal(market, positions)
            for market in markets
            if self._is_actionable(market)
        ]

        urgency_rank = {"monitor": 0, "elevated": 1, "immediate": 2}
        return sorted(
            signals,
            key=lambda signal: (urgency_rank[signal.urgency], signal.confidence),
            reverse=True,
        )

    def _is_actionable(self, market: Market) -> bool:
        if market.related_asset is None or market.pacifica_market is None:
            return False

        return abs(market.probability_change_24h) >= 0.04

    def _build_signal(self, market: Market, positions: list[Position]) -> Signal:
        desired_side = "long" if market.probability_change_24h > 0 else "short"
        trigger_direction = "up" if market.probability_change_24h > 0 else "down"

        exposure_usd = self._net_exposure_usd(positions, market.related_asset or "")
        exposure_side = self._exposure_side(exposure_usd)
        signal_type = self._signal_type(desired_side, exposure_side)
        confidence = self._confidence_score(market)
        urgency = self._urgency_level(market)
        suggested_size_usd = self._suggested_size_usd(
            market=market,
            desired_side=desired_side,
            exposure_side=exposure_side,
        )

        return Signal(
            signal_id=f"{market.event_slug}-{desired_side}",
            market_question=market.question,
            market_slug=market.event_slug,
            related_asset=market.related_asset or "UNKNOWN",
            pacifica_market=market.pacifica_market or "UNKNOWN",
            market_probability=market.probability,
            probability_change_1h=market.probability_change_1h,
            probability_change_24h=market.probability_change_24h,
            volume_24h_usd=market.volume_24h_usd,
            signal_type=signal_type,
            trigger_direction=trigger_direction,
            suggested_side=desired_side,
            confidence=confidence,
            urgency=urgency,
            suggested_size_usd=suggested_size_usd,
            existing_exposure_usd=abs(exposure_usd),
            existing_exposure_side=exposure_side,
            rationale=self._build_rationale(
                market=market,
                desired_side=desired_side,
                signal_type=signal_type,
                exposure_usd=exposure_usd,
                suggested_size_usd=suggested_size_usd,
            ),
        )

    def _net_exposure_usd(self, positions: list[Position], asset: str) -> float:
        signed_exposures = [
            position.notional_usd if position.side == "long" else -position.notional_usd
            for position in positions
            if position.asset == asset
        ]
        return sum(signed_exposures)

    def _exposure_side(self, exposure_usd: float) -> str:
        if exposure_usd > 0:
            return "long"
        if exposure_usd < 0:
            return "short"
        return "flat"

    def _signal_type(self, desired_side: str, exposure_side: str) -> str:
        if exposure_side == "flat":
            return "open"
        if exposure_side == desired_side:
            return "press"
        return "hedge"

    def _confidence_score(self, market: Market) -> float:
        move_24h_score = min(abs(market.probability_change_24h) / 0.12, 1.0)
        move_1h_score = min(abs(market.probability_change_1h) / 0.04, 1.0)
        volume_score = min(market.volume_24h_usd / 2_000_000, 1.0)

        raw_score = 0.44 + (move_24h_score * 0.28) + (move_1h_score * 0.18) + (volume_score * 0.1)
        return round(min(raw_score, 0.97), 2)

    def _urgency_level(self, market: Market) -> str:
        if abs(market.probability_change_1h) >= 0.025 or abs(market.probability_change_24h) >= 0.09:
            return "immediate"
        if abs(market.probability_change_1h) >= 0.012 or abs(market.probability_change_24h) >= 0.05:
            return "elevated"
        return "monitor"

    def _suggested_size_usd(self, market: Market, desired_side: str, exposure_side: str) -> float:
        base_size = 14_000
        move_component = abs(market.probability_change_24h) * 180_000
        tape_component = abs(market.probability_change_1h) * 120_000
        liquidity_component = min(market.volume_24h_usd * 0.004, 12_000)

        if exposure_side == "flat":
            inventory_component = 4_000
        elif exposure_side == desired_side:
            inventory_component = -3_000
        else:
            inventory_component = 10_000

        size = base_size + move_component + tape_component + liquidity_component + inventory_component
        return round(max(size, 10_000), -2)

    def _build_rationale(
        self,
        market: Market,
        desired_side: str,
        signal_type: str,
        exposure_usd: float,
        suggested_size_usd: float,
    ) -> str:
        exposure_text = "flat book"
        if exposure_usd > 0:
            exposure_text = f"net long ${abs(exposure_usd):,.0f}"
        elif exposure_usd < 0:
            exposure_text = f"net short ${abs(exposure_usd):,.0f}"

        action_text = {
            "open": "open fresh exposure",
            "hedge": "counter the current book",
            "press": "press the existing bias",
        }[signal_type]

        direction_text = "upside" if desired_side == "long" else "downside"
        return (
            f"{market.question} repriced {self._format_points(market.probability_change_24h)} over 24h "
            f"and {self._format_points(market.probability_change_1h)} in the last hour. "
            f"With the {market.related_asset} book currently {exposure_text}, the desk should "
            f"{action_text} through {market.pacifica_market} {desired_side} for about "
            f"${suggested_size_usd:,.0f} to capture the {direction_text} shift."
        )

    def _format_points(self, value: float) -> str:
        sign = "+" if value > 0 else ""
        return f"{sign}{value * 100:.1f} pts"
