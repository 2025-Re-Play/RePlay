from fastapi import APIRouter

from app.api.v1 import auth, trade, inventory, community, notification, mypage
from app.api.v1 import schools, me, inventory

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(trade.router)
api_router.include_router(inventory.router)
api_router.include_router(community.router)
api_router.include_router(notification.router)
api_router.include_router(mypage.router)
api_router.include_router(auth.router)
api_router.include_router(schools.router)
api_router.include_router(me.router)
api_router.include_router(inventory.router)