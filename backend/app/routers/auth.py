import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.notification import Notification
from backend.app.schemas.auth import UserRegister, UserLogin, ForgotPassword, TokenResponse, UserOut
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from backend.app.config import ROLES

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

AVATAR_COLORS = [
    "#1C2826", "#1E3A2F", "#2D5A43", "#3C6E71", "#4361EE",
    "#7209B7", "#B5179E", "#D97706", "#2B2D42", "#4A5568"
]

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if data.role not in ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(ROLES)}"
        )

    # Check username / email uniqueness
    existing_user = db.query(User).filter(
        or_(User.username == data.username.strip(), User.email == data.email.strip().lower())
    ).first()

    if existing_user:
        if existing_user.username.lower() == data.username.strip().lower():
            raise HTTPException(status_code=400, detail="Username is already taken.")
        else:
            raise HTTPException(status_code=400, detail="Email address is already registered.")

    hashed = hash_password(data.password)
    user = User(
        username=data.username.strip(),
        email=data.email.strip().lower(),
        full_name=data.full_name.strip(),
        role=data.role,
        hashed_password=hashed,
        avatar_color=random.choice(AVATAR_COLORS)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Add welcome notification
    welcome_notif = Notification(
        user_id=user.id,
        title="Welcome to SDLC Enterprise",
        message=f"Hello {user.full_name}! Your account has been created with role '{user.role}'.",
        type="info",
        link="#dashboard"
    )
    db.add(welcome_notif)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.full_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    identifier = data.username_or_email.strip()
    user = db.query(User).filter(
        or_(User.username == identifier, User.email == identifier.lower())
    ).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password."
        )

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.full_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user": current_user.to_dict()
    }

@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if not user:
        # Avoid user enumeration in public responses, or return clear message
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account associated with that email address was found."
        )

    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password has been successfully updated. You can now log in."}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully."}

@router.get("/users")
def list_users(role: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.all()
    return [u.to_dict() for u in users]
