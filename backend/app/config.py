import os
from dotenv import load_dotenv
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent  # app → backend
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    ENV: str = os.getenv("ENV", "local")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change_me_later")

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    ADMIN_SIGNUP_CODE: str = os.getenv("ADMIN_SIGNUP_CODE", "CHANGE_ME")

    @property
    def is_local(self) -> bool:
        return self.ENV == "local"

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"

settings = Settings()
