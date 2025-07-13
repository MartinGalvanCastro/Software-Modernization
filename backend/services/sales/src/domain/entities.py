from dataclasses import dataclass
from datetime import date, datetime, timezone
from uuid import UUID, uuid4


@dataclass(frozen=True)
class Sale:
    """
    Core domain entity for a Sale.
    """
    id: UUID
    invoice_number: str
    sale_date: date
    seller_code: UUID
    product_code: UUID
    created_at: datetime

    @classmethod
    def new(
        cls,
        invoice_number: str,
        sale_date: date,
        seller_code: UUID,
        product_code: UUID,
    ) -> 'Sale':
        """
        Factory method to create a new Sale with generated UUID and timestamp.

        :param invoice_number: Unique invoice identifier.
        :param sale_date:       Date of the sale.
        :param seller_code:     UUID of the seller.
        :param product_code:    UUID of the product.
        :return:                A new Sale entity.
        """
        return cls(
            id=uuid4(),
            invoice_number=invoice_number,
            sale_date=sale_date,
            seller_code=seller_code,
            product_code=product_code,
            created_at=datetime.now(timezone.utc),
        )