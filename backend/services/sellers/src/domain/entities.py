from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import UUID, uuid4


@dataclass(frozen=True)
class Seller:
    """
    Core domain entity for a Seller.
    """
    code: UUID
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def new(cls, name: str, email: str) -> "Seller":
        """
        Factory to build a new Seller with a generated UUID and timestamps.
        """
        now = datetime.now(timezone.utc)
        return cls(
            code=uuid4(),
            name=name,
            email=email,
            created_at=now,
            updated_at=now,
        )
