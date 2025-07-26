from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from src.domain.exceptions import InvalidPriceError


@dataclass(frozen=True)
class Price:
    """
    Value Object for product price in USD, always > 0 and formatted to two decimals.
    """

    amount: Decimal

    def __post_init__(self):
        if self.amount <= 0:
            raise InvalidPriceError(self.amount)

    def __str__(self) -> str:
        # Always show two decimal places
        return f"{self.amount:.2f}"


@dataclass(frozen=True)
class Product:
    """
    Core domain entity for a Product.
    """

    code: UUID
    name: str
    description: str
    price: Price
    image_url: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    

    @staticmethod
    def new(name: str, description: str, price: Price, image_url: str) -> "Product":
        """
        Factory method to create a new Product with a generated UUID
        and current timestamps.
        """
        now = datetime.now(timezone.utc)
        return Product(
            code=uuid4(),
            name=name,
            description=description,
            price=price,
            image_url=image_url,
            created_at=now,
            updated_at=now,
        )
