from fastapi import APIRouter

from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/overview")
async def get_dashboard_overview() -> dict:
    service = DashboardService()
    return await service.get_overview()
