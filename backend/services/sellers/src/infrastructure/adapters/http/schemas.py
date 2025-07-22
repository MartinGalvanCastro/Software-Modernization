from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from pydantic.alias_generators import to_camel

from src.domain.entities import Seller


class SellerIn(BaseModel):
    """
    Incoming schema for creating or updating a seller.
    Email must be unique across all sellers.
    """
    name: str = Field(..., description="Seller’s full name")
    email: str = Field(..., description="Seller’s unique email address")

    @field_validator("email")
    def validate_email(cls, v: str) -> str:
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v

    def to_domain(self) -> Seller:
        return Seller.new(name=self.name, email=self.email)


class SellerOut(BaseModel):
    """
    Outgoing schema for seller responses, with camelCase aliases.
    """
    id: UUID = Field(..., description="Unique seller identifier (UUID)")
    code: str
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }

    @classmethod
    def from_domain(cls, seller: Seller) -> "SellerOut":
        return cls(
            id=seller.id,
            name=seller.name,
            email=seller.email,
            created_at=seller.created_at,
            updated_at=seller.updated_at,
        )