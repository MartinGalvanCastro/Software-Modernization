from abc import ABC, abstractmethod
from typing import List, Optional
from decimal import Decimal
from uuid import UUID

from src.domain.entities import Product


class ProductRepositoryPort(ABC):
    """
    Outbound port: defines persistence operations required by the domain for Products.
    """

    @abstractmethod
    async def list_all(self) -> List[Product]:
        """
        Retrieve all products from the data store.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_code(self, code: UUID) -> Optional[Product]:
        """
        Fetch a single product by its unique UUID code.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_name(self, name: str) -> Optional[Product]:
        """
        Fetch a single product by its unique name via GSI.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create(
        self,
        name: str,
        description: str,
        price: Decimal,
        image_url: str
    ) -> Product:
        """
        Persist a new product in the data store, generating its UUID and timestamps.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update(
        self,
        code: UUID,
        name: str,
        description: str,
        price: Decimal,
        image_url: str
    ) -> Product:
        """
        Update an existing product’s attributes, and refresh its updated_at timestamp.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, code: UUID) -> None:
        """
        Remove a product from the data store by its UUID code.
        """
        raise NotImplementedError()

    @abstractmethod
    async def ping(self) -> None:
        """
        Check connectivity to the data store.
        """
        raise NotImplementedError()


class ProductServicePort(ABC):
    """
    Inbound port: defines application use-cases exposed by the domain for Products.
    """

    @abstractmethod
    async def list_products(self) -> List[Product]:
        """
        Business use-case: list all available products.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_product(self, code: UUID) -> Product:
        """
        Business use-case: retrieve a product by its UUID code.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create_product(self, name: str, description: str, price: Decimal, image_url: str) -> Product:
        """
        Business use-case: create a new product after applying domain rules.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update_product(self, code: UUID, name: str, description: str, price: Decimal, image_url: str) -> Product:
        """
        Business use-case: update an existing product's details.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete_product(self, code: UUID) -> None:
        """
        Business use-case: delete a product by its UUID code.
        """
        raise NotImplementedError()
