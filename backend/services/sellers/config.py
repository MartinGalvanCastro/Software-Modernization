from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_TITLE: str = "Sellers API"
    APP_DESCRIPTION: str = "API for managing sellers  "
    APP_VERSION: str = "1.0.0"
    AWS_REGION: str
    SELLERS_TABLE_NAME: str
    DYNAMODB_ENDPOINT_URL: str = ""
    LOG_LEVEL: str = "INFO"
    COGNITO_USERPOOL_ID: str
    COGNITO_APP_CLIENT_ID: str

    @property
    def cognito_issuer(self) -> str:
        return f"https://cognito-idp.{self.AWS_REGION}.amazonaws.com/{self.COGNITO_USERPOOL_ID}"

    @property
    def cognito_jwks_url(self) -> str:
        return f"{self.cognito_issuer}/.well-known/jwks.json"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
