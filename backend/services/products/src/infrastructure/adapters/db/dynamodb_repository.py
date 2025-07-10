from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

from config import settings
from src.domain.entities import Price, Product
from src.domain.exceptions import DomainError, NotFoundError
from src.domain.ports import ProductRepositoryPort


class ProductModel(Model):
    """
    PynamoDB model for the products table.
    """

    class Meta:
        table_name = settings.PRODUCTS_TABLE_NAME
        region = settings.AWS_REGION
        if len(settings.DYNAMODB_ENDPOINT_URL)>0:
            host = settings.DYNAMODB_ENDPOINT_URL

    code = UnicodeAttribute(hash_key=True)
    name = UnicodeAttribute()
    description = UnicodeAttribute(null=True)
    price = NumberAttribute()
    created_at = UnicodeAttribute()
    updated_at = UnicodeAttribute()


class DynamoDBProductRepo(ProductRepositoryPort):
    """
    Outbound adapter: implements ProductRepositoryPort using PynamoDB.
    """

    async def list_all(self) -> List[Product]:
        products: List[Product] = []
        for item in ProductModel.scan():
            products.append(_to_domain(item))
        return products

    async def get_by_code(self, code: str) -> Optional[Product]:
        try:
            item = ProductModel.get(hash_key=code)
            return _to_domain(item)
        except ProductModel.DoesNotExist:
            return None

    async def create(self, product: Product) -> None:
        """
        Save a new product item. Table provisioning is handled externally (e.g., via Terraform).
        """
        ProductModel(
            code=product.code,
            name=product.name,
            description=product.description,
            price=float(product.price.amount),
            created_at=product.created_at.isoformat(),
            updated_at=product.updated_at.isoformat(),
        ).save()

    async def update(self, product: Product) -> None:
        try:
            item = ProductModel.get(hash_key=product.code)
        except ProductModel.DoesNotExist:
            raise NotFoundError(product.code)
        item.name = product.name
        item.description = product.description
        item.price = float(product.price.amount)
        item.updated_at = product.updated_at.isoformat()
        item.save()

    async def delete(self, code: str) -> None:
        try:
            item = ProductModel.get(hash_key=code)
            item.delete()
        except ProductModel.DoesNotExist:
            raise NotFoundError(code)

    async def ping(self):
        try:
            if not ProductModel.exists():
                raise DomainError(f"Table {ProductModel.Meta.table_name} not found")
        except Exception as e:
            raise e


def _to_domain(item: ProductModel) -> Product:
    """Helper to convert a PynamoDB model to a domain Product."""
    return Product(
        code=item.code,
        name=item.name,
        description=item.description or "",
        price=Price(amount=Decimal(item.price)),
        created_at=datetime.fromisoformat(item.created_at),
        updated_at=datetime.fromisoformat(item.updated_at),
    )
