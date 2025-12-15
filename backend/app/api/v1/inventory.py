from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import ApiResponse, PageData, ok, created, fail
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate, InventoryItemOut
from app.repositories.inventory_repository import InventoryRepository
from app.dependencies.inventory_auth import get_current_admin_user, assert_club_admin
from app.models.inventory_item import InventoryItem, ItemStatus
from app.models.user import User

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/items", response_model=ApiResponse[InventoryItemOut])
def create_item(
    payload: InventoryItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin_user),
):
    try:
        assert_club_admin(payload.club_id, db, user)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    item = InventoryItem(**payload.model_dump())
    saved = InventoryRepository.create(db, item)
    return created(saved)


@router.get("/items", response_model=ApiResponse[PageData[InventoryItemOut]])
def list_items(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    sort: str | None = None,
    keyword: str | None = None,
    status: ItemStatus | None = None,
    club_id: int | None = None,
    db: Session = Depends(get_db),
):
    items, meta = InventoryRepository.list(
        db=db,
        club_id=club_id,
        status=status,
        keyword=keyword,
        sort=sort,
        page=page,
        size=size,
    )
    return ok(PageData(items=items, meta=meta))


@router.get("/items/{item_id}", response_model=ApiResponse[InventoryItemOut])
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = InventoryRepository.get(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="물품을 찾을 수 없습니다.")
    return ok(item)


@router.patch("/items/{item_id}", response_model=ApiResponse[InventoryItemOut])
def update_item(
    item_id: int,
    payload: InventoryItemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin_user),
):
    item = InventoryRepository.get(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="물품을 찾을 수 없습니다.")

    try:
        assert_club_admin(item.club_id, db, user)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(item, k, v)

    saved = InventoryRepository.update(db, item)
    return ok(saved)


@router.delete("/items/{item_id}", response_model=ApiResponse[dict])
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin_user),
):
    item = InventoryRepository.get(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="물품을 찾을 수 없습니다.")

    try:
        assert_club_admin(item.club_id, db, user)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    InventoryRepository.delete(db, item)
    return ok({"deleted": True})
