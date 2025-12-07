import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # app 기준 -> backend
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    ENV: str = os.getenv("ENV", "local")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change_me_later")

settings = Settings()
