from bson import ObjectId

from app.database.mongodb import db


def create_chat_session(
    session_data: dict
):
    return db.chat_sessions.insert_one(
        session_data
    )


def get_chat_session_by_id(
    session_id: str
):
    return db.chat_sessions.find_one(
        {
            "_id": ObjectId(
                session_id
            )
        }
    )


def get_user_chat_session(
    session_id: str,
    user_id: str
):
    return db.chat_sessions.find_one(
        {
            "_id": ObjectId(
                session_id
            ),
            "user_id": user_id
        }
    )


def get_chat_sessions_by_user(
    user_id: str
):
    return list(
        db.chat_sessions.find(
            {
                "user_id": user_id
            }
        ).sort(
            "created_at",
            -1
        )
    )


def get_chat_sessions_by_dataset(
    dataset_id: str
):
    return list(
        db.chat_sessions.find(
            {
                "dataset_id": dataset_id
            }
        ).sort(
            "created_at",
            -1
        )
    )


def update_chat_title(
    session_id: str,
    title: str
):
    return db.chat_sessions.update_one(
        {
            "_id": ObjectId(
                session_id
            )
        },
        {
            "$set": {
                "title": title
            }
        }
    )


def delete_chat_session(
    session_id: str,
    user_id: str
):
    return db.chat_sessions.delete_one(
        {
            "_id": ObjectId(
                session_id
            ),
            "user_id": user_id
        }
    )
    
    
def update_chat_session_title(
    session_id: str,
    user_id: str,
    title: str
):

    return db.chat_sessions.update_one(
        {
            "_id": ObjectId(session_id),
            "user_id": user_id
        },
        {
            "$set": {
                "title": title
            }
        }
    )