import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_explanation(
    question: str,
    sql: str,
    results: dict
):

    prompt = f"""
You are a data analyst.

User Question:
{question}

Generated SQL:
{sql}

Query Results:
{results}

Instructions:

1. Explain the result in plain English.
2. Be concise.
3. Mention important numbers.
4. Do not explain SQL.
5. Focus on business insights.
6. Maximum 4 sentences.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return (
        response.choices[0]
        .message
        .content
        .strip()
    )