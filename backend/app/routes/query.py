from fastapi import APIRouter, HTTPException
from app.schemas.query_schema import QueryRequest
from app.services.duckdb_service import get_connection

router = APIRouter()


@router.post("/query")
def execute_query(request: QueryRequest):

    sql = request.sql.strip().upper()

    if not sql.startswith("SELECT"):
        raise HTTPException(
            status_code=400,
            detail="Only SELECT queries are allowed"
        )

    conn = get_connection()

    try:

        result = conn.execute(
            request.sql
        ).fetchdf()

        return {
            "rows": result.to_dict(orient="records"),
            "count": len(result)
        }

    finally:
        conn.close()