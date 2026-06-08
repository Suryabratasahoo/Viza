from app.services.duckdb_service import get_connection


def validate_sql(sql: str):

    if not sql:
        return False, "Empty SQL query"

    sql = sql.strip()

    if sql == "NO_VALID_QUERY":
        return (
            False,
            "Question cannot be answered from available schema."
        )
        
    
    # Allow only SELECT statements
    if not sql.upper().startswith("SELECT"):
        return (
            False,
            "Only SELECT queries are allowed"
        )

    conn = get_connection()

    try:

        # Parse and validate query
        conn.execute(
            f"EXPLAIN {sql}"
        )

        return (
            True,
            "Valid SQL"
        )

    except Exception as e:

        return (
            False,
            str(e)
        )

    finally:
        conn.close()