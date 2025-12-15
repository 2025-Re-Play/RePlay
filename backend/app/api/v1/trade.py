from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import ApiResponse, PageData, ok, created
from app.schemas.trade import (
    TradeListItem,
    TradeDetail,
    ReserveCreate,
    ReservationOut,
    ReservationCalendarRange,
)
from app.repositories.trade_repository import TradeRepository
from app.models.trade_listing import TradeType
from app.models.trade_reservation import TradeReservation
from app.models.user import User
from app.dependencies.auth import get_current_user  # 프로젝트 기존 함수명 기준


router = APIRouter(prefix="/trade", tags=["Trade"])


@router.get("/list", response_model=ApiResponse[PageData[TradeListItem]])
def list_trade(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    keyword: str | None = None,
    trade_type: TradeType | None = None,
    category: str | None = None,
    tag: str | None = None,
    price_min: int | None = Query(None, ge=0),
    price_max: int | None = Query(None, ge=0),
    sort: str | None = None,
    db: Session = Depends(get_db),
):
    rows, meta = TradeRepository.list(
        db=db,
        page=page,
        size=size,
        keyword=keyword,
        trade_type=trade_type,
        category=category,
        tag=tag,
        price_min=price_min,
        price_max=price_max,
        sort=sort,
    )

    # rows: [(TradeListing, InventoryItem), ...]
    items: list[TradeListItem] = []
    for listing, inv in rows:
        items.append(
            TradeListItem(
                id=listing.id,
                trade_type=listing.trade_type,
                price=listing.price,
                deposit=listing.deposit,
                is_public=listing.is_public,
                item_id=inv.id,
                club_id=inv.club_id,
                name=inv.name,
                category=inv.category,
                tags=inv.tags,
                image_path=inv.image_path,
            )
        )

    return ok(PageData(items=items, meta=meta))


@router.get("/{listing_id}", response_model=ApiResponse[TradeDetail])
def get_trade_detail(
    listing_id: int,
    db: Session = Depends(get_db),
):
    row = TradeRepository.get_detail(db, listing_id)
    if not row:
        raise HTTPException(status_code=404, detail="거래 게시물을 찾을 수 없습니다.")

    listing, inv = row

    return ok(
        TradeDetail(
            id=listing.id,
            trade_type=listing.trade_type,
            price=listing.price,
            deposit=listing.deposit,
            is_public=listing.is_public,
            title=listing.title,
            description=listing.description,
            item_id=inv.id,
            club_id=inv.club_id,
            name=inv.name,
            category=inv.category,
            tags=inv.tags,
            size=inv.size,
            contact=inv.contact,
            image_path=inv.image_path,
            purchased_at=inv.purchased_at,
            status=str(inv.status),
            is_deal_done=inv.is_deal_done,
            item_description=inv.description,
        )
    )


@router.post("/{listing_id}/reserve", response_model=ApiResponse[ReservationOut])
def reserve_trade(
    listing_id: int,
    payload: ReserveCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),  # 로그인 필수
):
    row = TradeRepository.get_detail(db, listing_id)
    if not row:
        raise HTTPException(status_code=404, detail="거래 게시물을 찾을 수 없습니다.")

    listing, inv = row

    if not listing.is_public:
        raise HTTPException(status_code=403, detail="비공개 거래 게시물입니다.")

    # RENT인 경우 기간 필수
    if payload.trade_type == TradeType.RENT:
        if payload.start_at is None or payload.end_at is None:
            raise HTTPException(status_code=400, detail="대여 예약은 시작/종료 시간이 필요합니다.")
        if payload.end_at <= payload.start_at:
            raise HTTPException(status_code=400, detail="종료 시간이 시작 시간보다 빠를 수 없습니다.")

    # SELL인 경우 기간 없어도 됨 (None 허용)

    reservation = TradeReservation(
        listing_id=listing.id,
        user_id=user.id,
        trade_type=payload.trade_type,
        start_at=payload.start_at,
        end_at=payload.end_at,
        message=payload.message,
    )

    saved = TradeRepository.create_reservation(db, reservation)
    return created(saved)


@router.get("/{listing_id}/reservations", response_model=ApiResponse[list[ReservationCalendarRange]])
def get_trade_reservations_calendar(
    listing_id: int,
    db: Session = Depends(get_db),
):
    # 달력용: 날짜 범위 리스트 형태로 내려줌
    res = TradeRepository.list_reservations(db, listing_id)
    ranges = [
        ReservationCalendarRange(
            start_at=r.start_at,
            end_at=r.end_at,
            trade_type=r.trade_type,
            status=r.status,
        )
        for r in res
    ]
    return ok(ranges)


# TODO: 본인 예약 조회/취소 스펙(후속)
# - GET /api/v1/me/reservations
# - DELETE /api/v1/trade/reservations/{reservation_id}
