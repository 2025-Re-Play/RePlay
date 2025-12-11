from fastapi import APIRouter

from app.api.v1 import trade, inventory, community, notification, mypage

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(trade.router)
api_router.include_router(inventory.router)
api_router.include_router(community.router)
api_router.include_router(notification.router)
api_router.include_router(mypage.router)