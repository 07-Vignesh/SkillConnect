# 🚀 SkillConnect – AI Powered Freelancing Platform

SkillConnect is a modern AI-driven freelancing platform that connects **clients and freelancers** (both technical & non-technical) with smart recommendations, real-time chat assistance, and location-based discovery.

🔗 **Live Demos:**
- Vercel: [skill-connect-rosy.vercel.app](https://skill-connect-rosy.vercel.app/)
- Self-hosted on AWS EC2 (Docker + nginx + SSL): [skillconnect-aws.vikneshwaran.dev](https://skillconnect-aws.vikneshwaran.dev/)

---

## Features

### Freelancing Marketplace
* Find freelancers based on **category, city, and skills**
* Supports both:
  * **White-collar jobs** (Developers, Designers, etc.)
  * **Blue-collar jobs** (Electricians, Plumbers, etc.)

### AI Chatbot (RAG Based)
* Intelligent assistant for:
  * Freelancer suggestions
  * Platform support
  * General queries
* Uses **FAISS vector database + embeddings**

### Location-Based Search
* Fetch freelancers based on:
  * City
  * Pincode

### Authentication
* Secure login/signup using **Clerk**
* Role-based system (User / Freelancer)

### Booking System
* Book freelancers easily
* Track project details & status

---

## Tech Stack

### Frontend
* React (Vite)
* Tailwind CSS
* shadcn/ui
* Clerk Authentication

### Backend
* Node.js + Express
* MongoDB (Atlas)
* REST APIs

### AI Service (Python)
* FastAPI
* FAISS (Vector Search)
* Custom RAG Engine

### DevOps & Deployment
* **Docker** – multi-stage builds for frontend (Vite → nginx) and backend (Node)
* **AWS EC2** – self-managed Ubuntu server running both containers
* **nginx** – reverse proxy routing `/` to frontend and `/api` to backend
* **Let's Encrypt / Certbot** – free SSL on a custom subdomain
* **Render & Vercel** – managed hosting alternatives for comparison/redundancy
* **MongoDB Atlas** – managed database, decoupled from compute infrastructure

---

## Project Structure

```
FreeLancers-Website/
│
├── Entrepreneur/
│   ├── frontend/        # React frontend (Dockerized)
│   ├── backend/         # Node.js backend (Dockerized)
│
├── csp/                 # AI service (FastAPI + RAG)
│
├── .gitignore
├── README.md
```

---

## Deployment Architecture

SkillConnect is deployed two ways to demonstrate both managed-platform and self-managed infrastructure skills:

**1. Managed hosting** (Vercel + Render)
Fastest path to production — automatic deploys on every `git push`, zero server management.

**2. Self-managed on AWS EC2**
Both frontend and backend run as separate Docker containers on a single Ubuntu EC2 instance:

```
Browser → nginx (port 80/443, SSL)
             ├── /        → frontend container (port 8080)
             └── /api     → backend container (port 5000)
                                 └── MongoDB Atlas (managed, external)
```

Setting this up involved:
* Writing multi-stage Dockerfiles for both frontend and backend
* Configuring AWS security groups, EBS storage, and SSH access
* Setting up nginx as a reverse proxy with path-based routing
* Issuing and auto-renewing a free SSL certificate via Certbot
* Managing environment variables separately for build-time (Vite) vs runtime (Node) contexts
* Debugging real infrastructure issues — disk space exhaustion, port conflicts, and config drift after SSL setup

---

## Setup Instructions

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

### 5️⃣ Run with Docker (optional)

**Backend:**
```
cd Entrepreneur/backend
docker build -t skillconnect-backend .
docker run -d -p 5000:5000 --env-file .env --name skillconnect-backend-app skillconnect-backend
```

**Frontend:**
```
cd Entrepreneur/frontend
docker build \
  --build-arg VITE_BACKEND_URL=<your-backend-url> \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-key> \
  -t skillconnect-frontend .
docker run -d -p 8080:80 --name skillconnect-app skillconnect-frontend
```

> Note: the frontend uses Vite, which bakes environment variables into the build at build time — any `.env` change requires an image rebuild, not just a container restart.

---

## Note on AI Files
Vector database files (`.faiss`, `.pkl`) are excluded from Git.
👉 To regenerate:
```
python create_vectorstore.py
```

---

## Future Improvements
* Payment Integration
* Rating & Review System
* Mobile Responsive Enhancements
* Notifications System
* Multi-language Support
* Docker Compose for one-command local multi-container setup
* CI/CD pipeline for automated AWS deployment on push

---

## Author
**Vikneshwaran**
* Full Stack Developer
* Passionate about AI + Web + Startups + Cloud Infrastructure

---

## Conclusion
SkillConnect is designed to bridge the gap between talent and opportunity using **AI-powered intelligence**, making freelancing smarter, faster, and more accessible — deployed and battle-tested across both managed platforms and self-hosted AWS infrastructure.

---

⭐ If you like this project, give it a star!
