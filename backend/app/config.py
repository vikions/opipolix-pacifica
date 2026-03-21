import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    pacifica_builder_code: str = os.getenv("PACIFICA_BUILDER_CODE", "")
    pacifica_wallet: str = os.getenv("PACIFICA_WALLET", "")
    polymarket_api_key: str = os.getenv("POLYMARKET_API_KEY", "")


@lru_cache
def get_settings() -> Settings:
    return Settings()
