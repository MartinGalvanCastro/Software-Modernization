from functools import lru_cache
from fastapi import Depends

from src.application.sale_service import SaleService
from src.infrastructure.adapters.db.dynamodb_repository import DynamoDBSaleRepo
from src.domain.ports import SaleRepositoryPort, SaleServicePort


@lru_cache()
def get_repository() -> SaleRepositoryPort:
    """
    Singleton provider for the sales repository.
    """
    return DynamoDBSaleRepo()


@lru_cache()
def get_service(
    repo: SaleRepositoryPort = Depends(get_repository),
) -> SaleServicePort:
    """
    Singleton provider for the sales service, injecting the repository.
    """
    return SaleService(repo)
