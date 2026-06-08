from fastapi import APIRouter
from app.services.context_builder import build_schema_context

router = APIRouter()

@router.get("/context")
def get_context():

    return {
        "context": build_schema_context()
    }