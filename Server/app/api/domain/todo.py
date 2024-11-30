from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.schemas import TodoRequest, TodoPostResponse, TodoGetResponse
from app.models import Reflection as DbReflection, User as DbUser
from app.dependencies import get_db
from datetime import datetime, timedelta
import pytz

router = APIRouter(prefix="/api/v1")

# 한국 표준시 (KST) 설정
KST = pytz.timezone('Asia/Seoul')

@router.post("/todo", response_model=TodoPostResponse)
def create_todo(todo_data: TodoRequest, db: Session = Depends(get_db)):
    # user_id가 유효한지 확인
    user = db.query(DbUser).filter(DbUser.user_id == todo_data.user_id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # 오늘의 todo가 이미 제출되었는지 확인
    today_start = datetime.combine(datetime.now(KST).date(), datetime.min.time()).astimezone(KST)
    today_end = datetime.combine(datetime.now(KST).date(), datetime.max.time()).astimezone(KST)
    
    existing_todo = db.query(DbReflection).filter(
        DbReflection.user_id == todo_data.user_id,
        DbReflection.created_at >= today_start,
        DbReflection.created_at <= today_end
    ).first()
    print(existing_todo)    

    if existing_todo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 오늘의 할 일을 제출하셨습니다.")

    # 여러 개의 task를 하나의 문자열로 결합하여 Reflection 테이블에 추가
    combined_todo = "\n".join(todo_data.tasks)
    new_reflection = DbReflection(
        user_id=todo_data.user_id,
        todo=combined_todo,
        created_at=datetime.now(KST)  # created_at 필드를 KST 기준으로 설정
    )
   
    db.add(new_reflection)
    db.commit()
    db.refresh(new_reflection)
    
    return {
        "status": "success", 
        "message": "Todos created successfully",
        "reflection_id": new_reflection.reflection_id
    }

@router.get("/todo/{user_id}", response_model=TodoGetResponse)
def get_today_todos(user_id: int, db: Session = Depends(get_db)):
    # user_id가 유효한지 확인
    user = db.query(DbUser).filter(DbUser.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # 한국 시간으로 오늘의 시작과 끝 계산
    today_start = datetime.now(KST).replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    # 오늘의 todo 검색
    todos = db.query(DbReflection).filter(
        DbReflection.user_id == user_id,
        DbReflection.created_at >= today_start,
        DbReflection.created_at < today_end
    ).all()

    if not todos:
        return {"status": "empty", "message": "오늘 작성한 하루다짐이 없습니다.", "todos": []}
    
    # todos를 리스트로 반환
    todo_list = [todo.todo for todo in todos]
    
    return {
        "status": "success",
        "message": "오늘의 하루다짐을 성공적으로 가져왔습니다.",
        "todos": todo_list
    }
