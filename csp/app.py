from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ✅ Added
from pydantic import BaseModel
from rag_engine import ask_question
import os

API_KEY = "Vishnu@2004"

app = FastAPI()

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str

@app.post("/chat")
def chat(
    query: Query,
    x_api_key: str = Header(None)
):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401)

    answer = ask_question(query.message)

    return {
        "answer": answer
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)