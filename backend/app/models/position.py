from pydantic import BaseModel


class Position(BaseModel):
    market: str
    side: str
    size: float
    entry_price: float
