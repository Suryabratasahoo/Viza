from app.services.duckdb_service import get_connection


def execute_sql(sql: str):

    conn = get_connection()

    try:

        df = conn.execute(
            sql
        ).fetchdf()

        total_rows = len(df)

        response_df = df

        if total_rows > 100:
            response_df = df.head(100)

        return {
            "success": True,

            # Needed for chart generation
            "dataframe": df,

            # Needed for API response
            "rows": response_df.to_dict(
                orient="records"
            ),

            "row_count": total_rows,

            "truncated": total_rows > 100
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

    finally:
        conn.close()