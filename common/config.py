from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env"),
        extra="ignore",
        env_ignore_empty=True,
    )

    # Параметры БД
    POSTGRES_URL: str
    BACKEND_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    #LLM_BASE_URL: str = "http://localhost:8000/v1"
    #MODELS_STORAGE_DIR: str = "/data/models"
    #PREDICTION_TIMEOUT_SEC: int = 240


config = Config()