from typing import Literal

from pydantic import BaseModel, Field


class Signal(BaseModel):
    signal_id: str
    market_question: str
    market_slug: str
    related_asset: str
    pacifica_symbol: str
    signal_type: Literal["lead", "confirm", "fade"]
    suggested_side: Literal["long", "short"]
    confidence: float = Field(ge=0, le=1)
    urgency: Literal["monitor", "elevated", "immediate"]
    suggested_notional_usd: float = Field(gt=0)
    polymarket_probability: float = Field(ge=0, le=1)
    polymarket_move_1h: float | None = None
    polymarket_move_1d: float | None = None
    polymarket_volume_24h: float = Field(ge=0)
    pacifica_mark_price: float = Field(gt=0)
    pacifica_price_change_24h: float
    pacifica_funding_rate: float
    pacifica_orderbook_imbalance: float | None = None
    pacifica_trade_flow_bias: float | None = None
    rationale: str
