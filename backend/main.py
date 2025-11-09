import os
import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

from database import init_db, Quiz, get_db
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_payload

# --- Load environment variables and initialize DB ---
load_dotenv()
init_db()

# --- Logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# --- FastAPI app ---
app = FastAPI(title="AI Wiki Quiz Generator", version="1.0.0")

# --- CORS setup ---
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request model ---
class GenerateRequest(BaseModel):
    url: HttpUrl
    force: bool = False


class QuizSubmitRequest(BaseModel):
    quiz_id: int
    answers: dict  # {question_index: "A"/"B"/"C"/"D"}


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


@app.post("/generate_quiz")
async def generate_quiz(body: GenerateRequest):
    url_str = str(body.url)

    logging.info(f"Received quiz generation request for URL: {url_str} (force={body.force})")

    # --- Database session ---
    with get_db() as session:
        existing = session.query(Quiz).filter(Quiz.url == url_str).one_or_none()

        # Return cached quiz if exists and not forced
        if existing and not body.force:
            logging.info(f"Returning cached quiz for URL: {url_str}")
            payload = json.loads(existing.full_quiz_data)
            payload["id"] = existing.id  # Ensure ID is set
            return payload

        # --- Scrape Wikipedia article ---
        try:
            title, summary, body_text, raw_html, sections, section_text_map = await run_in_threadpool(
            scrape_wikipedia, url_str
        )
            logging.info(f"Scraped article: {title}, sections found: {len(sections)}")
        except Exception as e:
            logging.error(f"Scrape failed: {e}")
            raise HTTPException(status_code=400, detail=f"Scrape failed: {e}")

        if not body_text:
            raise HTTPException(status_code=422, detail="Could not extract article body text.")

        # --- Generate quiz via LLM ---
        try:
            payload = await run_in_threadpool(generate_quiz_payload, url_str, title, summary, body_text, sections, section_text_map)
            logging.info(f"Generated quiz payload for: {title}")
        except Exception as e:
            logging.error(f"LLM generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")

        # --- Ensure sections from scraper are preserved ---
        payload["sections"] = sections if sections else payload.get("sections", [])

        # --- Save to DB ---
        data_str = json.dumps(payload, ensure_ascii=False)
        if existing:
            existing.title = title
            existing.scraped_content = body_text
            existing.raw_html = raw_html
            existing.section_text_map = json.dumps(section_text_map, ensure_ascii=False)
            existing.full_quiz_data = data_str
            session.add(existing)
            session.commit()
            payload["id"] = existing.id
            logging.info(f"Updated existing quiz in DB with ID: {existing.id}")
        else:
            rec = Quiz(
                url=url_str,
                title=title,
                scraped_content=body_text,
                raw_html=raw_html,
                section_text_map=json.dumps(section_text_map, ensure_ascii=False),
                full_quiz_data=data_str
            )
            session.add(rec)
            session.commit()
            payload["id"] = rec.id
            logging.info(f"Saved new quiz in DB with ID: {rec.id}")

        return payload

@app.post("/submit_quiz")
def submit_quiz(data: QuizSubmitRequest):
    with get_db() as session:
        quiz_record = session.get(Quiz, data.quiz_id)
        if not quiz_record:
            raise HTTPException(status_code=404, detail="Quiz not found")

        quiz_data = json.loads(quiz_record.full_quiz_data)
        questions = quiz_data.get("quiz", [])

        results = []
        score = 0
        for idx, q in enumerate(questions):
            user_answer = data.answers.get(str(idx))
            correct = (user_answer == q.get("answer"))
            if correct:
                score += 1
            results.append({
                "question_id": idx,
                "question": q.get("question"),
                "your_answer": user_answer,
                "correct_answer": q.get("answer"),
                "correct": correct
            })

        return {
            "quiz_id": data.quiz_id,
            "score": score,
            "total": len(questions),
            "results": results
        }

@app.get("/history")
def history():
    with get_db() as session:
        rows = session.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        return [
            {
                "id": r.id,
                "url": r.url,
                "title": r.title,
                "date_generated": r.date_generated.isoformat(),
            }
            for r in rows
        ]


@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    with get_db() as session:
        r = session.get(Quiz, quiz_id)
        if not r:
            raise HTTPException(status_code=404, detail="Quiz not found")
        payload = json.loads(r.full_quiz_data)
        payload["id"] = r.id  # Ensure ID is always set
        return payload


