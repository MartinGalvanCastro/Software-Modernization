from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends

from config import settings
from src.infrastructure.adapters.http.health import router as health_router
from src.infrastructure.adapters.http.routers import router as seller_router
from src.infrastructure.middlewares.exception_handlers import (
    register_exception_handlers,
)
from src.infrastructure.logging import setup_logging
from src.infrastructure.auth import get_current_user



@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    yield


app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    root_path="/sellers",
)


app.include_router(health_router)
app.include_router(seller_router, dependencies=[Depends(get_current_user)])



register_exception_handlers(app)
