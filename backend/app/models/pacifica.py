from pydantic import BaseModel, Field


class OrderbookLevel(BaseModel):
    price: float = Field(gt=0)
    amount: float = Field(ge=0)
    order_count: int = Field(ge=0)


class PacificaMarketSnapshot(BaseModel):
    symbol: str
    base_asset: str
    mark_price: float = Field(gt=0)
    mid_price: float = Field(gt=0)
    oracle_price: float = Field(gt=0)
    yesterday_price: float = Field(gt=0)
    price_change_24h: float
    funding_rate: float
    next_funding_rate: float
    open_interest: float = Field(ge=0)
    volume_24h: float = Field(ge=0)
    timestamp: int
    tick_size: float | None = Field(default=None, gt=0)
    lot_size: float | None = Field(default=None, gt=0)
    min_order_size: float | None = Field(default=None, gt=0)
    max_leverage: float | None = Field(default=None, gt=0)
    best_bid: float | None = Field(default=None, gt=0)
    best_ask: float | None = Field(default=None, gt=0)
    spread_bps: float | None = None
    orderbook_imbalance: float | None = None
    trade_flow_bias: float | None = None
    recent_trade_count: int = 0
    last_trade_price: float | None = Field(default=None, gt=0)
    last_trade_side: str | None = None
    bids: list[OrderbookLevel] = Field(default_factory=list)
    asks: list[OrderbookLevel] = Field(default_factory=list)
