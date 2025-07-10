from decimal import Decimal


class DomainError(Exception):
    """Base class for all domain‐layer errors."""


class NotFoundError(DomainError):
    def __init__(self, identifier: str) -> None:
        """
        :param identifier: the ID or code of the missing product.
        """
        super().__init__(f"Product not found: {identifier}")
        self.identifier = identifier


class DuplicateProductError(DomainError):
    def __init__(self, field: str, value: str) -> None:
        super().__init__(f"Product with {field!r}={value!r} already exists")
        self.field = field
        self.value = value


class InvalidPriceError(DomainError):
    def __init__(self, price: Decimal) -> None:
        super().__init__(f"Invalid price: {price!r}. Price must be > 0")
        self.price = price
