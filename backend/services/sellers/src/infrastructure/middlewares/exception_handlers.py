import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from src.domain.exceptions import (
    NotFoundError,
    DuplicateSellerError,
)

logger = logging.getLogger("sellers_service.exceptions")


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(NotFoundError)
    async def not_found_handler(request: Request, exc: NotFoundError):
        logger.warning(
            "NotFoundError: %s %s → %s",
            request.method,
            request.url.path,
            exc,
        )
        return JSONResponse(
            status_code=HTTP_404_NOT_FOUND,
            content={
                "title": "Resource Not Found",
                "detail": str(exc),
                "status": HTTP_404_NOT_FOUND,
            },
        )

    @app.exception_handler(DuplicateSellerError)
    async def duplicate_seller_handler(request: Request, exc: DuplicateSellerError):
        logger.warning(
            "DuplicateSellerError: %s %s → %s",
            request.method,
            request.url.path,
            exc,
        )
        return JSONResponse(
            status_code=HTTP_400_BAD_REQUEST,
            content={
                "title": "Duplicate Seller",
                "detail": str(exc),
                "status": HTTP_400_BAD_REQUEST,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(
            "Unhandled exception on %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "title": "Internal Server Error",
                "detail": "An unexpected error occurred.",
                "status": HTTP_500_INTERNAL_SERVER_ERROR,
            },
        )