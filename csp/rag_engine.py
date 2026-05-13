import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

llm = None
embeddings = None
db = None
retriever = None

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

def initialize():

    global llm, embeddings, db, retriever

    if llm is None:
        llm = genai.GenerativeModel("gemini-3-flash-preview")
    if embeddings is None:
        # embeddings = HuggingFaceEmbeddings(
        #     model_name="sentence-transformers/all-MiniLM-L6-v2"
        # )
       embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
)


    if db is None:
        db = FAISS.load_local(
            "vectorstore",
            embeddings,
            allow_dangerous_deserialization=True
        )

        retriever = db.as_retriever(search_kwargs={"k": 4})

def ask_question(query):

    initialize()

    docs = retriever.get_relevant_documents(query)

    context = "\n".join([doc.page_content for doc in docs])

    final_prompt = prompt.format(
        context=context,
        question=query
    )

    response = llm.generate_content(final_prompt)

    return response.text