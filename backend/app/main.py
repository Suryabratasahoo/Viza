from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.datasets import router as dataset_router
from app.routes.query import router as query_router
from app.routes.context import router as context_router
from app.routes.ask import router as ask_router
from app.routes.auth_router import router as auth_router
from app.routes.dataset_router import router as dataset_router
from app.routes.chat_session_router import router as chat_session_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(dataset_router)
app.include_router(query_router)
app.include_router(context_router)
app.include_router(ask_router)
app.include_router(auth_router)
app.include_router(dataset_router)
app.include_router(chat_session_router)

@app.get("/")
def home():
    return {"message": "Backend Running"}