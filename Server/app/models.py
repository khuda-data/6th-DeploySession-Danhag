from sqlalchemy import Column, BigInteger, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timedelta

# 한국 시간 계산 함수
def get_kst_time():
    return datetime.utcnow() + timedelta(hours=9)

class User(Base):
    __tablename__ = "user"
    
    user_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    nickname = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=get_kst_time, nullable=False)
    reflections = relationship("Reflection", back_populates="user", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="user", cascade="all, delete-orphan")

class Reflection(Base):
    __tablename__ = "reflection"
    
    reflection_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    todo = Column(String(255), nullable=False)
    resolution = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=get_kst_time, nullable=False)
    
    user = relationship("User", back_populates="reflections")
    images = relationship("Image", back_populates="reflection", cascade="all, delete-orphan")

class Image(Base):
    __tablename__ = "image"
    
    image_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    reflection_id = Column(BigInteger, ForeignKey("reflection.reflection_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("user.user_id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=get_kst_time, nullable=False)
    
    reflection = relationship("Reflection", back_populates="images")
    user = relationship("User", back_populates="images")
