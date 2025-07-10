from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.entities import Product


class ProductRepositoryPort(ABC):
    """
    Outbound port: defines persistence operations required by the domain for Products.
    """

    @abstractmethod
    async def list_all(self) -> List[Product]:
        """
        Retrieve all products from the data store.

        :return: List of Product entities.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_code(self, code: str) -> Optional[Product]:
        """
        Fetch a single product by its unique code.

        :param code: Product code identifier.
        :return: Product entity if found, otherwise None.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create(self, product: Product) -> None:
        """
        Persist a new product in the data store.

        :param product: Product entity to create.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update(self, product: Product) -> None:
        """
        Update an existing product in the data store.

        :param product: Product entity with updated values.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, code: str) -> None:
        """
        Remove a product from the data store by its code.

        :param code: Product code identifier to delete.
        """
        raise NotImplementedError()

    async def ping(self) -> None:
        """
        Check connectivity to the data store.
        """
        pass


class ProductServicePort(ABC):
    """
    Inbound port: defines application use-cases exposed by the domain for Products.
    """

    @abstractmethod
    async def list_products(self) -> List[Product]:
        """
        Business use-case: list all available products.

        :return: List of Product entities.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_product(self, code: str) -> Product:
        """
        Business use-case: retrieve a product by its code.

        :param code: Product code identifier.
        :return: Product entity.
        :raises NotFoundError: if product does not exist.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create_product(self, product: Product) -> None:
        """
        Business use-case: create a new product after applying domain rules.

        :param product: Product entity to create.
        :raises DuplicateProductError: if a product with the same code or name exists.
        :raises InvalidPriceError: if product price is invalid.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update_product(self, product: Product) -> None:
        """
        Business use-case: update an existing product's details.

        :param product: Product entity with updated attributes.
        :raises NotFoundError: if the product to update does not exist.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete_product(self, code: str) -> None:
        """
        Business use-case: delete a product by its code.

        :param code: Product code identifier to delete.
        :raises NotFoundError: if the product to delete does not exist.
        """
        raise NotImplementedError()
