from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, status

from src.domain.ports import SellerServicePort
from src.infrastructure.adapters.http.schemas import SellerIn, SellerOut
from src.infrastructure.di import get_service

router = APIRouter(prefix="/api/v1", tags=["sellers"])


@router.get("/", response_model=List[SellerOut])
async def list_sellers(
    service: SellerServicePort = Depends(get_service),
):
    sellers = await service.list_sellers()
    return [SellerOut.from_domain(s) for s in sellers]


@router.get("/{seller_id}", response_model=SellerOut)
async def get_seller(
    seller_id: UUID,
    service: SellerServicePort = Depends(get_service),
):
    return SellerOut.from_domain(await service.get_seller(seller_id))


@router.post("/", response_model=SellerOut, status_code=status.HTTP_201_CREATED)
async def create_seller(
    payload: SellerIn,
    service: SellerServicePort = Depends(get_service),
):
    new_seller = await service.create_seller(
        name=payload.name,
        email=payload.email,
    )
    return SellerOut.from_domain(new_seller)


@router.put("/{seller_id}", response_model=SellerOut)
async def update_seller(
    seller_id: UUID,
    payload: SellerIn,
    service: SellerServicePort = Depends(get_service),
):
    updated = await service.update_seller(
        code=seller_id,
        name=payload.name,
        email=payload.email,
    )
    return SellerOut.from_domain(updated)


@router.delete("/{seller_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_seller(
    seller_id: UUID,
    service: SellerServicePort = Depends(get_service),
):
    await service.delete_seller(seller_id)