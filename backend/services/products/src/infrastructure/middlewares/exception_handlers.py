from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from src.domain.exceptions import (
    DuplicateProductError,
    InvalidPriceError,
    NotFoundError,
)


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(NotFoundError)
    async def not_found_handler(request: Request, exc: NotFoundError):
        return JSONResponse(
            status_code=HTTP_404_NOT_FOUND,
            content={
                "title": "Resource Not Found",
                "detail": str(exc),
                "status": HTTP_404_NOT_FOUND,
            },
        )

    @app.exception_handler(DuplicateProductError)
    async def duplicate_product_handler(request: Request, exc: DuplicateProductError):
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "title": "Duplicate Product",
                "detail": str(exc),
                "status": HTTP_400_BAD_REQUEST,
            },
        )

    @app.exception_handler(InvalidPriceError)
    async def invalid_price_handler(request: Request, exc: InvalidPriceError):
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "title": "Invalid Price",
                "detail": str(exc),
                "status": HTTP_400_BAD_REQUEST,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "title": "Internal Server Error",
                "detail": "An unexpected error occurred.",
                "status": HTTP_500_INTERNAL_SERVER_ERROR,
            },
        )
