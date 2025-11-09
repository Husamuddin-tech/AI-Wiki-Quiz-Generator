# AI Wiki Quiz Generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Build: Backend](https://img.shields.io/github/actions/workflow/status/Husamuddin-tech/AI-Wiki-Quiz-Generator/backend.yml?branch=main)](https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator/actions)  
[![Build: Frontend](https://img.shields.io/github/actions/workflow/status/Husamuddin-tech/AI-Wiki-Quiz-Generator/frontend.yml?branch=main)](https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator/actions)  

## 🚀 Project Overview  
The **AI Wiki Quiz Generator** enables automatic quiz creation from Wikipedia-style content using AI-driven processing.  
It consists of:  
- A **backend** service for processing content, generating questions and answers, storing quizzes.  
- A **frontend** web interface for users to choose topics, generate quizzes and take them.

## 🎯 Why this matters  
- Makes learning more engaging by turning articles into interactive quizzes.  
- Helps educators and learners rapidly build knowledge‑reinforcement tools.  
- Leverages AI to automate quiz‑generation for dynamic content.

## 📁 Repository Structure  
```
AI‑Wiki‑Quiz‑Generator/
├── backend/
│   ├── venv/                       # Python Virtual Environment
│   ├── database.py                 # SQLAlchemy setup and Quiz model
│   ├── models.py                   # Pydantic Schemas for LLM output (QuizOutput)
│   ├── scraper.py                  # Functions for fetching and cleaning Wikipedia HTML
│   ├── llm_quiz_generator.py       # LangChain setup, prompt templates, and chain logic
│   ├── main.py                     # FastAPI application and API endpoints
│   ├── requirements.txt            # List of all Python dependencies
│   └── .env                        # API keys and environment variables
|
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI parts (e.g., QuizCard, TabButton, Modal)
│   │   │   ├── QuizDisplay.jsx     # Reusable component for rendering generated quiz data
│   │   │   └── HistoryTable.jsx
│   │   ├── services/
│   │   │   └── api.js              # Functions for communicating with the FastAPI backend
│   │   ├── tabs/
│   │   │   ├── GenerateQuizTab.jsx
│   │   │   └── HistoryTab.jsx
│   │   ├── App.jsx                 # Main React component, handles tab switching
│   │   └── index.css               # Tailwind directives and custom styles
│   ├── package.json
|
└── README.md                       # Project Setup, Endpoints, and Testing Instructions

```

## 🛠️ Getting Started  
```bash
git clone https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator.git
cd AI‑Wiki‑Quiz‑Generator
```  
Then follow `backend/` and `frontend/` readme instructions.

## 🤝 Contributing  
See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License  
This project is licensed under the [MIT License](LICENSE).


---

## 📦 Backend Documentation

# Backend – AI Wiki Quiz Generator

[![Build](https://img.shields.io/github/actions/workflow/status/Husamuddin-tech/AI-Wiki-Quiz-Generator/backend.yml?branch=main)](https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator/actions)  
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

## 🧩 What It Does  
Handles fetching Wikipedia content, generating quiz questions, and providing RESTful APIs for frontend use.

## 📦 Tech Stack  
- Language: Python / Node.js  
- Framework: FastAPI / Express  
- Database: PostgreSQL / MongoDB  
- AI Integration: OpenAI / Gemini API

## 🧪 Setup Instructions  
```bash
cd backend
npm install
cp .env.example .env
npm start
```

## 🔍 API Endpoints  
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /quizzes | List all quizzes |
| POST | /quizzes | Create new quiz |
| GET | /quizzes/:id | Fetch quiz |
| POST | /quizzes/:id/answer | Submit answers |

## 📄 License  
Licensed under MIT.


---

## 💻 Frontend Documentation

# Frontend – AI Wiki Quiz Generator

[![Build](https://img.shields.io/github/actions/workflow/status/Husamuddin-tech/AI-Wiki-Quiz-Generator/frontend.yml?branch=main)](https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator/actions)  
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)

## 🎨 What It Is  
React-based interface allowing users to input topics, generate quizzes, and interactively answer them.

## 🛠 Tech Stack  
- React + Vite / Next.js  
- TailwindCSS / Material UI  
- Backend API integration

## 🚀 Setup  
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing  
```bash
npm test
```

## 📦 Deployment  
```bash
npm run build
```

## 📄 License  
MIT as per root project.
