from datetime import datetime

from fastapi import APIRouter
from fastapi import Depends
from app.schemas.user_schema import (
    UserRegister,UserLogin
)

from app.schemas.user_schema import (
    UpdateProfileRequest
)

from app.repositories.user_repository import (
    update_user
)

from app.repositories.user_repository import (
    create_user,
    get_user_by_email
)

from app.services.password_service import (
    hash_password,verify_password
)

from app.services.jwt_service import (
    create_access_token
)

from app.services.current_user_service import (
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    request: UserRegister
):

    existing_user = get_user_by_email(
        request.email
    )

    if existing_user:

        return {
            "status": "error",
            "message": (
                "Email already registered"
            )
        }

    hashed_password = hash_password(
        request.password
    )

    user_document = {

        "name": request.name,

        "email": request.email,

        "password_hash": hashed_password,

        "created_at": datetime.utcnow()
    }

    result = create_user(
        user_document
    )

    user_id = str(
        result.inserted_id
    )

    access_token = create_access_token(
        user_id
    )

    return {

        "status": "success",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "id": user_id,

            "name": request.name,

            "email": request.email
        }
    }    
    
    
@router.post("/login")
def login_user(
    request: UserLogin
):

    user = get_user_by_email(
        request.email
    )

    if not user:

        return {
            "status": "error",
            "message": (
                "Invalid email or password"
            )
        }

    is_valid = verify_password(
        request.password,
        user["password_hash"]
    )

    if not is_valid:

        return {
            "status": "error",
            "message": (
                "Invalid email or password"
            )
        }

    access_token = create_access_token(
        str(user["_id"])
    )

    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }
    
    
    
@router.get("/me")
def get_me(
    current_user=Depends(
        get_current_user
    )
):

    return {
        "status": "success",
        "user": current_user
    }
    
    
@router.put(
    "/profile"
)
def update_profile(
    request: UpdateProfileRequest,
    current_user=Depends(
        get_current_user
    )
):

    update_data = {}

    if request.name:
        update_data["name"] = (
            request.name
        )

    if request.email:
        update_data["email"] = (
            request.email
        )

    if len(update_data) == 0:

        return {
            "status": "error",
            "message":
            "Nothing to update"
        }
    print(current_user)
    print(type(current_user))
    update_user(
        str(
            current_user["id"]
        ),
        update_data
    )

    return {
        "status": "success",
        "message":
        "Profile updated"
    }