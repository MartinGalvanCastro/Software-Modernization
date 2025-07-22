import asyncio
from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4

from src.domain.entities import Seller
from src.domain.exceptions import DuplicateSellerError, NotFoundError
from src.domain.ports import SellerRepositoryPort, SellerServicePort


class SellerService(SellerServicePort):
    """
    Implements the application use‐cases for sellers, enforcing:
      - uniqueness of email (via GSI)
      - existence checks on get/update/delete
      - timestamping of created_at / updated_at
    """

    def __init__(self, repository: SellerRepositoryPort):
        self._repo = repository

    async def list_sellers(self) -> List[Seller]:
        """Return all sellers."""
        return await self._repo.list_all()

    async def get_seller(self, code: UUID) -> Seller:
        """
        Retrieve a seller by UUID, or raise NotFoundError.
        """
        seller = await self._repo.get_by_code(code)
        if seller is None:
            raise NotFoundError(code)
        return seller

    async def create_seller(self, name: str, email: str) -> Seller:
        """
        Create a new seller:
         - email must be unique (checks GSI via get_by_email)
         - generates UUID, created_at and updated_at
        """
        # check uniqueness
        existing = await self._repo.get_by_email(email)
        if existing is not None:
            raise DuplicateSellerError("email", email)

        # persist & return the fully‐populated Seller
        return await self._repo.create(name=name, email=email)

    async def update_seller(self, code: UUID, name: str, email: str) -> Seller:
        """
        Update an existing seller. If changing email, re-validate uniqueness.
        """
        # Kick off both lookups at once
        fetch_by_code, fetch_by_email = await asyncio.gather(
            self._repo.get_by_code(code),
            self._repo.get_by_email(email),
        )

        # 1) Must exist
        if fetch_by_code is None:
            raise NotFoundError(code)

        # 2) If the requested email differs from the current one,
        #    then a fetched-by-email result means a collision.
        if fetch_by_code.email != email and fetch_by_email is not None:
            raise DuplicateSellerError("email", email)

        # 3) Perform the update
        return await self._repo.update(
            code=code,
            name=name,
            email=email,
        )

    async def delete_seller(self, code: UUID) -> None:
        """
        Delete a seller by UUID, or raise NotFoundError if missing.
        """
        await self._repo.delete(code)
