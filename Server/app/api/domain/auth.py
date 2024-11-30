from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import User as DbUser, Reflection as DbReflection, Image as DbImage 
from app.dependencies import get_db
from app.dependencies import get_db 
from app.schemas import Token, Login, UserResponse, RegisterUser
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List
from sqlalchemy import func, desc

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    
router = APIRouter(prefix="/api/v1")

@router.post("/login", response_model=Token)
def login(login_data: Login, db: Session = Depends(get_db)):
    user = db.query(DbUser).filter(DbUser.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": user.user_id,   # user_id 반환
        "nickname": user.nickname  # nickname 반환
    }


# Register API 수정
@router.post("/register", response_model=Token)
def register(user_data: RegisterUser, db: Session = Depends(get_db)):
    user = db.query(DbUser).filter(DbUser.email == user_data.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    new_user = DbUser(email=user_data.email, hashed_password=hashed_password, nickname=user_data.nickname)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": new_user.user_id,   # user_id 반환
        "nickname": new_user.nickname  # nickname 반환
    }
# 연속 작성 일수 계산 함수
def calculate_continuous_days(user_id: int, db: Session) -> int:
    reflections = (
        db.query(DbReflection.created_at)
        .filter(DbReflection.user_id == user_id)
        .order_by(DbReflection.created_at.desc())
        .all()
    )

    if not reflections:
        return 0

    continuous_days = 1
    last_date = reflections[0].created_at.date()

    for reflection in reflections[1:]:
        reflection_date = reflection.created_at.date()

        if (last_date - reflection_date).days == 1:
            continuous_days += 1
            last_date = reflection_date
        else:
            break

    return continuous_days


@router.get("/rankings")
def get_rankings(db: Session = Depends(get_db)):
    try:
        # 사용자별 회고 개수 및 프로필 이미지 데이터 가져오기
        ranking_data = (
            db.query(
                DbUser.user_id,
                DbUser.nickname,
                func.count(DbReflection.reflection_id).label("commits"),
                DbUser.profile_img
            )
            .outerjoin(DbReflection, DbUser.user_id == DbReflection.user_id)
            .group_by(DbUser.user_id)
            .order_by(desc("commits"), DbUser.nickname)  # 회고 개수 내림차순, 닉네임 오름차순
            .all()
        )

        # 사용자별 데이터를 생성하여 반환
        users_with_rankings = [
            {
                "user_id": user.user_id,
                "nickname": user.nickname,
                "image": image if image else "",  # 프로필 이미지가 없으면 빈 문자열
                "commits": commits,  # 회고 개수
                "continuous_days": calculate_continuous_days(user.user_id, db)  # 연속 작성 일수
            }
            for user, commits, image in ranking_data
        ]

        return {"rankings": users_with_rankings}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="랭킹 데이터를 가져오지 못했습니다.")