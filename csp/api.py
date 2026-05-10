import json
import re
import os
from collections import defaultdict, deque
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from linkedin_api import Linkedin

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
API_KEY = os.getenv("PYTHON_API_KEY", "Vishnu@2004")

print("GEMINI KEY:", GEMINI_API_KEY)

app = FastAPI(title="Freelancer Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    google_api_key=GEMINI_API_KEY
)

embeddings_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def create_documents(freelancers):
    docs = []
    for f in freelancers:
        projects_info = "\n".join([
            f"Title: {p['projectTitle']}, Rating: {p.get('rating', 0)}"
            for p in f.get("projects", [])
        ])
        text = f"""Name: {f['name']}
Category: {f['category']}
City: {f.get('city', 'N/A')}
Price: {f['price']}
Average Rating: {f.get('averageRating', 0)}
Number of Projects: {len(f.get('projects', []))}
Projects:
{projects_info}"""
        docs.append(text)
    return docs

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
    freelancer_keywords = ["developer", "web", "website", "app", "mobile", "designer", "tutor", "engineer", "freelancer", "development"]
    support_keywords = ["book", "booking", "payment", "advance", "how to hire", "contact", "support", "cancel", "refund", "profile", "login", "signup", "register"]

    if any(word in q for word in freelancer_keywords):
        return "FREELANCER_QUERY"
    if any(word in q for word in support_keywords):
        return "SUPPORT_QUERY"
    if q in ["hi", "hello", "hey", "yo"]:
        return "GENERAL_CHAT"

    prompt = intent_prompt.format(query=query)
    result = llm.invoke(prompt)
    intent = result.content.strip().upper()
    return intent

print("🔧 Loading FAISS vector stores...")

FAISS_FREELANCERS_PATH = "data/faiss_freelancers_index"
FAISS_SUPPORT_PATH = "data/faiss_support_index"

if os.path.exists(FAISS_FREELANCERS_PATH):
    freelancer_db = FAISS.load_local(FAISS_FREELANCERS_PATH, embeddings_model, allow_dangerous_deserialization=True)
else:
    freelancer_docs = create_documents(freelancers_data)
    freelancer_db = FAISS.from_texts(freelancer_docs, embeddings_model)
    freelancer_db.save_local(FAISS_FREELANCERS_PATH)

freelancer_retriever = freelancer_db.as_retriever(search_kwargs={"k": 5})

if os.path.exists(FAISS_SUPPORT_PATH):
    support_db = FAISS.load_local(FAISS_SUPPORT_PATH, embeddings_model, allow_dangerous_deserialization=True)
else:
    support_docs = [f"{title}: {text}" for title, text in sections_data.items()]
    support_db = FAISS.from_texts(support_docs, embeddings_model)
    support_db.save_local(FAISS_SUPPORT_PATH)

support_retriever = support_db.as_retriever(search_kwargs={"k": 3})

# ✅ UPDATED PROMPT - returns structured parseable blocks
freelancer_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are an AI assistant helping users find freelancers.

Use ONLY the context provided. Return ONLY freelancer profiles in this exact format.
Each freelancer must be separated by a blank line. Do NOT add any extra text, headings, or explanation.

Name: <name>
Category: <category>
City: <city>
Rating: <averageRating>
Price: <price>

Context:
{context}

Question:
{question}
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

session_memory = defaultdict(lambda: deque(maxlen=3))

class QueryRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(
    req: QueryRequest,
    x_api_key: str = Header(None),
    x_session_id: str = Header("default")
):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    query = req.message.strip()
    chat_history = "\n".join(list(session_memory[x_session_id]))
    intent = classify_intent(query)
    response = {}

    if intent == "FREELANCER_QUERY":
        result = freelancer_qa_chain.invoke({"query": query})
        response["freelancer_answer"] = result["result"]

    elif intent == "SUPPORT_QUERY":
        result = support_qa_chain.invoke({"query": query})
        response["support_answer"] = result["result"]

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

    session_memory[x_session_id].append(
        f"User: {query}\nAI: {list(response.values())[0]}"
    )

    return response

@app.get("/linkedin/{city}")
def linkedin(city: str):
    try:
        api = Linkedin("ahmedsbro1234@gmail.com", "botlinkedinid")
        results = api.search_people(keywords=city)
        freelancers = []
        for r in results[:5]:
            freelancers.append({
                "name": r.get("name"),
                "category": r.get("headline"),
                "city": r.get("location"),
                "profile": f"https://linkedin.com/in/{r.get('public_id')}"
            })
        return freelancers
    except Exception as e:
        print("LinkedIn ERROR:", e)
        return [
            {"name": "Rahul Sharma", "category": "Web Developer", "city": city, "profile": "#"},
            {"name": "Ankit Verma", "category": "App Developer", "city": city, "profile": "#"}
        ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)