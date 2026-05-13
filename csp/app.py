from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import ask_question
import os

API_KEY = "Unitoids@2026"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str


@app.post("/chat")
def chat(query: Query):

    answer = ask_question(query.message)

    return {
        "answer": answer
    }