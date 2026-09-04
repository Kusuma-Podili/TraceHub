from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field(..., description="Project Manager, Developer, or Tester")

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class ForgotPassword(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=6)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    avatar_color: Optional[str] = None
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}
