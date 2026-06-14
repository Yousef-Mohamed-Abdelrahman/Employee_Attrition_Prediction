from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_path: Path = ROOT_DIR / "models" / "xgb_model.pkl"
    model_columns_path: Path = ROOT_DIR / "models" / "model_columns.pkl"
    income_median_path: Path = ROOT_DIR / "models" / "income_median.pkl"
    threshold_path: Path = ROOT_DIR / "models" / "threshold.pkl"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="ATTRITION_",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

