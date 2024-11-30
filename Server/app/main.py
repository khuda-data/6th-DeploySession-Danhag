from fastapi import FastAPI
from .database import engine
from .models import Base
from .api.domain import reflection, user, auth, todo
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os

app = FastAPI()

# 환경 변수에서 secret_key 가져오기
secret_key = os.getenv("SECRET_KEY")

# 세션 미들웨어 추가 (가장 먼저 설정)
app.add_middleware(SessionMiddleware, secret_key=secret_key)

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],  # 허용할 HTTP 메서드 (GET, POST 등)
    allow_headers=["*"]   # 허용할 HTTP 헤더
)

# 테이블 자동 생성 
Base.metadata.create_all(bind=engine)

# 라우터 추가
app.include_router(reflection.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(todo.router)