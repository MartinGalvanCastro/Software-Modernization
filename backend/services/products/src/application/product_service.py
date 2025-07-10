import asyncio
from datetime import UTC, datetime
from typing import List

from src.domain.entities import Price, Product
from src.domain.exceptions import (
    DuplicateProductError,
    InvalidPriceError,
    NotFoundError,
)
from src.domain.ports import ProductRepositoryPort, ProductServicePort


class ProductService(ProductServicePort):
    """
    Implements the application use-cases for products, enforcing business rules and coordinating persistence.
    """

    def __init__(self, repository: ProductRepositoryPort):
        self._repo = repository

    async def list_products(self) -> List[Product]:
        """Return all products from the repository."""
        return await self._repo.list_all()

    async def get_product(self, code: str) -> Product:
        """Retrieve a product by code, or raise NotFoundError."""
        product = await self._repo.get_by_code(code)
        if product is None:
            raise NotFoundError(code)
        return product

    async def create_product(self, product: Product) -> None:
        """
        Create a new product after validating business rules:
        - Price > 0 (enforced by Price VO)
        - Unique code
        - Unique name
        """
        try:
            _ = Price(amount=product.price.amount)
        except InvalidPriceError as e:
            raise e

        code_check_coro = self._repo.get_by_code(product.code)
        list_check_coro = self._repo.list_all()
        existing_by_code, all_products = await asyncio.gather(
            code_check_coro, list_check_coro
        )

        if existing_by_code is not None:
            raise DuplicateProductError("code", product.code)

        if any(p.name == product.name for p in all_products):
            raise DuplicateProductError("name", product.name)

        now = datetime.now(UTC)
        new_product = Product(
            code=product.code,
            name=product.name,
            description=product.description,
            price=product.price,
            created_at=now,
            updated_at=now,
        )
        await self._repo.create(new_product)

    async def update_product(self, product: Product) -> None:
        """
        Update an existing product:
        - Must exist
        - Price > 0
        """
        existing = await self._repo.get_by_code(product.code)
        if existing is None:
            raise NotFoundError(product.code)

        # Validate price
        try:
            _ = Price(amount=product.price.amount)
        except InvalidPriceError as e:
            raise e

        now = datetime.now(UTC)
        updated_product = Product(
            code=product.code,
            name=product.name,
            description=product.description,
            price=product.price,
            created_at=existing.created_at,
            updated_at=now,
        )
        await self._repo.update(updated_product)

    async def delete_product(self, code: str) -> None:
        """
        Delete a product by code. If the product does not exist, the repository
        should raise NotFoundError.
        """
        await self._repo.delete(code)
