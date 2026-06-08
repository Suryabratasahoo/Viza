from pydantic import BaseModel

class CreateChatSessionRequest(BaseModel):
    dataset_id:str