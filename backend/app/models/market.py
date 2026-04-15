from typing import Literal

from pydantic import BaseModel, Field


class Market(BaseModel):
    id: str
    question: str
    event_slug: str
    category: str
    outcome: str = "YES"
    related_asset: str | None = None
    pacifica_market: str | None = None
    probability: float = Field(ge=0, le=1)
    probability_change_1h: float
    probability_change_24h: float
    volume_24h_usd: float = Field(ge=0)
    bias: Literal["bullish", "bearish", "neutral"]
