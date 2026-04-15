from typing import Literal

from pydantic import BaseModel, Field


class Position(BaseModel):
    market: str
    asset: str
    side: Literal["long", "short"]
    size: float = Field(gt=0)
    entry_price: float = Field(gt=0)
    mark_price: float = Field(gt=0)
    leverage: float = Field(gt=0)
    notional_usd: float = Field(gt=0)
    unrealized_pnl_usd: float
