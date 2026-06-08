import duckdb


def get_connection():
    return duckdb.connect("analytics.db")


def load_csv_to_duckdb(table_name: str, file_path: str):
    conn = get_connection()

    conn.execute(f"""
        CREATE OR REPLACE TABLE {table_name}
        AS
        SELECT *
        FROM read_csv_auto('{file_path}')
    """)

    conn.close()
    
# app/services/duckdb_service.py

def drop_table(
    table_name: str
):

    conn = get_connection()

    try:

        conn.execute(
            f"DROP TABLE IF EXISTS {table_name}"
        )

    finally:

        conn.close()