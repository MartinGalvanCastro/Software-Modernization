from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from datetime import date

from src.domain.entities import Sale


class SaleRepositoryPort(ABC):
    """
    Outbound port: defines persistence operations required by the domain for Sales.
    """

    @abstractmethod
    async def list_all(self) -> List[Sale]:
        """
        Retrieve all sales from the data store.

        :return: List of Sale entities.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, sale_id: UUID) -> Optional[Sale]:
        """
        Fetch a single sale by its UUID.

        :param sale_id: UUID of the sale.
        :return: Sale entity if found, otherwise None.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_invoice(self, invoice_number: str) -> Optional[Sale]:
        """
        Fetch a single sale by its invoice number.

        This supports enforcing uniqueness of invoice_number
        during creation.

        :param invoice_number: Unique invoice identifier.
        :return: Sale entity if one exists with that invoice, otherwise None.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create(
        self,
        invoice_number: str,
        sale_date: date,
        seller_code: UUID,
        product_code: UUID
    ) -> Sale:
        """
        Persist a new sale record, generating its UUID and created_at timestamp.

        :param invoice_number: Unique invoice identifier.
        :param sale_date:       Date of the sale (must be ≤ today).
        :param seller_code:     UUID of the seller (assumed valid).
        :param product_code:    UUID of the product (assumed valid).
        :return:                The created Sale entity.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, sale_id: UUID) -> None:
        """
        Remove a sale by its UUID.

        :param sale_id: UUID of the sale to delete.
        """
        raise NotImplementedError()

    @abstractmethod
    async def ping(self) -> None:
        """
        Check connectivity to the data store (for readiness probes).
        """
        raise NotImplementedError()


class SaleServicePort(ABC):
    """
    Inbound port: defines application use-cases exposed by the Sales domain.
    """

    @abstractmethod
    async def list_sales(self) -> List[Sale]:
        """
        Business use-case: list all existing sales records.

        :return: List of Sale entities.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_sale(self, sale_id: UUID) -> Sale:
        """
        Business use-case: retrieve a sale by its UUID.

        :param sale_id: UUID of the sale.
        :return:        Sale entity.
        :raises NotFoundError: if the sale does not exist.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create_sale(
        self,
        invoice_number: str,
        sale_date: date,
        seller_code: UUID,
        product_code: UUID
    ) -> Sale:
        """
        Business use-case: create a new sale, enforcing local invariants
        (e.g. sale_date ≤ today). Seller and product codes are assumed valid.

        :param invoice_number: Unique invoice identifier.
        :param sale_date:       Date of the sale.
        :param seller_code:     UUID of the seller.
        :param product_code:    UUID of the product.
        :return:                The created Sale entity.
        :raises InvalidSaleError: if any local invariant is violated.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete_sale(self, sale_id: UUID) -> None:
        """
        Business use-case: delete a sale by its UUID.

        :param sale_id: UUID of the sale.
        :raises NotFoundError: if the sale does not exist.
        """
        raise NotImplementedError()