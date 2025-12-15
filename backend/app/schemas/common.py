from typing import Generic, Optional, TypeVar, List
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar("T")


class ErrorInfo(BaseModel):
    code: str
    message: str


class ApiResponse(GenericModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[ErrorInfo] = None


# -------------------------
# Pagination (공통)
# -------------------------
class PaginationMeta(BaseModel):
    page: int = Field(..., ge=1)
    size: int = Field(..., ge=1)
    total: int = Field(..., ge=0)
    total_pages: int = Field(..., ge=0)
    has_next: bool
    has_prev: bool


class PageData(GenericModel, Generic[T]):
    items: List[T]
    meta: PaginationMeta


# -------------------------
# Helper responses
# -------------------------
def ok(data: T):
    return ApiResponse(success=True, data=data)


def created(data: T):
    return ApiResponse(success=True, data=data)


def fail(code: str, message: str):
    return ApiResponse(
        success=False,
        error=ErrorInfo(code=code, message=message)
    )
