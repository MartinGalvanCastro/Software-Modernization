# src/domain/ports.py

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from src.domain.entities import Seller


class SellerRepositoryPort(ABC):
    """
    Outbound port: defines persistence operations required by the domain for Sellers.
    """

    @abstractmethod
    async def list_all(self) -> List[Seller]:
        """
        Retrieve all sellers from the data store.
        :return: List of Seller entities.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_code(self, code: UUID) -> Optional[Seller]:
        """
        Fetch a single seller by its UUID code.
        :param code: UUID of the seller.
        :return: Seller entity if found, otherwise None.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[Seller]:
        """
        Fetch a single seller by its email address.
        This will use the GSI on the 'email' attribute.
        :param email: Email of the seller.
        :return: Seller entity if found, otherwise None.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create(self, name: str, email: str) -> Seller:
        """
        Persist a new seller, generating its UUID and timestamps.
        :param name:  Seller’s name.
        :param email: Seller’s unique email (GSI).
        :return:      The created Seller entity.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update(self, code: UUID, name: str, email: str) -> Seller:
        """
        Update an existing seller’s name or email, refresh updated_at.
        :param code:  UUID of the seller to update.
        :param name:  New name.
        :param email: New email (must remain unique).
        :return:      The updated Seller entity.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, code: UUID) -> None:
        """
        Remove a seller by its UUID.
        :param code: UUID of the seller to delete.
        """
        raise NotImplementedError()

    @abstractmethod
    async def ping(self) -> None:
        """
        Check connectivity to the data store (for readiness probes).
        """
        raise NotImplementedError()


class SellerServicePort(ABC):
    """
    Inbound port: defines application use-cases exposed by the domain for Sellers.
    """

    @abstractmethod
    async def list_sellers(self) -> List[Seller]:
        """
        Business use-case: list all sellers.
        """
        raise NotImplementedError()

    @abstractmethod
    async def get_seller(self, code: UUID) -> Seller:
        """
        Retrieve a seller by its UUID.
        :raises NotFoundError: if seller does not exist.
        """
        raise NotImplementedError()

    @abstractmethod
    async def create_seller(self, name: str, email: str) -> Seller:
        """
        Create a new seller, enforcing unique‐email invariant.
        :raises DuplicateSellerError: if a seller with the same email exists.
        """
        raise NotImplementedError()

    @abstractmethod
    async def update_seller(self, code: UUID, name: str, email: str) -> Seller:
        """
        Update an existing seller’s details.
        :raises NotFoundError:         if seller does not exist.
        :raises DuplicateSellerError:  if the new email collides.
        """
        raise NotImplementedError()

    @abstractmethod
    async def delete_seller(self, code: UUID) -> None:
        """
        Delete a seller by its UUID.
        :raises NotFoundError: if seller does not exist.
        """
        raise NotImplementedError()
