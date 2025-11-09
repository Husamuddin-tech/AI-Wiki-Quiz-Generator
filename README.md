# AI Wiki Quiz Generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-lightblue?logo=fastapi)](https://fastapi.tiangolo.com/) [![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.4-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![BeautifulSoup](https://img.shields.io/badge/BeautifulSoup-4.12.2-orange?logo=python&logoColor=white)](https://www.crummy.com/software/BeautifulSoup/) [![LangChain](https://img.shields.io/badge/LangChain-0.1.0-purple)](https://www.langchain.com/) [![Gemini LLM](https://img.shields.io/badge/Gemini-LLM-green)](https://developers.generativeai.google/)

---

## 🚀 Project Overview

**AI Wiki Quiz Generator** is a full-stack application that converts Wikipedia articles into structured quizzes using AI.  

- Backend: Python (FastAPI) + LangChain + Gemini API  
- Frontend: React + TailwindCSS  
- Database: PostgreSQL / MySQL  
- Features:
  - Generates 5–10 questions per Wikipedia article
  - Stores history of quizzes
  - Interactive "Take Quiz" mode with scoring
  - Responsive UI with Generate Quiz & History tabs  

---

## 🧩 Workflow Diagram

```mermaid
flowchart TD
    A["User enters Wikipedia URL"] --> B["Backend Scraper"]
    B --> C["Clean & Extract Article Text"]
    C --> D["Gemini LLM via LangChain"]
    D --> E["Generate Quiz JSON with Questions, Options, Answers, Explanation, Difficulty"]
    E --> F["Store Quiz in Database (PostgreSQL or MySQL)"]
    F --> G["Frontend displays Quiz"]
    G --> H["User can Take Quiz and Submit Answers"]
    G --> I["History Tab displays Past Quizzes"]
    I --> J["Click Details → Modal shows full quiz using QuizDisplay Component"]

```

---

## 📁 Project Structure

```
AI-Wiki-Quiz-Generator/
├── backend/
│   ├── venv/
│   ├── database.py
│   ├── models.py
│   ├── scraper.py
│   ├── llm_quiz_generator.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuizDisplay.jsx
│   │   │   ├── HistoryTable.jsx
│   │   │   └── Modal.jsx
│   │   ├── services/api.js
│   │   ├── tabs/GenerateQuizTab.jsx
│   │   ├── tabs/HistoryTab.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
└── README.md
```

---

## 🛠️ Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
DATABASE_URL=postgresql+psycopg2://exampleuser:examplepassword@localhost/examledb
```

Run server:

```bash
uvicorn main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Access app at `http://localhost:5173`.

---

## 🔍 API Endpoints

| Method | Endpoint                  | Description                            |
|--------|---------------------------|----------------------------------------|
| GET    | `/history`                | List all generated quizzes             |
| POST   | `/generate_quiz`          | Generate a new quiz from URL           |
| GET    | `/quiz/{quiz_id}`         | Fetch a specific quiz by ID            |
| POST   | `/quiz/{quiz_id}/answer`  | Submit answers & get scoring           |

---

## 📄 Sample API Output

```json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "title": "Alan Turing",
  "summary": "Alan Turing was a British mathematician and computer scientist...",
  "sections": ["Early life", "World War II", "Legacy"],
  "quiz": [
    {
      "question": "Where did Alan Turing study?",
      "options": ["Harvard University","Cambridge University","Oxford University","Princeton University"],
      "answer": "Cambridge University",
      "difficulty": "easy",
      "explanation": "Mentioned in the 'Early life' section."
    }
  ],
  "related_topics": ["Cryptography", "Enigma machine", "Computer science history"]
}
```

---

## 💻 Frontend Tabs

### TAB 1 – Generate Quiz
- Enter Wikipedia URL → Generate Quiz → Display structured quiz + related topics  

### TAB 2 – History
- Displays table of past quizzes  
- "Details" button → Modal with full quiz  
- "Take Quiz" mode available  

---

## 🎥 Live Demo / Screenshots

Include GIFs or images showing:  
1. Generating a quiz (Tab 1)  
2. Viewing history table (Tab 2)  
3. Opening details modal  

Example Markdown for image/GIF embedding:


![Home Page](screenshots/home.png)
![Generate Quiz](screenshots/quiz.png)
![Quiz Answers](screenshots/answers.png)
![History Tab](screenshots/history.png)
![Quiz Details](screenshots/quiz_details.png)



![Demo](screenshots/demo.mp4)


---

## ⚡ Technical Stack

| Layer       | Technology                  |
|------------|-----------------------------|
| Backend     | Python, FastAPI, SQLAlchemy |
| Database    | PostgreSQL / MySQL          |
| Frontend    | React, TailwindCSS          |
| AI / LLM    | Gemini via LangChain        |
| Scraping    | BeautifulSoup, Requests     |

---

## 🧪 Testing

- **Backend:** Postman or curl  
- **Frontend:** 

```bash
npm test
```

- Verify quiz generation, history listing, and modal functionality.

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

## 🔗 GitHub Repository

[https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator](https://github.com/Husamuddin-tech/AI-Wiki-Quiz-Generator)
