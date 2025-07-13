import asyncio
from datetime import UTC, datetime
from typing import List
from uuid import UUID, uuid4
from decimal import Decimal

from src.domain.entities import Price, Product
from src.domain.exceptions import (
    DuplicateProductError,
    InvalidPriceError,
    NotFoundError,
)
from src.domain.ports import ProductRepositoryPort, ProductServicePort


class ProductService(ProductServicePort):
    """
    Implements the application use-cases for products, enforcing business rules
    and coordinating persistence.
    """

    def __init__(self, repository: ProductRepositoryPort):
        self._repo = repository

    async def list_products(self) -> List[Product]:
        """Return all products from the repository."""
        return await self._repo.list_all()

    async def get_product(self, code: UUID) -> Product:
        """
        Retrieve a product by its UUID code.

        :raises NotFoundError: if no product with the given code exists.
        """
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
        """
        Build, validate, and persist a new Product.

        :param name:        Name of the product.
        :param description: Description of the product.
        :param price:       Price (must be > 0).
        :returns:           The created Product, with UUID and timestamps.
        :raises InvalidPriceError:     if price <= 0.
        :raises DuplicateProductError: if code or name already exists.
        """
        # Validate price VO
        Price(price)  # will raise InvalidPriceError if <= 0

        # Build new candidate
        now = datetime.now(UTC)
        candidate = Product(
            code=uuid4(),
            name=name,
            description=description,
            price=Price(price),
            created_at=now,
            updated_at=now,
        )

        # In parallel: check duplicate code & fetch all products
        existing, all_products = await asyncio.gather(
            self._repo.get_by_code(candidate.code),
            self._repo.list_all()
        )

        if existing is not None:
            raise DuplicateProductError("code", candidate.code)

        if any(p.name == name for p in all_products):
            raise DuplicateProductError("name", name)

        # Persist and return
        return await self._repo.create(candidate)

    async def update_product(
        self,
        code: UUID,
        name: str,
        description: str,
        price: Decimal
    ) -> Product:
        """
        Update an existing product’s name, description, and price.

        :param code:        UUID of the product to update.
        :param name:        New name.
        :param description: New description.
        :param price:       New price (must be > 0).
        :returns:           The updated Product.
        :raises NotFoundError:        if no product with given code exists.
        :raises InvalidPriceError:    if price <= 0.
        """
        existing = await self._repo.get_by_code(code)
        if existing is None:
            raise NotFoundError(code)

        # Validate price VO
        Price(price)

        # Build updated entity
        updated = Product(
            code=code,
            name=name,
            description=description,
            price=Price(price),
            created_at=existing.created_at,
            updated_at=datetime.now(UTC),
        )

        return await self._repo.update(updated)

    async def delete_product(self, code: UUID) -> None:
        """
        Delete a product by its UUID code.

        :param code: UUID of the product to delete.
        :raises NotFoundError: if no product with given code exists.
        """
        await self._repo.delete(code)
