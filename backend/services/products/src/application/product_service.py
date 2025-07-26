from typing import List
from uuid import UUID
from decimal import Decimal

from src.domain.entities import Price, Product
from src.domain.exceptions import DuplicateProductError, InvalidPriceError, NotFoundError, ImageUploadError
from src.domain.ports import ProductRepositoryPort, ProductServicePort, ImageClientPort


class ProductService(ProductServicePort):
    """
    Implements the application use-cases for products, enforcing business rules
    and coordinating persistence.
    """

    def __init__(self, repository: ProductRepositoryPort, image_client: ImageClientPort):
        self._repo = repository
        self._image_client = image_client

    async def list_products(self) -> List[Product]:
        return await self._repo.list_all()

    async def get_product(self, code: UUID) -> Product:
        product = await self._repo.get_by_code(code)
        if product is None:
            raise NotFoundError(code)
        return product

    async def create_product(
        self,
        name: str,
        description: str,
        price: Decimal,
        image_file,
        image_filename: str,
        image_content_type: str
    ) -> Product:
        Price(price)  # raises InvalidPriceError if <= 0

        # enforce name uniqueness via GSI
        if await self._repo.get_by_name(name) is not None:
            raise DuplicateProductError("name", name)

        # Validate image MIME type
        if not image_content_type or not image_content_type.startswith("image/"):
            raise ImageUploadError("Uploaded file is not a valid image.")

        try:
            image_url = self._image_client.upload_image(image_file, image_filename, image_content_type)
        except Exception as e:
            raise ImageUploadError(str(e))

        return await self._repo.create(
            name=name,
            description=description,
            price=price,
            image_url=image_url
        )

    async def update_product(
        self,
        code: UUID,
        name: str,
        description: str,
        price: Decimal,
        image_file,
        image_filename: str,
        image_content_type: str
    ) -> Product:
        existing = await self._repo.get_by_code(code)
        if existing is None:
            raise NotFoundError(code)

        Price(price)  # raises InvalidPriceError if <= 0

        # Validate image MIME type
        if not image_content_type or not image_content_type.startswith("image/"):
            raise ImageUploadError("Uploaded file is not a valid image.")

        try:
            image_url = self._image_client.upload_image(image_file, image_filename, image_content_type)
        except Exception as e:
            raise ImageUploadError(str(e))

        return await self._repo.update(
            code=code,
            name=name,
            description=description,
            price=price,
            image_url=image_url
        )

    async def delete_product(self, code: UUID) -> None:
        await self._repo.delete(code)