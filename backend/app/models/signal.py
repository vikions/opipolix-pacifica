from typing import Literal

from pydantic import BaseModel, Field


class Signal(BaseModel):
    signal_id: str
    market_question: str
    market_slug: str
    related_asset: str
    pacifica_market: str
    market_probability: float = Field(ge=0, le=1)
    probability_change_1h: float
    probability_change_24h: float
    volume_24h_usd: float = Field(ge=0)
    signal_type: Literal["open", "hedge", "press"]
    trigger_direction: Literal["up", "down"]
    suggested_side: Literal["long", "short"]
    confidence: float = Field(ge=0, le=1)
    urgency: Literal["monitor", "elevated", "immediate"]
    suggested_size_usd: float = Field(gt=0)
    existing_exposure_usd: float
    existing_exposure_side: Literal["long", "short", "flat"]
    rationale: str
