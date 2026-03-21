from pydantic import BaseModel


class Signal(BaseModel):
    market: str
    odds_shift: float
    suggested_action: str
