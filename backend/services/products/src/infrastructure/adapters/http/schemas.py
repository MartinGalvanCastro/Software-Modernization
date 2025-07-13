from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator
from pydantic.alias_generators import to_camel

from src.domain.entities import Price, Product


class ProductIn(BaseModel):
    """
    Incoming schema for creating or updating a product.
    """

    code: str = Field(..., description="Unique product code")
    name: str = Field(..., description="Name of the product")
    description: str = Field(..., description="Product description")
    price: Decimal = Field(..., gt=0, description="Price in USD, must be > 0")

    @field_validator("price")
    def validate_price(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Price must be greater than zero")
        return v

    def to_domain(self) -> Product:
        """
        Convert this request payload into a domain Product entity.
        Timestamps will be set in the application service.
        """
        return Product(
            code=self.code,
            name=self.name,
            description=self.description,
            price=Price(amount=self.price),
        )


class ProductOut(BaseModel):
    """
    Outgoing schema for product responses, with camelCase aliases.
    """

    code: str
    name: str
    description: str
    price: Decimal = Field(..., description="Price in USD with two decimals")
    created_at: datetime
    updated_at: datetime

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }

    @classmethod
    def from_domain(cls, product: Product) -> "ProductOut":
        """
        Create an output.tf schema from a domain Product entity.
        """
        return cls(
            code=product.code,
            name=product.name,
            description=product.description,
            price=product.price.amount,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )
