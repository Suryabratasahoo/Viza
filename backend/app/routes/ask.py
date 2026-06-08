from datetime import datetime
from fastapi import APIRouter
from fastapi import HTTPException
from app.schemas.ask_schema import AskRequest

from app.services.ai_service import (
    generate_sql,
    correct_sql
)

from app.repositories.chat_session_repository import (
    get_chat_session_by_id
)

from app.repositories.dataset_repository import (
    get_dataset_by_id
)

from app.services.sql_validator import (
    validate_sql
)

from app.services.context_builder import (
    build_schema_context
)

from app.services.query_executor import (
    execute_sql
)

from app.services.explanation_service import (
    generate_explanation
)

from app.services.chart_service import (
    detect_chart_type
)

from app.repositories.chat_message_repository import(
    create_chat_message,
    get_recent_messages
)

from app.services.history_context_service import (
    build_history_context
)

router = APIRouter()

MAX_RETRIES = 3


@router.post("/ask")
def ask_question(request: AskRequest):
    
    create_chat_message(
        {
            "session_id": request.session_id,
            "role": "user",
            "content": request.question,
            "created_at": datetime.now()
        }
    )
    session = get_chat_session_by_id(
        request.session_id
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )
    
    dataset = get_dataset_by_id(
        session["dataset_id"]
    )
    
    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    context = build_schema_context(
        dataset
    )
    
    recent_messages = get_recent_messages(
        request.session_id,
        limit=10
    )

    history_context = build_history_context(
        reversed(recent_messages)
    )

    sql = generate_sql(
        question=request.question,
        context=context,
        history=history_context
    )

    attempts = []

    # ------------------------------------
    # Validation + Self Correction Loop
    # ------------------------------------

    for _ in range(MAX_RETRIES):

        is_valid, validation_message = validate_sql(
            sql
        )

        if is_valid:
            break

        attempts.append({
            "sql": sql,
            "error": validation_message
        })

        if sql == "NO_VALID_QUERY":

            return {
                "status": "error",
                "message": (
                    "The question cannot be answered "
                    "using the available data."
                ),
                "attempts": attempts
            }

        sql = correct_sql(
            question=request.question,
            context=context,
            prev_history=history_context,
            previous_attempts=attempts,
            current_sql=sql,
            error=validation_message
        )

    # ------------------------------------
    # Final Validation Check
    # ------------------------------------

    is_valid, validation_message = validate_sql(
        sql
    )

    if not is_valid:

        return {
            "status": "error",
            "message": validation_message,
            "attempts": attempts
        }

    # ------------------------------------
    # Execute Query
    # ------------------------------------

    result = execute_sql(sql)

    if not result["success"]:

        return {
            "status": "error",
            "message": result["error"],
            "sql": sql
        }

    # ------------------------------------
    # Chart Detection
    # ------------------------------------

    chart = detect_chart_type(
        result["dataframe"]
    )

    # ------------------------------------
    # Explanation Generation
    # ------------------------------------

    rows_for_llm = result["rows"][:20]

    explanation = generate_explanation(
        question=request.question,
        sql=sql,
        results=rows_for_llm
    )
    create_chat_message(
        {
            "session_id": request.session_id,
            "role": "assistant",
            "content": explanation,
            "sql": sql,
            "chart": chart,
            "chart_data": result["rows"],
            "created_at": datetime.now()
        }
    )  
  

    # ------------------------------------
    # Remove DataFrame Before JSON Response
    # ------------------------------------

    result.pop("dataframe", None)

    # ------------------------------------
    # Final Response
    # ------------------------------------

    return {
        "status": "success",
        "question": request.question,
        "sql": sql,
        "attempt_count": len(attempts) + 1,
        "result": result,
        "chart": chart,
        "explanation": explanation
    }