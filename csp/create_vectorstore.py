import json
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# Load freelancers data
with open("data/freelancers.json", "r", encoding="utf-8") as f:
    freelancers = json.load(f)

docs = []

for f in freelancers:
    text = f"""
Name: {f['name']}
Category: {f['category']}
Subcategory: {f.get('subcategory', 'N/A')}
City: {f.get('location', {}).get('city', 'N/A')}
Price: {f.get('pricing', {}).get('amount', 'N/A')}
Rating: {f.get('rating', 0)}
Completed Jobs: {f.get('completedJobs', 0)}
Skills: {', '.join(f.get('skills', []))}
"""
    docs.append(text)

# Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create FAISS DB
db = FAISS.from_texts(docs, embeddings)

# Save
db.save_local("vectorstore")

print("✅ Vectorstore created successfully")