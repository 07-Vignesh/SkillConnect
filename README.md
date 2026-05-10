# 🚀 SkillConnect – AI Powered Freelancing Platform

SkillConnect is a modern AI-driven freelancing platform that connects **clients and freelancers** (both technical & non-technical) with smart recommendations, real-time chat assistance, and location-based discovery.

---

## 🌟 Features

### 👨‍💻 Freelancing Marketplace

* Find freelancers based on **category, city, and skills**
* Supports both:

  * 🧠 **White-collar jobs** (Developers, Designers, etc.)
  * 🔧 **Blue-collar jobs** (Electricians, Plumbers, etc.)

### 🤖 AI Chatbot (RAG Based)

* Intelligent assistant for:

  * Freelancer suggestions
  * Platform support
  * General queries
* Uses **FAISS vector database + embeddings**

### 📍 Location-Based Search

* Fetch freelancers based on:

  * City
  * Pincode

### 🔐 Authentication

* Secure login/signup using **Clerk**
* Role-based system (User / Freelancer)

### 📦 Booking System

* Book freelancers easily
* Track project details & status

---

## 🛠️ Tech Stack

### 🌐 Frontend

* React (Vite)
* Tailwind CSS
* shadcn/ui
* Clerk Authentication

### ⚙️ Backend

* Node.js + Express
* MongoDB
* REST APIs

### 🤖 AI Service (Python)

* FastAPI
* FAISS (Vector Search)
* Custom RAG Engine

---

## 📁 Project Structure

```
FreeLancers-Website/
│
├── Entrepreneur/
│   ├── frontend/        # React frontend
│   ├── backend/         # Node.js backend
│
├── csp/                 # AI service (FastAPI + RAG)
│
├── .gitignore
├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/Ahamedin/SkillConnect.git
cd SkillConnect
```

---

### 2️⃣ Backend Setup

```
cd Entrepreneur/backend
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```
cd Entrepreneur/frontend
npm install
npm run dev
```

---

### 4️⃣ AI Service Setup (Python)

```
cd csp
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
python app.py
```

---

## 🧠 Note on AI Files

Vector database files (`.faiss`, `.pkl`) are excluded from Git.

👉 To regenerate:

```
python create_vectorstore.py
```

---

## 📸 Screenshots

> Add screenshots here (Home Page, Chatbot, Dashboard)

---

## 🚀 Future Improvements

* 💳 Payment Integration
* ⭐ Rating & Review System
* 📱 Mobile Responsive Enhancements
* 🔔 Notifications System
* 🌍 Multi-language Support

---

## 👨‍💻 Author

**Iklash Ahamed**

* 💼 Full Stack Developer
* 🚀 Passionate about AI + Web + Startups

---

## 📌 Conclusion

SkillConnect is designed to bridge the gap between talent and opportunity using **AI-powered intelligence**, making freelancing smarter, faster, and more accessible.

---

⭐ If you like this project, give it a star!
