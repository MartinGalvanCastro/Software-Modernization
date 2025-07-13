from uuid import UUID

class DomainError(Exception):
    """Base class for all domain‐layer errors."""

class NotFoundError(DomainError):
    def __init__(self, identifier: UUID) -> None:
        """
        :param identifier: the ID or code of the missing product.
        """
        super().__init__(f"Seller not found: {identifier}")
        self.identifier = identifier

class InvalidSaleError(DomainError):
    """
    Raised when a sale fails domain invariants, e.g. date in the future.
    """
    def __init__(self, reason: str):
        super().__init__(f"Invalid sale: {reason}")

class DuplicateSaleError(DomainError):
    """
    Raised when attempting to create a sale with a duplicate invoice_number.
    """
    def __init__(self, invoice_number: str):
        super().__init__(f"Duplicate sale invoice: {invoice_number}")
        self.invoice_number = invoice_number