def serialize_chat_message(
    message
):

    return {

        "message_id": str(
            message["_id"]
        ),

        "session_id": message[
            "session_id"
        ],

        "role": message[
            "role"
        ],

        "content": message[
            "content"
        ],

        "sql": message.get(
            "sql"
        ),

        "chart": message.get(
            "chart"
        ),

        "chart_data": message.get(
            "chart_data"
        ),

        "created_at": message[
            "created_at"
        ]
    }