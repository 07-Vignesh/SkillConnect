import os
import json
from dotenv import load_dotenv

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# ===============================
# LOAD ENV
# ===============================

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ===============================
# LOAD DATA
# ===============================

with open("data/freelancers.json", "r", encoding="utf-8") as f:
    freelancers_data = json.load(f)

with open("data/website_info.txt", "r", encoding="utf-8") as f:
    website_content = f.read()

# ===============================
# CREATE EMBEDDINGS
# ===============================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ===============================
# CREATE FREELANCER DOCUMENTS
# ===============================

freelancer_docs = []

for f in freelancers_data:

    skills = ", ".join(f.get("skills", [])) if f.get("skills") else "N/A"

    city = (
        f.get("city")
        or f.get("location", {}).get("city", "N/A")
    )

    pincode = (
        f.get("location", {}).get("pincode", "N/A")
    )

    pricing = f.get("pricing", {})

    price = (
        f.get("price")
        or pricing.get("amount", "N/A")
    )

    text = f"""
Name: {f.get('name', 'N/A')}
Category: {f.get('category', 'N/A')}
Subcategory: {f.get('subcategory', 'N/A')}
Skills: {skills}
Experience: {f.get('experience', 'N/A')}
City: {city}
Pincode: {pincode}
Price: {price}
Rating: {f.get('averageRating', f.get('rating', 0))}
Projects: {len(f.get('projects', []))}
"""

    freelancer_docs.append(text)

# ===============================
# CREATE FREELANCER VECTORSTORE
# ===============================

freelancer_db = FAISS.from_texts(
    freelancer_docs,
    embeddings
)

freelancer_db.save_local(
    "data/faiss_freelancers_index"
)

# ===============================
# CREATE SUPPORT VECTORSTORE
# ===============================

support_docs = [website_content]

support_db = FAISS.from_texts(
    support_docs,
    embeddings
)

support_db.save_local(
    "data/faiss_support_index"
)

print("✅ Vectorstores created successfully")