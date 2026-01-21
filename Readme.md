# 📚 LMS by TLE Terminator

A full‑stack **Learning Management System (LMS)** built to support teachers and students with structured courses, live lectures, quizzes, community interaction, and intelligent support tools. Designed for scalability, real‑world classroom needs, and future extensibility.

---

## 🚀 Overview

LMS by TLE Terminator is a modern web platform that enables:

* Structured course creation & enrollment
* Recorded and live lectures
* Quizzes and assessments
* Community chat & discussion
* AI‑powered doubt resolution
* Attention tracking engine (optional integration)

The platform aims to bridge the gap between teaching plans and classroom execution, especially for resource‑constrained or large‑scale education systems.

---

## 🎯 Key Features

### 👩‍🏫 Course & Lecture Management

* Create and manage courses and curriculum
* Upload video lectures, audio, and PDF notes
* Support for free and paid lectures

### 🎥 Live Lecture System

* Real‑time live class support
* Low‑latency interaction design
* Extensible to integrate video conferencing tools

### 📝 Quizzes & Assessments

* Create quizzes per course or lecture
* Track student attempts and scores
* Scalable for objective evaluation

### 💬 Course Community Chat

* Course‑specific discussion channels
* Real‑time messaging via WebSockets
* Upvote‑based message relevance and moderation

### 🤖 AI Course Tutor

* Course‑aware AI assistant that answers doubts using lecture context
* Embedding‑based retrieval from course materials
* Independent chat history per student
* Pluggable to local LLMs (e.g., Ollama) or API models

### 👀 Attention Engine (Optional)

* Computer vision–based attention analysis microservice
* Processes image frames via API and returns head/gaze/face confidence scores
* Integrates with live lectures to estimate student attentiveness

---

## 🏗️ High‑Level Architecture

**Frontend**

* React (Vite)
* Tailwind CSS
* Redux Toolkit
* Axios

**Backend**

* Node.js + Express
* MongoDB (Mongoose)
* Socket.IO for realtime chat
* RESTful APIs

**AI Layer**

* PDF text extraction
* Embedding storage (MongoDB)
* Contextual response generation
* Supports pluggable LLM backends

**Attention Engine**

* Python + Flask
* OpenCV + MediaPipe
* Deployed as a separate microservice

---

## 📦 Tech Stack Summary

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Frontend  | React, Vite, Tailwind, Redux |
| Backend   | Node.js, Express, Socket.IO  |
| Database  | MongoDB (Mongoose)           |
| Realtime  | Socket.IO                    |
| AI        | Embeddings + LLM (pluggable) |
| CV Engine | Flask, OpenCV, MediaPipe     |

---

## ⚙️ Installation (Local Setup)

> Tested locally for development. Adjust ports and environment variables for production deployments.

### 1. Clone the repository

```bash
git clone https://github.com/Prasoon52/lms-by-tle-terminator.git
cd lms-by-tle-terminator
```

### 2. Backend setup

```bash
cd backend
npm install
npm run dev
```

> backend typically runs on a port like `5000` or `5001` depending on configuration.

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

> frontend dev server typically runs on `localhost:3000` or as specified by Vite.

### 4. (Optional) Attention Engine

```bash
cd Attention_Engine
python3 -m venv venv
source venv/bin/activate

cd ../attention_engine
pip install -r requirements.txt
python app.py
```

> Attention Engine runs as a separate microservice (Flask). Configure frontend/backend to call the attention API endpoint when enabled.

---

## 🔐 Environment Variables

Create `.env` files for backend and microservices as required.

Example `.env` keys (backend):

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CLOUDINARY_CLOUD_NAME=xxxx
ATTENTION_ENGINE_URL=http://localhost:7001
```

**Do not commit `.env` files or secrets to version control.**

---

## 📈 Scalability & Extensibility

* Microservice‑friendly architecture — AI layer and Attention Engine scale independently
* Designed to support thousands of users and multiple institutions
* Suitable for state/district‑level deployments with additional engineering for multi‑tenant isolation, monitoring, and autoscaling

---

## 🏆 Hackathon Readiness

This project demonstrates:

* Real‑world problem solving
* Full‑stack engineering & integrations
* Practical AI usage (embeddings + contextual retrieval)
* Scalable system design with a clear path to production

---

## 👥 Team

Built by **TLE Terminator** — focused on impact, usability, and system‑level thinking.

---

## 📌 Future Enhancements

* Teacher analytics dashboard (engagement, completion, performance)
* Offline‑first mobile app
* Parent & mentor views
* Automated attendance & engagement insights
* Integration with government education systems

---

## 🧾 Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add ..."`)
4. Push and open a pull request

Please follow the existing code style (ESLint/Prettier if configured) and include meaningful commit messages.

---

## 📄 License

This project is intended for educational and hackathon use. Add an appropriate open source license (e.g., MIT) in the `LICENSE` file if you plan to publish or share publicly.

---

## ✅ Contact

For questions or support, open an issue in the repository or contact the project maintainers on the repo.

---

*Generated README for the LMS by TLE Terminator — tailored for hackathons, prototyping, and early production testing.*
