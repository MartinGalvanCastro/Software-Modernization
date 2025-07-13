from uuid import UUID


class DomainError(Exception):
    """Base class for all domain‐layer errors."""


class NotFoundError(DomainError):
    """
    Raised when an entity cannot be found by its identifier.
    """
    def __init__(self, identifier: UUID) -> None:
        super().__init__(f"Seller not found: {identifier}")
        self.identifier = identifier


class DuplicateSellerError(DomainError):
    """
    Raised when attempting to create a seller with a registered email.
    """
    def __init__(self, email: str) -> None:
        super().__init__(f"Duplicate email for seller seller: {email}")
        self.email = email