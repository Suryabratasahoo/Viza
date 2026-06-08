def build_history_context(
    history
):

    if not history:
        return "No Previous Conversation History."

    history_text = ""

    for msg in history:

        history_text += (
            f"{msg['role'].upper()}: "
            f"{msg['content']}\n"
        )

    return history_text