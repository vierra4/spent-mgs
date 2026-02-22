import os
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(".env")

class Settings:
    def __init__(self):
        self.auth0_domain = os.getenv("AUTH0_DOMAIN")
        self.auth0_api_audience = os.getenv("AUTH0_API_AUDIENCE")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.authorization_header_streams_auth0_token = os.getenv("AUTHORIZATION_HEADER_STREAMS_AUTH0_TOKEN")
        self.webhook_signing_secret = os.getenv("WEBHOOK_SIGNING_SECRET")
        self.auth0_webhook_secret = os.getenv("AUTH0_WEBHOOK_SECRET")
        self.admin_user_model = os.getenv("ADMIN_USER_MODEL")
        self.admin_user_model_username_field = os.getenv("ADMIN_USER_MODEL_USERNAME_FIELD")
        self.admin_secret_key = os.getenv("ADMIN_SECRET_KEY")
        self.namespace = os.getenv("NAMESPACE")
        self.db_url = os.getenv("DB_URL")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
