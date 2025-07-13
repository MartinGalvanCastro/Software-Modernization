import logging
from fastapi import APIRouter, Depends, HTTPException, status

from src.domain.ports import SaleRepositoryPort
from src.infrastructure.di import get_repository

router = APIRouter(
    prefix="/health",
    include_in_schema=False,  # hide endpoints from OpenAPI
)

logger = logging.getLogger("sales_service.health")

@router.get("/live", include_in_schema=False)
async def liveness():
    """Liveness probe: always returns 200 if the app is running."""
    return {"status": "alive"}


@router.get("/ready", include_in_schema=False)
async def readiness(repo: SaleRepositoryPort = Depends(get_repository)):
    """Readiness probe: checks downstream dependencies (e.g., database)."""
    try:
        # Delegate health check to repository ping() method
        await repo.ping()
        return {"status": "ready"}
    except Exception as e:
        logger.error(f"Readiness failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Readiness failed: {e}",
        )
