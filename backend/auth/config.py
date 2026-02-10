from functools import lru_cache

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
   auth0_domain: str
   auth0_api_audience: str
   gemini_api_key: str
   authorization_header_streams_auth0_token: str
   webhook_signing_secret:str
   auth0_webhook_secret:str
   admin_user_model:str
   admin_user_model_username_field:str
   admin_secret_key:str
   # namespace 
   namespace:str
   db_url: str

   class Config:
       env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()