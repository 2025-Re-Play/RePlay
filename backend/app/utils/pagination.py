from sqlalchemy.orm import Query
from sqlalchemy import or_, asc, desc
from math import ceil
from typing import List
from app.schemas.common import PaginationMeta


def apply_keyword_filter(query: Query, keyword: str | None, columns: List):
    if not keyword:
        return query

    return query.filter(
        or_(*[col.ilike(f"%{keyword}%") for col in columns])
    )


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
    total_items = query.count()
    total_pages = ceil(total_items / size) if size else 1

    items = (
        query
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    meta = PaginationMeta(
        page=page,
        size=size,
        total_items=total_items,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )

    return items, meta
