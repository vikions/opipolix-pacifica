from pydantic import BaseModel


class Market(BaseModel):
    question: str
    yes_price: float
    no_price: float
