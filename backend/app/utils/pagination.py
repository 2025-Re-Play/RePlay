from __future__ import annotations

from math import ceil
from typing import List

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Query

from app.schemas.common import PaginationMeta


def apply_keyword_filter(query: Query, keyword: str | None, columns: List):
    if not keyword:
        return query

    return query.filter(or_(*[col.ilike(f"%{keyword}%") for col in columns]))


def apply_sort(query: Query, sort: str | None, model):
    if not sort:
        return query

    direction = asc
    field = sort

    if sort.startswith("-"):
        direction = desc
        field = sort[1:]

    if not hasattr(model, field):
        return query

    return query.order_by(direction(getattr(model, field)))


def paginate_query(query: Query, page: int, size: int):
    # 안전장치 (page/size 최소값)
    page = max(page, 1)
    size = max(size, 1)

    total = query.count()
    total_pages = ceil(total / size) if total else 0

    items = (
        query
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    meta = PaginationMeta(
        page=page,
        size=size,
        total=total,                 
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )

    return items, meta
