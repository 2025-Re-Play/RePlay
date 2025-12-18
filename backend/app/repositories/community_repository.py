from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.community_post import CommunityPost, CommunityPostType
from app.schemas.community import CommunityPostCreate, CommunityPostUpdate


class CommunityRepository:
    @staticmethod
    def create_post(db: Session, *, author_id: int, data: CommunityPostCreate) -> CommunityPost:
        post = CommunityPost(
            type=CommunityPostType(data.type),
            title=data.title,
            content=data.content,
            image_url=data.image_url,
            tags=data.tags,
            author_id=author_id,
            club_id=data.club_id,
            request_category=data.request_category,
            desired_start_date=data.desired_start_date,
            desired_end_date=data.desired_end_date,
            like_count=0,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return post

    @staticmethod
    def get_post(db: Session, post_id: int) -> Optional[CommunityPost]:
        return db.query(CommunityPost).filter(CommunityPost.id == post_id).first()

    @staticmethod
    def list_posts(
        db: Session,
        *,
        type: Optional[str] = None,
        keyword: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[CommunityPost]:
        q = db.query(CommunityPost)

        if type:
            q = q.filter(CommunityPost.type == CommunityPostType(type))

        if keyword:
            like = f"%{keyword}%"
            q = q.filter(
                or_(
                    CommunityPost.title.ilike(like),
                    CommunityPost.content.ilike(like),
                    CommunityPost.tags.ilike(like),
                )
            )

        return (
            q.order_by(CommunityPost.created_at.desc())
             .offset(skip)
             .limit(limit)
             .all()
        )

    @staticmethod
    def update_post(db: Session, *, post: CommunityPost, data: CommunityPostUpdate) -> CommunityPost:
        payload = data.model_dump(exclude_unset=True)
        for k, v in payload.items():
            setattr(post, k, v)
        post.updated_at = datetime.utcnow()
        db.add(post)
        db.commit()
        db.refresh(post)
        return post

    @staticmethod
    def delete_post(db: Session, *, post: CommunityPost) -> None:
        db.delete(post)
        db.commit()
