from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_TITLE: str = "Products API"
    APP_DESCRIPTION: str = "API for managing products (El Peppepe)"
    APP_VERSION: str = "1.0.0"
    AWS_REGION: str
    PRODUCTS_TABLE_NAME: str
    DYNAMODB_ENDPOINT_URL: str = ""
#    JWT_ISSUER: str
#    JWT_AUDIENCE: str

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
