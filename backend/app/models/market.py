from pydantic import BaseModel, Field


class Market(BaseModel):
    id: str
    question: str
    slug: str
    related_asset: str
    pacifica_symbol: str
    probability: float = Field(ge=0, le=1)
    one_hour_price_change: float | None = None
    one_day_price_change: float | None = None
    one_week_price_change: float | None = None
    volume_24h: float = Field(ge=0)
    liquidity: float = Field(ge=0)
    best_bid: float | None = Field(default=None, ge=0, le=1)
    best_ask: float | None = Field(default=None, ge=0, le=1)
    last_trade_price: float | None = Field(default=None, ge=0, le=1)
    spread: float | None = Field(default=None, ge=0)
    accepting_orders: bool
    clob_token_id: str | None = None
