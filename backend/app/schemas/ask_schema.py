from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from pydantic import Field

class ChatMessage(BaseModel):
    session_id: str
    role: str
    content: str

    sql: Optional[str] = None
    chart: Optional[dict] = None
    chart_data: Optional[list] = None

    created_at: datetime

class AskRequest(BaseModel):
    session_id:str
    question: str