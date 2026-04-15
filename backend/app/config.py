import logging
import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
logger = logging.getLogger(__name__)

def _parse_request_timeout_seconds() -> float:
    default_value = 12.0
    raw_value = os.getenv("REQUEST_TIMEOUT_SECONDS")
    if raw_value is None:
        return default_value

    try:
        timeout = float(str(raw_value).strip())
    except (ValueError, TypeError):
        logger.warning(
            "Invalid REQUEST_TIMEOUT_SECONDS value %r; falling back to default %s",
            raw_value,
            default_value,
        )
        return default_value

    if timeout <= 0:
        logger.warning(
            "Non-positive REQUEST_TIMEOUT_SECONDS value %r; falling back to default %s",
            raw_value,
            default_value,
        )
        return default_value

    return timeout


class Settings(BaseModel):
    pacifica_builder_code: str = os.getenv("PACIFICA_BUILDER_CODE", "")
    pacifica_wallet: str = os.getenv("PACIFICA_WALLET", "")
    polymarket_api_key: str = os.getenv("POLYMARKET_API_KEY", "")
    pacifica_api_base: str = os.getenv("PACIFICA_API_BASE", "https://api.pacifica.fi/api/v1")
    polymarket_gamma_api_base: str = os.getenv(
        "POLYMARKET_GAMMA_API_BASE",
        "https://gamma-api.polymarket.com",
    )
    tracked_assets: str = os.getenv("TRACKED_ASSETS", "BTC,ETH,SOL,LINK")
    request_timeout_seconds: float = _parse_request_timeout_seconds()


@lru_cache
def get_settings() -> Settings:
    return Settings()
