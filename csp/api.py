import json
import re
import os
from collections import defaultdict, deque
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.responses import JSONResponse


# ===============================
# Load ENV
# ===============================

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
API_KEY = os.getenv("PYTHON_API_KEY", "Unitoids@2026")

print("GEMINI KEY:", GOOGLE_API_KEY)
# ===============================
# FastAPI App
# ===============================

app = FastAPI(title="Freelancer Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message": "API running"}


# ===============================
# Load Data
# ===============================

with open("data/freelancers.json", "r", encoding="utf-8") as f:
    freelancers_data = json.load(f)

with open("data/website_info.txt", "r", encoding="utf-8") as f:
    content = f.read()

sections_data = {}
current_section = None

for line in content.splitlines():
    line = line.strip()

    if line.startswith("## "):
        current_section = line[3:].strip()
        sections_data[current_section] = ""

    elif current_section:
        sections_data[current_section] += line + "\n"

# ===============================
# LLM (Gemini)
# ===============================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY
)

# ===============================
# Embeddings
# ===============================

embeddings_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
# ===============================
# Helper Functions
# ===============================

def create_documents(freelancers):

    docs = []

    for f in freelancers:

        projects_info = "\n".join([
            f"Title: {p.get('projectTitle', 'N/A')}, Rating: {p.get('rating', 0)}"
            for p in f.get("projects", [])
        ])

        skills = ", ".join(f.get("skills", [])) if f.get("skills") else "N/A"
        city = f.get("city") or f.get("location", {}).get("city", "N/A")
        pincode = f.get("location", {}).get("pincode", "N/A")
        subcategory = f.get("subcategory", "N/A")
        experience = f.get("experience", "N/A")

        pricing = f.get("pricing", {})
        price_amount = f.get("price", pricing.get("amount", "N/A"))
        price_type = pricing.get("type", "N/A")
        price_desc = pricing.get("description", "N/A")

        text = f"""
Name: {f['name']}
Category: {f['category']}
Subcategory: {subcategory}
Skills: {skills}
Experience: {experience}
City: {city}
Pincode: {pincode}
Price: {price_amount}
Price Type: {price_type}
Pricing Description: {price_desc}
Average Rating: {f.get('averageRating', f.get('rating', 0))}
Completed Jobs: {f.get('completedJobs', 0)}
Number of Projects: {len(f.get('projects', []))}

Projects:
{projects_info}
"""

        docs.append(text)

    return docs


# ===============================
# Intent Classification
# ===============================
intent_prompt = """
You are an intent classifier for a freelancer marketplace website.

If the user is searching for a service, freelancer, or skill (like web developer, app developer, tutor, designer, etc.), classify as:

FREELANCER_QUERY

If the user is asking about the website (pricing, booking, support, etc.), classify as:

SUPPORT_QUERY

If the user is just chatting (hello, how are you, etc.), classify as:

GENERAL_CHAT

User Query: "{query}"

Return ONLY one word:
FREELANCER_QUERY
SUPPORT_QUERY
GENERAL_CHAT
"""

def classify_intent(query):

    q = query.lower()

    freelancer_keywords = [
        "developer",
        "web",
        "website",
        "app",
        "mobile",
        "designer",
        "tutor",
        "engineer",
        "freelancer",
        "development",
        "marketing",
        "digital marketing",
        "seo",
        "interior",
        "photographer",
        "video editing",
        "data analysis",
        "legal",
        "finance",
        "financial consulting"
    ]

    support_keywords = [
    "book",
    "booking",
    "payment",
    "advance",
    "how to hire",
    "contact",
    "support",
    "cancel",
    "refund",
    "profile",
    "login",
    "signup",
    "register"
]



    # If query contains freelancer-related keywords
    if any(word in q for word in freelancer_keywords):
        return "FREELANCER_QUERY"
    
    if any(word in q for word in support_keywords):
        return "SUPPORT_QUERY"
    
    # greetings
    if q in ["hi", "hello", "hey", "yo"]:
        return "GENERAL_CHAT"

    # fallback to Gemini
    prompt = intent_prompt.format(query=query)

    result = llm.invoke(prompt)

    intent = result.content.strip().upper()

    return intent


# ===============================
# Vector Stores (LOAD ONLY)
# ===============================

print("🔧 Loading FAISS vector stores...")

FAISS_FREELANCERS_PATH = "data/faiss_freelancers_index"
FAISS_SUPPORT_PATH = "data/faiss_support_index"

# Freelancer DB
freelancer_db = FAISS.load_local(
    FAISS_FREELANCERS_PATH,
    embeddings_model,
    allow_dangerous_deserialization=True
)

freelancer_retriever = freelancer_db.as_retriever(
    search_kwargs={"k": 5}
)

# Support DB
support_db = FAISS.load_local(
    FAISS_SUPPORT_PATH,
    embeddings_model,
    allow_dangerous_deserialization=True
)

support_retriever = support_db.as_retriever(
    search_kwargs={"k": 3}
)

print("✅ FAISS indexes loaded successfully")
# ===============================
# Prompt Templates
# ===============================

freelancer_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are an AI assistant helping users find freelancers.

Use ONLY the context provided.

Always include:
- Name
- Category
- City
- Rating
- Projects

Context:
{context}

Question:
{question}

Answer clearly.
"""
)

support_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are a helpful support assistant.

Answer the question using ONLY the provided context.

Context:
{context}

Question:
{question}

Answer:
"""
)

# ===============================
# QA Chains
# ===============================

freelancer_qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=freelancer_retriever,
    chain_type_kwargs={"prompt": freelancer_prompt}
)

support_qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=support_retriever,
    chain_type_kwargs={"prompt": support_prompt}
)

print("🚀 Chatbot ready!")

# ===============================
# Memory
# ===============================

session_memory = defaultdict(lambda: deque(maxlen=3))

# ===============================
# API Models
# ===============================

class QueryRequest(BaseModel):
    message: str


# ===============================
# Chat Endpoint
# ===============================

# ===============================
# Chat Endpoint
# ===============================


@app.post("/chat")
async def chat_endpoint(
    req: QueryRequest,
    x_api_key: str = Header(None),
    x_session_id: str = Header("default")
):

    try:

        # ===============================
        # AUTH
        # ===============================

        if x_api_key != API_KEY:
            raise HTTPException(
                status_code=401,
                detail="Unauthorized"
            )

        query = req.message.strip()

        if not query:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Empty message"
                }
            )

        # ===============================
        # MEMORY
        # ===============================

        chat_history = "\n".join(
            list(session_memory[x_session_id])
        )

        # ===============================
        # INTENT
        # ===============================

        intent = classify_intent(query)

        response = {}

        # ===============================
        # FREELANCER SEARCH
        # ===============================

        if intent == "FREELANCER_QUERY":

            result = freelancer_qa_chain.invoke({
                "query": query
            })

            response["freelancer_answer"] = result.get(
                "result",
                "No freelancer results found"
            )

        # ===============================
        # SUPPORT
        # ===============================

        elif intent == "SUPPORT_QUERY":

            result = support_qa_chain.invoke({
                "query": query
            })

            response["support_answer"] = result.get(
                "result",
                "No support answer found"
            )

        # ===============================
        # GENERAL CHAT
        # ===============================

        else:

            prompt = f"""
You are a friendly assistant.

Conversation history:
{chat_history}

User: {query}
Assistant:
"""

            reply = llm.invoke(prompt)

            response["general_answer"] = reply.content.strip()

        # ===============================
        # SAVE MEMORY
        # ===============================

        session_memory[x_session_id].append(
            f"User: {query}\nAI: {list(response.values())[0]}"
        )

        return response

    except Exception as e:

        print("❌ CHAT ERROR:", str(e))

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )