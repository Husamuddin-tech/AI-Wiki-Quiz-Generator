import os
import json
from typing import Dict, Any, Optional
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from models import QuizOutput
import logging
import time

load_dotenv()

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set in .env")

MAX_CHARS = int(os.getenv("ARTICLE_CHARS_LIMIT", 18000))

parser = JsonOutputParser(pydantic_object=QuizOutput)

PROMPT_TEMPLATE = """
You are an assistant that generates a fact-checked multiple-choice quiz from a Wikipedia article.
Follow ALL rules:
1) Base everything ONLY on the provided article text.
2) Create 5–10 MCQs with exactly four options each.
3) Vary difficulty across easy/medium/hard, keep explanations short, cite the source.
4) Generate questions **per section**, include "section" key for each question.
5) Extract key entities (people, organizations, locations), list top-level sections, summary.
6) Suggest 3–8 related Wikipedia topics.
7) Output MUST be valid JSON matching this schema:
{format_instructions}

ARTICLE_TITLE: {title}
ARTICLE_URL: {url}
ARTICLE_SUMMARY: {summary}
ARTICLE_SECTIONS: {sections}
SECTION_TEXTS: {section_texts}  # Map of section_name -> section text
ARTICLE_TEXT (truncated if very long):
"""

def build_chain() -> Any:
    llm = ChatGoogleGenerativeAI(model=MODEL_NAME, api_key=API_KEY, temperature=0.2)
    prompt = PromptTemplate(
        template=PROMPT_TEMPLATE + "{article_text}",
        input_variables=["title", "url", "summary", "sections", "section_texts", "article_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    return prompt | llm | parser


def generate_quiz_payload(
    url: str,
    title: str,
    summary: str,
    body_text: str,
    sections: list[str] = [],
    section_text_map: Optional[Dict[str, str]] = None,
    retries: int = 3,
    delay: int = 2
) -> Dict:
    """
    Generate quiz payload using LLM with retries and entity limits.
    """
    article_text = (summary + "\n\n" + body_text)[:MAX_CHARS]
    chain = build_chain()
    # Ensure we have a mapping of section -> text; default to empty strings for provided sections
    section_text_map = section_text_map or ({s: "" for s in sections} if sections else {})
    for attempt in range(1, retries + 1):
        try:
            payload = chain.invoke({
                "title": title,
                "url": url,
                "summary": summary,
                "sections": ", ".join(sections) if sections else "",
                "section_texts": json.dumps(section_text_map, ensure_ascii=False),
                "article_text": article_text,
            })

            # Limit entities to top 10 each
            if "key_entities" in payload:
                for key in ["people", "organizations", "locations"]:
                    payload["key_entities"][key] = payload["key_entities"].get(key, [])[:10]
            else:
                payload["key_entities"] = {"people": [], "organizations": [], "locations": []}


            # Ensure sections from scraper are preserved
            payload["sections"] = sections if sections else payload.get("sections", [])

            # Limit related topics to 8
            related = payload.get("related_topics", [])
            payload["related_topics"] = related[:8] if isinstance(related, list) else []

            payload["id"] = None
            
            return payload
        except Exception as e:
            logging.warning(f"LLM generation attempt {attempt} failed: {e}")
            if attempt == retries:
                raise
            time.sleep(delay)








# import os
# from typing import Dict, Any
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import JsonOutputParser
# from langchain_google_genai import ChatGoogleGenerativeAI
# from dotenv import load_dotenv
# from models import QuizOutput

# # --- Load environment variables ---
# load_dotenv()

# # --- LLM and API setup ---
# MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
# API_KEY = os.getenv("GOOGLE_API_KEY")

# if not API_KEY:
#     raise RuntimeError("GOOGLE_API_KEY not set in .env")

# llm = ChatGoogleGenerativeAI(model=MODEL_NAME, api_key=API_KEY, temperature=0.2)

# # --- Output parser ---
# parser = JsonOutputParser(pydantic_object=QuizOutput)

# # --- Prompt template ---
# PROMPT_TEMPLATE = """
# You are an assistant that generates a fact-checked multiple-choice quiz from a Wikipedia article.
# Follow ALL rules:

# 1) Base everything ONLY on the provided article text. If information is missing, say so by excluding it.
# 2) Create 5–10 MCQs with exactly four options each. Label correct answers precisely as they appear in the article.
# 3) Vary difficulty across easy/medium/hard. Keep explanations short and cite which section or paragraph mentions the fact.
# 4) Extract key entities (people, organizations, locations), list top-level sections, and a concise article summary.
# 5) Suggest 3–8 related Wikipedia topics for further reading.
# 6) Output MUST be valid JSON that matches this schema:
# {format_instructions}

# ARTICLE_TITLE: {title}
# ARTICLE_URL: {url}
# ARTICLE_TEXT (truncated if very long):
# """

# # --- Article length limit ---
# MAX_CHARS = int(os.getenv("ARTICLE_CHARS_LIMIT", 18000))

# # --- Build LangChain pipeline ---
# def build_chain() -> Any:
#     prompt = PromptTemplate(
#         template=PROMPT_TEMPLATE + "{article_text}",
#         input_variables=["title", "url", "article_text"],
#         partial_variables={"format_instructions": parser.get_format_instructions()},
#     )
#     return prompt | llm | parser

# chain = build_chain()

# # --- Quiz payload generator ---
# def generate_quiz_payload(
#     url: str,
#     title: str,
#     summary: str,
#     body_text: str
# ) -> Dict:
#     article_text = (summary + "\n\n" + body_text)[:MAX_CHARS]
#     payload = chain.invoke({
#         "title": title,
#         "url": url,
#         "article_text": article_text,
#     })
#     payload["id"] = None
#     return payload
