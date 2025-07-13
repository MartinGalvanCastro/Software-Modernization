from dataclasses import replace
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.domain.exceptions import (
    DuplicateProductError,
    InvalidPriceError,
    NotFoundError,
)
from src.domain.ports import ProductServicePort
from src.infrastructure.adapters.http.schemas import ProductIn, ProductOut
from src.infrastructure.di import get_product_service

router = APIRouter(prefix="/api/v1", tags=["products"])


@router.get("/", response_model=List[ProductOut])
async def list_products(service: ProductServicePort = Depends(get_product_service)):
    """List all products."""
    domain_products = await service.list_products()
    return [ProductOut.from_domain(prod) for prod in domain_products]


@router.get("/{code}", response_model=ProductOut)
async def get_product(
    code: str, service: ProductServicePort = Depends(get_product_service)
):
    """Get a product by its unique code."""
    try:
        product = await service.get_product(code)
        return ProductOut.from_domain(product)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=None)
async def create_product(
    payload: ProductIn, service: ProductServicePort = Depends(get_product_service)
):
    """Create a new product."""
    try:
        domain_product = payload.to_domain()
        await service.create_product(domain_product)
        return None
    except DuplicateProductError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except InvalidPriceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{code}", response_model=None)
async def update_product(
    code: str,
    payload: ProductIn,
    service: ProductServicePort = Depends(get_product_service),
):
    """Update an existing product."""
    try:
        domain_product = payload.to_domain()
        to_update = replace(domain_product, code=code)
        await service.update_product(to_update)
        return None
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except InvalidPriceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{code}", response_model=None)
async def delete_product(
    code: str, service: ProductServicePort = Depends(get_product_service)
):
    """Delete a product by code."""
    try:
        await service.delete_product(code)
        return None
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
