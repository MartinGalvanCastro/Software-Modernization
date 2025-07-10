from functools import lru_cache

from fastapi import Depends

from src.application.product_service import ProductService
from src.domain.ports import ProductRepositoryPort, ProductServicePort
from src.infrastructure.adapters.db.dynamodb_repository import DynamoDBProductRepo


@lru_cache()
def get_repository() -> ProductRepositoryPort:
    return DynamoDBProductRepo()


@lru_cache()  # ← also a singleton
def get_product_service(
    repo: ProductRepositoryPort = Depends(get_repository),
) -> ProductServicePort:
    return ProductService(repository=repo)
