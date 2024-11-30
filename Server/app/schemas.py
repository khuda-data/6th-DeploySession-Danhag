from pydantic import BaseModel
from datetime import datetime
from typing import List

class ReflectionCreate(BaseModel):
    user_id: int
    content: str

class ReflectionResponse(BaseModel):
    reflection_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic V2 대응

class ImageResponse(BaseModel):
    image_id: int
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic V2 대응

class ReflectionWithImageResponse(BaseModel):
    reflection: ReflectionResponse
    image: ImageResponse

    class Config:
        from_attributes = True  # Pydantic V2 대응


## 유저 정보 조회 API 응답 
class UserResponse(BaseModel):
    id: int
    github_id: str
    nickname: str
    email: str = None
    profile_img: str = None
    continuous_days: int = 0

    class Config:
        from_attributes = True  # Pydantic V2에서 ORM 호환성을 유지하기 위해 사용

## 프로필 이미지로 등록 
class SetProfileImageRequest(BaseModel):
    reflection_id: int

class SetProfileImageResponse(BaseModel):
    status: int
    message: str

# 구글 로그인 관련 스키마

class OAuthUser(BaseModel):
    id: str
    email: str
    name: str

class Login(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int 
    nickname: str  

class TodoRequest(BaseModel):
    user_id: int
    tasks: List[str]

class TodoPostResponse(BaseModel):
    status: str
    message: str

class TodoGetResponse(BaseModel):
    status: str
    message: str
    todos: list[str]
class TodoResponse(BaseModel):
    status: str
    message: str
    reflection_id: int = None

    class Config:
        from_attributes = True
class ReflectionUpdate(BaseModel):
    user_id: int
    content: str
class RegisterUser(BaseModel):
    nickname: str
    email: str
    password: str
