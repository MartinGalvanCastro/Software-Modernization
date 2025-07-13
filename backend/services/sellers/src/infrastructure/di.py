from functools import lru_cache

from fastapi import Depends

from src.application.sellers_service import SellerService
from src.domain.ports import SellerRepositoryPort, SellerServicePort
from src.infrastructure.adapters.db.dynamodb_repository import DynamoDBSellerRepo


@lru_cache()
def get_repository() -> SellerRepositoryPort:
    """
    Returns a singleton SellerRepositoryPort implementation.
    """
    return DynamoDBSellerRepo()


@lru_cache()
def get_service(
    repo: SellerRepositoryPort = Depends(get_repository),
) -> SellerServicePort:
    """
    Returns a singleton SellerServicePort implementation,
    wired up with the DynamoDBSellerRepo.
    """
    return SellerService(repository=repo)