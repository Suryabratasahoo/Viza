def serialize_chat_session(
    session
):

    return {
        "session_id": str(
            session["_id"]
        ),
        "user_id": session["user_id"],
        "dataset_id": session["dataset_id"],
        "title": session["title"],
        "created_at": session["created_at"]
    }