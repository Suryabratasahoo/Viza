import json

from app.services.duckdb_service import (
    get_connection
)


def build_schema_context(
    dataset
):

    conn = get_connection()

    context = "DATABASE SCHEMA\n\n"

    try:

        table_name = dataset[
            "table_name"
        ]

        context += "=" * 50 + "\n"
        context += f"TABLE: {table_name}\n"
        context += "=" * 50 + "\n\n"

        row_count = conn.execute(
            f"""
            SELECT COUNT(*)
            FROM {table_name}
            """
        ).fetchone()[0]

        context += (
            f"Rows: {row_count}\n\n"
        )

        profile = dataset.get(
            "profile",
            []
        )

        if len(profile) > 0:

            context += (
                "Columns:\n\n"
            )

            for column in profile:

                context += (
                    f"Name: {column.get('name', '')}\n"
                    f"Type: {column.get('dtype', '')}\n"
                    f"Role: {column.get('role', '')}\n"
                    f"Unique Values: {column.get('unique_count', 0)}\n"
                )

                sample_values = column.get(
                    "sample_values",
                    []
                )

                if len(sample_values) > 0:

                    context += (
                        "Examples: "
                        f"{', '.join(map(str, sample_values))}\n"
                    )

                context += "\n"

        else:

            schema = conn.execute(
                f"""
                DESCRIBE {table_name}
                """
            ).fetchall()

            context += (
                "Columns:\n"
            )

            for column in schema:

                context += (
                    f"{column[0]} "
                    f"{column[1]}\n"
                )

            context += "\n"

        return context

    finally:

        conn.close()