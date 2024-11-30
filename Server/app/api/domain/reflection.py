import boto3
from io import BytesIO 
from botocore.exceptions import NoCredentialsError
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.schemas import ReflectionCreate, ReflectionResponse, ReflectionWithImageResponse, ImageResponse, SetProfileImageRequest, SetProfileImageResponse, ReflectionUpdate
from ai.model import sampling  # AI 모델 호출 함수
from app.dependencies import get_db
from datetime import datetime, timedelta   
from app.models import Reflection as DbReflection, User as DbUser, Image as DbImage  # 추가: Image 모델
import pytz
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/api/v1")

KST = pytz.timezone('Asia/Seoul')
load_dotenv()
# AWS S3 설정
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
S3_BUCKET = os.getenv('S3_BUCKET')
S3_REGION = os.getenv('S3_REGION')
# S3 클라이언트 생성
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=S3_REGION
)

# 한국 시간 계산 함수
def get_kst_time():
    return datetime.utcnow() + timedelta(hours=9)

# 이미지 저장 함수 (S3 버킷에 업로드)
def upload_image_to_s3(user_id: int, image, extension="png"):
    current_date = get_kst_time().strftime("%Y%m%d")
    file_name = f"{user_id}_{current_date}.{extension}"

    try:
        # Convert the image to a BytesIO object
        image_file = BytesIO()
        image.save(image_file, format=extension.upper())
        image_file.seek(0)  # Move the cursor to the start of the file

        # Upload the image to S3
        s3_client.upload_fileobj(
            image_file,
            S3_BUCKET,
            file_name,
            ExtraArgs={'ContentType': f'image/{extension}'}  # ACL 설정 제거
        )
        file_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{file_name}"
        return file_url
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS 자격 증명 오류입니다.")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="이미지 업로드 실패")

# 회고 작성 및 AI 이미지 생성 API
@router.patch("/reflections", response_model=ReflectionWithImageResponse, status_code=status.HTTP_200_OK)
def update_reflection(
    reflection: ReflectionUpdate,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    try:
        # 1. 사용자 조회
        user = db.query(DbUser).filter(DbUser.user_id == reflection.user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # 2. 오늘의 reflection 조회
        today_start = datetime.combine(datetime.now(KST).date(), datetime.min.time()).astimezone(KST)
        today_end = datetime.combine(datetime.now(KST).date(), datetime.max.time()).astimezone(KST)
        existing_reflection = db.query(DbReflection).filter(
            DbReflection.user_id == reflection.user_id,
            DbReflection.created_at >= today_start,
            DbReflection.created_at <= today_end
        ).first()

        if not existing_reflection:
            raise HTTPException(status_code=404, detail="오늘 작성된 reflection이 없습니다.")

        # 3. reflection 업데이트
        existing_reflection.resolution = reflection.content
        db.commit()
        db.refresh(existing_reflection)

        # 4. 회고 내용을 AI 모델에 프롬프트로 제공하여 이미지 생성
        prompt = [reflection.content]
        images = sampling(prompt)

        if images is None or len(images) == 0:
            raise HTTPException(status_code=500, detail="AI 이미지 생성에 실패했습니다.")

        # 5. 생성된 이미지를 S3에 업로드
        file_url = upload_image_to_s3(reflection.user_id, images[0])

        # 6. 이미지 정보를 데이터베이스에 저장
        db_image = DbImage(
            reflection_id=existing_reflection.reflection_id,
            user_id=reflection.user_id,
            image_url=file_url,  # S3 URL 경로 설정
            created_at=get_kst_time()
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)

        # 7. 최종 응답 반환
        return ReflectionWithImageResponse(
            reflection=ReflectionResponse(
                reflection_id=existing_reflection.reflection_id,
                content=existing_reflection.resolution,
                created_at=existing_reflection.created_at
            ),
            image=ImageResponse(
                image_id=db_image.image_id,
                image_url=db_image.image_url,
                created_at=db_image.created_at
            )
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



# 프로필 이미지로 설정하는 API
@router.post("/reflections/img", response_model=SetProfileImageResponse, status_code=status.HTTP_200_OK)
def set_profile_image(
    request: SetProfileImageRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    try:
        # Reflection ID로 이미지를 찾음
        db_image = db.query(DbImage).filter(DbImage.reflection_id == request.reflection_id).first()
        if db_image is None:
            raise HTTPException(status_code=404, detail="해당 회고에 연결된 이미지를 찾을 수 없습니다.")

        # 이미지와 연결된 사용자 찾기
        user = db.query(DbUser).filter(DbUser.user_id == db_image.user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

        # 사용자 프로필 이미지 업데이트
        user.profile_img = db_image.image_url
        db.commit()

        return SetProfileImageResponse(
            status=200,
            message="성공"
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="실패")

# 프로필 이미지로 설정하는 API
@router.post("/reflections/img", response_model=SetProfileImageResponse, status_code=status.HTTP_200_OK)
def set_profile_image(
    request: SetProfileImageRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    try:
        # Reflection ID로 이미지를 찾음
        db_image = db.query(DbImage).filter(DbImage.reflection_id == request.reflection_id).first()
        if db_image is None:
            raise HTTPException(status_code=404, detail="해당 회고에 연결된 이미지를 찾을 수 없습니다.")

        # 이미지와 연결된 사용자 찾기
        user = db.query(DbUser).filter(DbUser.user_id == db_image.user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

        # 사용자 프로필 이미지 업데이트
        user.profile_img = db_image.image_url
        db.commit()

        return SetProfileImageResponse(
            status=200,
            message="성공"
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="실패")
