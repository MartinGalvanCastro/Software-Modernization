from contextlib import asynccontextmanager
from fastapi import FastAPI

from config import settings
from src.infrastructure.adapters.http.health import router as health_router
from src.infrastructure.adapters.http.routers import router as product_router
from src.infrastructure.middlewares.exception_handlers import (
    register_exception_handlers,
)
from src.infrastructure.logging import setup_logging



@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    yield


app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    root_path="/products",
)


app.include_router(health_router)

app.include_router(product_router)

register_exception_handlers(app)
