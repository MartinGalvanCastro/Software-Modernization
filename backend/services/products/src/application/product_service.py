from typing import List
from uuid import UUID
from decimal import Decimal

from src.domain.entities import Price, Product
from src.domain.exceptions import DuplicateProductError, InvalidPriceError, NotFoundError
from src.domain.ports import ProductRepositoryPort, ProductServicePort


class ProductService(ProductServicePort):
    """
    Implements the application use-cases for products, enforcing business rules
    and coordinating persistence.
    """

    def __init__(self, repository: ProductRepositoryPort):
        self._repo = repository

    async def list_products(self) -> List[Product]:
        return await self._repo.list_all()

    async def get_product(self, code: UUID) -> Product:
        product = await self._repo.get_by_code(code)
        if product is None:
            raise NotFoundError(code)
        return product

    async def create_product(
        self,
        name: str,
        description: str,
        price: Decimal
    ) -> Product:
        Price(price)  # raises InvalidPriceError if <= 0

        # enforce name uniqueness via GSI
        if await self._repo.get_by_name(name) is not None:
            raise DuplicateProductError("name", name)

        return await self._repo.create(
            name=name,
            description=description,
            price=price,
        )

    async def update_product(
        self,
        code: UUID,
        name: str,
        description: str,
        price: Decimal
    ) -> Product:
        existing = await self._repo.get_by_code(code)
        if existing is None:
            raise NotFoundError(code)

        Price(price)  # raises InvalidPriceError if <= 0

        return await self._repo.update(
            code=code,
            name=name,
            description=description,
            price=price,
        )

    async def delete_product(self, code: UUID) -> None:
        await self._repo.delete(code)
