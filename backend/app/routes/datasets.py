from fastapi import APIRouter,HTTPException
from app.services.duckdb_service import get_connection

router = APIRouter()

@router.get("/tables")
def get_tables():

    conn = get_connection()

    tables = conn.execute(
        "SHOW TABLES"
    ).fetchall()

    conn.close()

    return {
        "tables": [table[0] for table in tables]
    }
    
    
@router.get("/tables/{table_name}")
def get_table_schema(table_name: str):

    conn = get_connection()

    try:
        schema = conn.execute(
            f"DESCRIBE {table_name}"
        ).fetchall()

        return {
            "table": table_name,
            "columns": [
                {
                    "name": row[0],
                    "type": row[1]
                }
                for row in schema
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")

    finally:
        conn.close()
        
        
        
        
@router.get("/tables/{table_name}/preview")
def preview_table(table_name: str):

    conn = get_connection()

    try:
        rows = conn.execute(
            f"SELECT * FROM {table_name} LIMIT 5"
        ).fetchdf()

        return {
            "table": table_name,
            "preview": rows.to_dict(orient="records")
        }

    except Exception:
        raise HTTPException(
            status_code=404,
            detail=f"Table '{table_name}' not found"
        )

    finally:
        conn.close()
        
        
        
import os
from fastapi import HTTPException

@router.delete("/datasets/{table_name}")
def delete_dataset(table_name: str):

    conn = get_connection()

    try:

        conn.execute(
            f"DROP TABLE IF EXISTS {table_name}"
        )

        csv_path = f"uploads/{table_name}.csv"

        if os.path.exists(csv_path):
            os.remove(csv_path)

        return {
            "message": f"{table_name} removed successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:
        conn.close()