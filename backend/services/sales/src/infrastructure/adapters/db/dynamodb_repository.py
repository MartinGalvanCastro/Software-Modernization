from datetime import datetime, timezone, date
from typing import List, Optional
from uuid import UUID, uuid4

from pynamodb.attributes import UnicodeAttribute
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.models import Model
from pynamodb.exceptions import PynamoDBException

from config import settings
from src.domain.entities import Sale
from src.domain.exceptions import NotFoundError
from src.domain.ports import SaleRepositoryPort


class InvoiceNumberIndex(GlobalSecondaryIndex):
    """
    GSI on invoice_number to allow efficient lookups by invoice.
    """
    class Meta:
        index_name = "invoice-number-index"
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    invoice_number = UnicodeAttribute(hash_key=True)


class SaleModel(Model):
    """
    PynamoDB model for the sales table, with a GSI on invoice_number.
    """
    class Meta:
        table_name = settings.SALES_TABLE_NAME
        region     = settings.AWS_REGION
        if settings.DYNAMODB_ENDPOINT_URL:
            host = settings.DYNAMODB_ENDPOINT_URL

    id             = UnicodeAttribute(hash_key=True)
    invoice_number = UnicodeAttribute()
    sale_date      = UnicodeAttribute()  # ISO date string
    seller_code    = UnicodeAttribute()
    product_code   = UnicodeAttribute()
    created_at     = UnicodeAttribute()  # ISO datetime string

    invoice_index = InvoiceNumberIndex()


class DynamoDBSaleRepo(SaleRepositoryPort):
    """
    Outbound adapter: implements SaleRepositoryPort using PynamoDB and GSI.
    """

    async def list_all(self) -> List[Sale]:
        sales: List[Sale] = []
        for item in SaleModel.scan():
            sales.append(_to_domain(item))
        return sales

    async def get_by_id(self, sale_id: UUID) -> Optional[Sale]:
        try:
            item = SaleModel.get(hash_key=str(sale_id))
            return _to_domain(item)
        except SaleModel.DoesNotExist:
            return None

    async def get_by_invoice(self, invoice_number: str) -> Optional[Sale]:
        """
        Query the invoice-number-index GSI rather than scanning the table.
        """
        try:
            iterator = SaleModel.invoice_index.query(invoice_number)
            first = next(iterator, None)
            return _to_domain(first) if first else None
        except PynamoDBException:
            return None

    async def create(
        self,
        invoice_number: str,
        sale_date: date,
        seller_code: UUID,
        product_code: UUID
    ) -> Sale:
        """
        Persist a new sale, generate its UUID & timestamp,
        and return the created Sale entity.
        """
        now = datetime.now(timezone.utc)
        new_id = uuid4()

        obj = SaleModel(
            id=str(new_id),
            invoice_number=invoice_number,
            sale_date=sale_date.isoformat(),
            seller_code=str(seller_code),
            product_code=str(product_code),
            created_at=now.isoformat(),
        )
        obj.save()

        return Sale(
            id=new_id,
            invoice_number=invoice_number,
            sale_date=sale_date,
            seller_code=seller_code,
            product_code=product_code,
            created_at=now,
        )

    async def delete(self, sale_id: UUID) -> None:
        try:
            item = SaleModel.get(hash_key=str(sale_id))
            item.delete()
        except SaleModel.DoesNotExist:
            raise NotFoundError(sale_id)

    async def ping(self) -> None:
        # readiness check: raises if table or index are unreachable
        try:
            if not SaleModel.exists():
                raise RuntimeError(f"Table {SaleModel.Meta.table_name} not found")
        except PynamoDBException as e:
            raise e


def _to_domain(item: SaleModel) -> Sale:
    """Convert a PynamoDB model into a domain Sale entity."""
    return Sale(
        id=UUID(item.id),
        invoice_number=item.invoice_number,
        sale_date=date.fromisoformat(item.sale_date),
        seller_code=UUID(item.seller_code),
        product_code=UUID(item.product_code),
        created_at=datetime.fromisoformat(item.created_at),
    )