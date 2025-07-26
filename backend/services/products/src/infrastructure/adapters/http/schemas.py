from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator
from pydantic.alias_generators import to_camel

from src.domain.entities import Price, Product


class ProductIn(BaseModel):
    """
    Incoming schema for creating a product.
    'code' is not provided by the client—it's generated in the domain.
    Image file is uploaded separately via multipart/form-data.
    """

    name: str = Field(..., description="Name of the product")
    description: str = Field(..., description="Product description")
    price: Decimal = Field(..., gt=0, description="Price in USD, must be > 0")

    @field_validator("price")
    def check_price_positive(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Price must be greater than zero")
        return v

    def to_domain(self) -> Product:
        """
        Convert this payload into a new domain Product, with UUID and timestamps.
        """
        return Product.new(
            name=self.name,
            description=self.description,
            price=Price(amount=self.price),
            image_url=""
        )


class ProductOut(BaseModel):
    """
    Outgoing schema for product responses, with camelCase aliases.
    """

    code: UUID = Field(..., description="Unique product identifier (UUID)")
    name: str
    description: str
    price: Decimal = Field(..., description="Price in USD with two decimals")
    created_at: datetime
    updated_at: datetime
    image_url: str

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }

    @classmethod
    def from_domain(cls, product: Product) -> 'ProductOut':
        """
        Produce a DTO from a domain entity.
        """
        return cls(
            code=product.code,
            name=product.name,
            description=product.description,
            price=product.price.amount,
            created_at=product.created_at,
            updated_at=product.updated_at,
            image_url=product.image_url,
        )
