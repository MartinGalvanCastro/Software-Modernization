from datetime import datetime, timezone
from decimal import Decimal
from email.mime import image
from typing import List, Optional
from uuid import UUID, uuid4

from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection

from config import settings
from src.domain.entities import Price, Product
from src.domain.exceptions import NotFoundError
from src.domain.ports import ProductRepositoryPort


class NameIndex(GlobalSecondaryIndex):
    """
    Global secondary index on `name` so we can query by name cheaply.
    """
    class Meta:
        index_name = "name-index"
        read_capacity_units = 1
        write_capacity_units = 1
        projection = AllProjection()

    name = UnicodeAttribute(hash_key=True)


class ProductModel(Model):
    """
    PynamoDB model for the products table.
    """
    class Meta:
        table_name = settings.PRODUCTS_TABLE_NAME
        region = settings.AWS_REGION
        if settings.DYNAMODB_ENDPOINT_URL:
            host = settings.DYNAMODB_ENDPOINT_URL

    code        = UnicodeAttribute(hash_key=True)
    name        = UnicodeAttribute()
    description = UnicodeAttribute(null=True)
    price       = NumberAttribute()
    created_at  = UnicodeAttribute()
    updated_at  = UnicodeAttribute()
    image_url   = UnicodeAttribute()

    name_index = NameIndex()


class DynamoDBProductRepo(ProductRepositoryPort):
    """
    Outbound adapter: implements ProductRepositoryPort using PynamoDB.
    """

    async def list_all(self) -> List[Product]:
        products: List[Product] = []
        for item in ProductModel.scan():
            products.append(_to_domain(item))
        return products

    async def get_by_code(self, code: UUID) -> Optional[Product]:
        try:
            item = ProductModel.get(hash_key=str(code))
            return _to_domain(item)
        except ProductModel.DoesNotExist:
            return None

    async def get_by_name(self, name: str) -> Optional[Product]:
        results = ProductModel.name_index.query(name)
        for item in results:
            return _to_domain(item)
        return None

    async def create(
        self,
        name: str,
        description: str,
        price: Decimal,
        image_url: str
    ) -> Product:
        now = datetime.now(timezone.utc)
        new_code = uuid4()
        obj = ProductModel(
            code=str(new_code),
            name=name,
            description=description,
            price=float(price),
            created_at=now.isoformat(),
            updated_at=now.isoformat(),
            image_url=image_url
        )
        obj.save()
        return Product(
            code=new_code,
            name=name,
            description=description,
            price=Price(amount=price),
            created_at=now,
            updated_at=now,
            image_url=image_url
        )

    async def update(
        self,
        code: UUID,
        name: str,
        description: str,
        price: Decimal,
        image_url: str
    ) -> Product:
        try:
            item = ProductModel.get(hash_key=str(code))
        except ProductModel.DoesNotExist:
            raise NotFoundError(code)

        now = datetime.now(timezone.utc)
        item.name        = name
        item.description = description
        item.price       = float(price)
        item.image_url   = image_url
        item.updated_at  = now.isoformat()
        item.save()

        return Product(
            code=code,
            name=name,
            description=description,
            price=Price(amount=price),
            created_at=datetime.fromisoformat(item.created_at),
            updated_at=now,
            image_url=item.image_url,
        )

    async def delete(self, code: UUID) -> None:
        try:
            item = ProductModel.get(hash_key=str(code))
            item.delete()
        except ProductModel.DoesNotExist:
            raise NotFoundError(code)

    async def ping(self) -> None:
        if not ProductModel.exists():
            raise RuntimeError(f"Table {ProductModel.Meta.table_name} not found")


def _to_domain(item: ProductModel) -> Product:
    return Product(
        code=UUID(item.code),
        name=item.name,
        description=item.description or "",
        price=Price(amount=Decimal(item.price)),
        created_at=datetime.fromisoformat(item.created_at),
        updated_at=datetime.fromisoformat(item.updated_at),
        image_url=item.image_url,
    )
