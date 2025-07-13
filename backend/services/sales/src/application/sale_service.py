# src/application/services/sale_service.py

import asyncio
from datetime import UTC, datetime
from typing import List
from uuid import UUID

from src.domain.entities import Sale
from src.domain.exceptions import (
    DuplicateSaleError,
    InvalidSaleError,
    NotFoundError,
)
from src.domain.ports import SaleRepositoryPort, SaleServicePort


class SaleService(SaleServicePort):
    """
    Implements the sales use-cases, enforcing domain rules and coordinating persistence.
    """

    def __init__(self, repository: SaleRepositoryPort):
        self._repo = repository

    async def list_sales(self) -> List[Sale]:
        """Return all recorded sales."""
        return await self._repo.list_all()

    async def get_sale(self, sale_id: UUID) -> Sale:
        """
        Retrieve a sale by its UUID.

        :raises NotFoundError: if no such sale exists.
        """
        sale = await self._repo.get_by_id(sale_id)
        if sale is None:
            raise NotFoundError(sale_id)
        return sale

    async def create_sale(
        self,
        invoice_number: str,
        sale_date: datetime.date,
        seller_code: UUID,
        product_code: UUID,
    ) -> Sale:
        """
        Build, validate, and persist a new Sale.

        :param invoice_number: Unique invoice identifier.
        :param sale_date:       Date of the sale (must not be in the future).
        :param seller_code:     UUID of the seller.
        :param product_code:    UUID of the product.
        :returns:               The created Sale entity.
        :raises InvalidSaleError:     if sale_date > today.
        :raises DuplicateSaleError:   if invoice_number already used.
        """
        # 1) enforce date invariant
        if sale_date > datetime.now(UTC).date():
            raise InvalidSaleError("sale_date cannot be in the future")

        # 2) check for existing invoice
        existing_invoice = await self._repo.get_by_invoice(invoice_number)
        if existing_invoice is not None:
            raise DuplicateSaleError(invoice_number)

        # 3) create domain entity
        new_sale = Sale.new(
            invoice_number=invoice_number,
            sale_date=sale_date,
            seller_code=seller_code,
            product_code=product_code,
        )

        # 4) persist and return
        return await self._repo.create(new_sale)

    async def delete_sale(self, sale_id: UUID) -> None:
        """
        Remove a sale by its UUID.

        :raises NotFoundError: if no such sale exists.
        """
        await self._repo.delete(sale_id)
