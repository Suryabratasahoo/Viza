from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from pydantic import BaseModel

class UpdateSessionTitleRequest(BaseModel):
    title: str

from app.schemas.chat_session_schema import (
    CreateChatSessionRequest
)

from app.services.current_user_service import (
    get_current_user
)

from app.repositories.chat_session_repository import (
    create_chat_session
)

from app.repositories.dataset_repository import (
    get_user_dataset
)

from app.repositories.chat_session_repository import (
    get_chat_sessions_by_user
)

from app.utils.chat_session_serializer import (
    serialize_chat_session
)

from app.repositories.chat_session_repository import (
    get_user_chat_session
)

from app.repositories.chat_message_repository import (
    get_messages_by_session
)

from app.repositories.chat_session_repository import (
    update_chat_session_title
)

from app.utils.chat_message_serializer import (
    serialize_chat_message
)

from app.repositories.chat_session_repository import (
    get_user_chat_session,
    delete_chat_session
)

from app.repositories.chat_message_repository import (
    delete_messages_by_session
)

from app.repositories.chat_message_repository import (
    get_latest_assistant_message
)

router = APIRouter()


@router.post(
    "/chat-sessions"
)
def create_session(
    request: CreateChatSessionRequest,
    current_user=Depends(
        get_current_user
    )
):

    dataset = get_user_dataset(
        request.dataset_id,
        current_user["id"]
    )

    if dataset is None:

        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    session_doc = {

        "user_id": current_user["id"],

        "dataset_id": request.dataset_id,

        "title": (
            dataset["filename"]
            .replace(".csv", "")
        ),

        "created_at": datetime.now()
    }

    result = create_chat_session(
        session_doc
    )

    return {

        "status": "success",

        "session_id": str(
            result.inserted_id
        ),

        "dataset_id": request.dataset_id,

        "title": session_doc["title"]
    }
    
    
@router.get(
    "/chat-sessions"
)
def get_sessions(
    current_user=Depends(
        get_current_user
    )
):

    sessions = get_chat_sessions_by_user(
        current_user["id"]
    )

    session_list = []

    for session in sessions:

        latest_message = (
            get_latest_assistant_message(
                str(session["_id"])
            )
        )

        preview_chart = None

        if (
            latest_message
            and latest_message.get(
                "chart"
            )
        ):

            preview_chart = (
                latest_message["chart"]
                .get("type")
            )

        serialized_session = (
            serialize_chat_session(
                session
            )
        )

        serialized_session[
            "preview_chart"
        ] = preview_chart

        session_list.append(
            serialized_session
        )
    print(session_list)

    return {

        "status": "success",

        "count": len(
            session_list
        ),

        "sessions": session_list
    }    
    
@router.get(
    "/chat-sessions/{session_id}"
)
def get_chat_session(
    session_id: str,
    current_user=Depends(
        get_current_user
    )
):

    session = get_user_chat_session(
        session_id,
        current_user["id"]
    )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    messages = get_messages_by_session(
        session_id
    )

    return {

        "status": "success",

        "session": {
            "session_id": str(
                session["_id"]
            ),
            "dataset_id": session[
                "dataset_id"
            ],
            "title": session[
                "title"
            ],
            "created_at": session[
                "created_at"
            ]
        },

        "message_count": len(
            messages
        ),

        "messages": [

            serialize_chat_message(
                message
            )

            for message in messages
        ]
    }
    
    
@router.delete(
    "/chat-sessions/{session_id}"
)
def delete_session(
    session_id: str,
    current_user=Depends(
        get_current_user
    )
):

    session = get_user_chat_session(
        session_id,
        current_user["id"]
    )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    delete_messages_by_session(
        session_id
    )

    result = delete_chat_session(
        session_id,
        current_user["id"]
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=400,
            detail="Failed to delete session"
        )

    return {
        "status": "success",
        "message": "Chat session deleted successfully",
        "session_id": session_id
    }
    
    
@router.patch(
    "/chat-sessions/{session_id}"
)
def update_session_title(
    session_id: str,
    request: UpdateSessionTitleRequest,
    current_user=Depends(
        get_current_user
    )
):

    session = get_user_chat_session(
        session_id,
        current_user["id"]
    )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    update_chat_session_title(
        session_id,
        current_user["id"],
        request.title
    )

    return {
        "status": "success",
        "title": request.title
    }
    
    
