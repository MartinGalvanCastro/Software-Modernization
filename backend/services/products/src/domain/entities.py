from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional

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

    code: str
    name: str
    description: str
    price: Price
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
