from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.models import User
from app.dependencies import get_db 
from app.schemas import UserResponse   

router = APIRouter(prefix="/api/v1")

## 유저 정보 조회 API
@router.get("/users/{userId}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user(userId: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == userId).first()
    if user is None:
        raise HTTPException(status_code=404, detail="해당 유저를 찾을 수 없습니다.")
    
    # 요청된 포맷에 맞춰 응답을 반환합니다.
    return UserResponse(
        id=user.id,
        github_id=user.github_id,
        nickname=user.nickname,
        email=user.email if user.email else "string",
        profile_img=user.profile_img if user.profile_img else "string",
        continuous_days=user.continuous_days if user.continuous_days else 0
    )

