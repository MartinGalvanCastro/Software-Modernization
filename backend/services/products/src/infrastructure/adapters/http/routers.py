from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
import json

from src.domain.exceptions import DuplicateProductError, InvalidPriceError, NotFoundError
from src.domain.ports import ProductServicePort
from src.infrastructure.adapters.http.schemas import ProductIn, ProductOut
from src.infrastructure.di import get_product_service

router = APIRouter(prefix="/api/v1", tags=["products"])


@router.get("/", response_model=List[ProductOut])
async def list_products(
    service: ProductServicePort = Depends(get_product_service),
):
    """List all products."""
    domain_products = await service.list_products()
    return [ProductOut.from_domain(p) for p in domain_products]


@router.get("/{code}", response_model=ProductOut)
async def get_product(
    code: UUID,
    service: ProductServicePort = Depends(get_product_service),
):
    """Get a product by its UUID code."""

    product = await service.get_product(code)
    return ProductOut.from_domain(product)



@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: str = Form(...),
    image: UploadFile = File(...),
    service: ProductServicePort = Depends(get_product_service),
):
    """Create a new product."""
    # Parse and validate JSON
    product_data = json.loads(product)
    payload = ProductIn(**product_data)

    created = await service.create_product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        image_file=image.file,
        image_filename=image.filename,
        image_content_type=image.content_type
    )
    return ProductOut.from_domain(created)


@router.put("/{code}", response_model=ProductOut)
async def update_product(
    code: UUID,
    product: str = Form(...),
    image: UploadFile = File(...),
    service: ProductServicePort = Depends(get_product_service),
):
    """Update an existing product."""
    # Parse and validate JSON
    product_data = json.loads(product)
    payload = ProductIn(**product_data)

    updated = await service.update_product(
        code=code,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        image_file=image.file,
        image_filename=image.filename,
        image_content_type=image.content_type
    )
    return ProductOut.from_domain(updated)


@router.delete("/{code}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    code: UUID,
    service: ProductServicePort = Depends(get_product_service),
):
    """Delete a product by its UUID code."""
    await service.delete_product(code)

