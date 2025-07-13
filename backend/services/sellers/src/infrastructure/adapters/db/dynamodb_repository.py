from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4

from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model

from config import settings
from src.domain.entities import Seller
from src.domain.exceptions import NotFoundError, DuplicateSellerError
from src.domain.ports import SellerRepositoryPort


class EmailIndex(GlobalSecondaryIndex):
    """
    Global secondary index to look up a seller by email.
    """
    class Meta:
        index_name = "email-index"
        projection = AllProjection()
        read_capacity_units = 2
        write_capacity_units = 2

    email = UnicodeAttribute(hash_key=True)


class SellerModel(Model):
    """
    PynamoDB model for the sellers table, with GSI on email.
    """
    class Meta:
        table_name = settings.SELLERS_TABLE_NAME
        region = settings.AWS_REGION
        if settings.DYNAMODB_ENDPOINT_URL:
            host = settings.DYNAMODB_ENDPOINT_URL

    # Primary key
    code       = UnicodeAttribute(hash_key=True)

    # Non‐key attributes
    name       = UnicodeAttribute()
    email      = UnicodeAttribute()
    created_at = UTCDateTimeAttribute()
    updated_at = UTCDateTimeAttribute()

    # GSI for email uniqueness
    email_index = EmailIndex()


class DynamoDBSellerRepo(SellerRepositoryPort):
    """
    Outbound adapter implementing SellerRepositoryPort using PynamoDB.
    """

    async def list_all(self) -> List[Seller]:
        sellers: List[Seller] = []
        for item in SellerModel.scan():
            sellers.append(_to_domain(item))
        return sellers

    async def get_by_code(self, code: UUID) -> Optional[Seller]:
        try:
            item = SellerModel.get(hash_key=str(code))
            return _to_domain(item)
        except SellerModel.DoesNotExist:
            return None

    async def get_by_email(self, email: str) -> Optional[Seller]:
        try:
            item = next(SellerModel.email_index.query(email))
            return _to_domain(item)
        except StopIteration:
            return None

    async def create(self, name: str, email: str) -> Seller:
        # Before inserting, enforce email uniqueness at the application level
        if await self.get_by_email(email) is not None:
            raise DuplicateSellerError("email", email)

        now = datetime.now(timezone.utc)
        new_code = uuid4()

        record = SellerModel(
            code=str(new_code),
            name=name,
            email=email,
            created_at=now,
            updated_at=now,
        )
        record.save()

        return Seller(
            code=new_code,
            name=name,
            email=email,
            created_at=now,
            updated_at=now,
        )

    async def update(self, code: UUID, name: str, email: str) -> Seller:
        # Fetch existing
        try:
            item = SellerModel.get(hash_key=str(code))
        except SellerModel.DoesNotExist:
            raise NotFoundError(code)

        # If changing email, enforce uniqueness
        if item.email != email and await self.get_by_email(email) is not None:
            raise DuplicateSellerError("email", email)

        # Persist updates
        now = datetime.now(timezone.utc)
        item.name       = name
        item.email      = email
        item.updated_at = now
        item.save()

        return Seller(
            code=UUID(item.code),
            name=item.name,
            email=item.email,
            created_at=item.created_at,
            updated_at=now,
        )

    async def delete(self, code: UUID) -> None:
        try:
            item = SellerModel.get(hash_key=str(code))
            item.delete()
        except SellerModel.DoesNotExist:
            raise NotFoundError(code)

    async def ping(self) -> None:
        # Used by readiness checks
        if not SellerModel.exists():
            raise RuntimeError(f"Table {SellerModel.Meta.table_name} not found")


def _to_domain(item: SellerModel) -> Seller:
    return Seller(
        code=UUID(item.code),
        name=item.name,
        email=item.email,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )