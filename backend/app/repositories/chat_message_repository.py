from bson import ObjectId

from app.database.mongodb import db


def create_chat_message(
    message_data: dict
):
    return db.chat_messages.insert_one(
        message_data
    )


def get_messages_by_session(
    session_id: str
):
    return list(
        db.chat_messages.find(
            {
                "session_id": session_id
            }
        ).sort(
            "created_at",
            1
        )
    )


def get_recent_messages(
    session_id: str,
    limit: int = 10
):
    return list(
        db.chat_messages.find(
            {
                "session_id": session_id
            }
        )
        .sort(
            "created_at",
            -1
        )
        .limit(limit)
    )


def delete_messages_by_session(
    session_id: str
):
    return db.chat_messages.delete_many(
        {
            "session_id": session_id
        }
    )


def get_message_by_id(
    message_id: str
):
    return db.chat_messages.find_one(
        {
            "_id": ObjectId(
                message_id
            )
        }
    )
    
    
def get_latest_assistant_message(
    session_id: str
):

    return db.chat_messages.find_one(
        {
            "session_id": session_id,
            "role": "assistant"
        },
        sort=[
            ("created_at", -1)
        ]
    )