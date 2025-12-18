from __future__ import annotations

from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.community_repository import CommunityRepository
from app.schemas.community import (
    CommunityPostCreate,
    CommunityPostUpdate,
    CommunityPostOut,
    CommunityPostListItem,
)

# ✅ 여기 import는 너 프로젝트 패턴에 맞춰야 함
# 보통 app/dependencies/auth.py 안에 get_current_user 같은 게 있음
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/community", tags=["Community"])


def _ensure_can_modify(user: User, author_id: int) -> None:
    # 프로젝트의 관리자 필드에 맞춰 조정
    # 예: user.is_admin / user.role == "admin"
    is_admin = getattr(user, "is_admin", False)
    if user.id != author_id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="작성자 또는 관리자만 수정/삭제할 수 있습니다.",
        )


@router.post("/posts", response_model=CommunityPostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    data: CommunityPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CommunityRepository.create_post(db, author_id=current_user.id, data=data)


@router.get("/posts", response_model=List[CommunityPostListItem])
def list_posts(
    type: Optional[str] = Query(default=None, description="general | request"),
    keyword: Optional[str] = Query(default=None, description="제목/본문/태그 검색"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    posts = CommunityRepository.list_posts(db, type=type, keyword=keyword, skip=skip, limit=limit)
    result: List[CommunityPostListItem] = []
    for p in posts:
        result.append(
            CommunityPostListItem(
                id=p.id,
                type=p.type.value,
                title=p.title,
                preview=(p.content or "")[:120],
                image_url=p.image_url,
                tags=p.tags,
                like_count=p.like_count,
                created_at=p.created_at,
            )
        )
    return result


@router.get("/posts/{post_id}", response_model=CommunityPostOut)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = CommunityRepository.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    return post


@router.patch("/posts/{post_id}", response_model=CommunityPostOut)
def update_post(
    post_id: int,
    data: CommunityPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = CommunityRepository.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    _ensure_can_modify(current_user, post.author_id)
    return CommunityRepository.update_post(db, post=post, data=data)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = CommunityRepository.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    _ensure_can_modify(current_user, post.author_id)
    CommunityRepository.delete_post(db, post=post)
    return None
