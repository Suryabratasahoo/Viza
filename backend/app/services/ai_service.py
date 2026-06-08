import os

from groq import Groq
from dotenv import load_dotenv

from app.services.prompt_builder import build_prompt

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def clean_sql(sql: str):

    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")

    return sql.strip()


def generate_sql(
    question: str,
    context: str,
    history: str|None=None
):

    prompt = build_prompt(
    question,
    context,
    history or ""
)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """
You are a SQL generation engine.

Return ONLY SQL.

Never explain.
Never use markdown.
Never use backticks.
Never add comments.
Never add introductory text.

If the question cannot be answered using the schema:

Return exactly:

NO_VALID_QUERY
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    sql = response.choices[0].message.content

    return clean_sql(sql)


def correct_sql(
    question: str,
    context: str,
    prev_history:str|None,
    previous_attempts: list,
    current_sql: str,
    error: str
):  
    history_context =prev_history or ""

    history = ""

    for idx, attempt in enumerate(
        previous_attempts,
        start=1
    ):

        history += (
            f"\nAttempt {idx}\n"
            f"SQL:\n{attempt['sql']}\n"
            f"Error:\n{attempt['error']}\n"
        )

    prompt = f"""
You are an expert DuckDB SQL correction engine.

Database Schema:

{context}

Conversation History:

{history_context}

Original Question:

{question}

Previous Attempts:

{history}

Latest SQL:

{current_sql}

Validation Error:

{error}

Instructions:

1. Fix the SQL.
2. Use only tables in the schema.
3. Use only columns in the schema.
4. Use conversation history when resolving references like:
   - it
   - its
   - they
   - them
   - that country
   - that product
   - previous result
5. Do not repeat previous mistakes.
6. If the question cannot be answered using the schema return exactly:

NO_VALID_QUERY

Return ONLY SQL or NO_VALID_QUERY.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """
You are a SQL correction engine.

Return ONLY SQL.

Never explain.
Never use markdown.
Never use backticks.
Never add comments.

If impossible return:

NO_VALID_QUERY
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return clean_sql(
        response.choices[0].message.content
    )