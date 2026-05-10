import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate  # ✅ fixed import

# Load environment variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY
)

# Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load FAISS vector store
db = FAISS.load_local(
    "vectorstore",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = db.as_retriever(search_kwargs={"k": 4})

# Prompt template
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are an assistant helping users find freelancers.

Use ONLY the provided context.

Context:
{context}

Question:
{question}

Answer clearly:
"""
)

def ask_question(query):
    docs = retriever.invoke(query)  # ✅ get_relevant_documents is deprecated

    context = "\n".join([doc.page_content for doc in docs])

    final_prompt = prompt.format(
        context=context,
        question=query
    )

    result = llm.invoke(final_prompt)

    return result.content