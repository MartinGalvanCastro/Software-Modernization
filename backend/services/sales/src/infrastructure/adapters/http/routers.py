from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.domain.exceptions import NotFoundError, InvalidSaleError
from src.domain.ports import SaleServicePort
from src.infrastructure.adapters.http.schemas import SaleIn, SaleOut
from src.infrastructure.di import get_service

router = APIRouter(prefix="/api/v1", tags=["sales"])


@router.get("/", response_model=List[SaleOut])
async def list_sales(
    service: SaleServicePort = Depends(get_service),
):
    """List all sales."""
    sales = await service.list_sales()
    return [SaleOut.from_domain(s) for s in sales]


@router.get("/{sale_id}", response_model=SaleOut)
async def get_sale(
    sale_id: UUID,
    service: SaleServicePort = Depends(get_service),
):
    """Get a sale by its UUID."""
    try:
        sale = await service.get_sale(sale_id)
        return SaleOut.from_domain(sale)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
async def create_sale(
    payload: SaleIn,
    service: SaleServicePort = Depends(get_service),
):
    """Create a new sale."""
    try:
        sale = await service.create_sale(
            invoice_number=payload.invoice_number,
            sale_date=payload.sale_date,
            seller_code=payload.seller_code,
            product_code=payload.product_code,
        )
        return SaleOut.from_domain(sale)
    except InvalidSaleError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sale(
    sale_id: UUID,
    service: SaleServicePort = Depends(get_service),
):
    """Delete a sale by its UUID."""
    try:
        await service.delete_sale(sale_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))