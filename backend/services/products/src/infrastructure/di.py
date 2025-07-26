from functools import lru_cache

from fastapi import Depends

from src.application.product_service import ProductService
from src.domain.ports import ProductRepositoryPort, ProductServicePort
from src.infrastructure.adapters.db.dynamodb_repository import DynamoDBProductRepo
from src.infrastructure.adapters.client.s3_image_client import S3ImageClient
from config import settings


@lru_cache()
def get_repository() -> ProductRepositoryPort:
    return DynamoDBProductRepo()


@lru_cache()
def get_image_client() -> S3ImageClient:
    return S3ImageClient(bucket_name=settings.PRODUCTS_TABLE_NAME)


@lru_cache()  # ← also a singleton
def get_product_service(
    repo: ProductRepositoryPort = Depends(get_repository),
    image_client: S3ImageClient = Depends(get_image_client),
) -> ProductServicePort:
    return ProductService(repository=repo, image_client=image_client)
