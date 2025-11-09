import os
import re
import requests
from bs4 import BeautifulSoup
from typing import Tuple, List, Dict
from dotenv import load_dotenv

load_dotenv()

USER_AGENT = os.getenv(
    "SCRAPER_USER_AGENT",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)
HEADERS = {"User-Agent": USER_AGENT}
WIKI_MAIN_SELECTOR = "#mw-content-text"
SUMMARY_PARAGRAPHS = 2  # Number of paragraphs to include in summary


def clean_text(text: str) -> str:
    """Clean whitespace and remove reference tags like [1], [2]."""
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def scrape_wikipedia(url: str) -> Tuple[str, str, str, str, List[str], Dict[str, str]]:
    """
    Scrape a Wikipedia article and return:
    - title
    - summary
    - full body text
    - raw HTML
    - sections (list)
    - section_text_map: {section_name: section_text}
    """
    if not url.startswith("http"):
        raise ValueError("Invalid URL")

    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    title_tag = soup.find(id="firstHeading")
    title = title_tag.get_text(strip=True) if title_tag else "Untitled"

    # --- Summary ---
    summary_parts = []
    for p in soup.select("#mw-content-text .mw-parser-output > p"):
        if p.find_parent(class_="infobox"):
            continue
        txt = p.get_text(" ", strip=True)
        if txt:
            summary_parts.append(txt)
        if len(summary_parts) >= SUMMARY_PARAGRAPHS:
            break
    summary = clean_text(" ".join(summary_parts))

    # --- Remove unwanted elements ---
    for sel in ["table", "sup", "span.mw-editsection", "style", "script", "figure", ".toc"]:
        for tag in soup.select(sel):
            tag.decompose()

    content_div = soup.select_one(WIKI_MAIN_SELECTOR)
    body_text = clean_text(content_div.get_text(" ", strip=True)) if content_div else ""

    # --- Sections & section_text_map ---
    sections = []
    section_text_map = {}
    current_section = "Introduction"
    section_text_map[current_section] = ""

    if content_div:
        for elem in content_div.children:
            if elem.name in ["h2", "h3"]:
                headline = elem.select_one(".mw-headline")
                if headline:
                    current_section = headline.get_text(strip=True)
                    if current_section not in ["References", "See also"]:
                        sections.append(current_section)
                        section_text_map[current_section] = ""
            elif elem.name == "p" and current_section:
                section_text_map[current_section] += clean_text(elem.get_text(" ", strip=True)) + " "

    raw_html = str(soup)
    return title, summary, body_text, raw_html, sections, section_text_map








# import os
# import re
# import requests
# from bs4 import BeautifulSoup
# from typing import Tuple
# from dotenv import load_dotenv

# load_dotenv()

# # --- Optional: load user-agent from .env ---
# USER_AGENT = os.getenv(
#     "SCRAPER_USER_AGENT",
#     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
#     "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
# )

# HEADERS = {"User-Agent": USER_AGENT}

# WIKI_MAIN_SELECTOR = "#mw-content-text"

# # --- Helper function to clean text ---
# def clean_text(text: str) -> str:
#     text = re.sub(r"\s+", " ", text)
#     text = re.sub(r"\[\d+\]", "", text)
#     return text.strip()

# # --- Main scraping function ---
# def scrape_wikipedia(url: str) -> Tuple[str, str, str]:
#     if not url.startswith("http"):
#         raise ValueError("Invalid URL")

#     resp = requests.get(url, headers=HEADERS, timeout=20)
#     resp.raise_for_status()

#     soup = BeautifulSoup(resp.text, "html.parser")

#     # Title
#     title_tag = soup.find(id="firstHeading")
#     title = title_tag.get_text(strip=True) if title_tag else "Untitled"

#     # Summary (first 2 paragraphs, skip infobox)
#     summary_parts = []
#     for p in soup.select("#mw-content-text .mw-parser-output > p"):
#         if p.find_parent(class_="infobox"):
#             continue
#         txt = p.get_text(" ", strip=True)
#         if txt:
#             summary_parts.append(txt)
#         if len(summary_parts) >= 2:
#             break
#     summary = clean_text(" ".join(summary_parts))

#     # Remove unwanted elements
#     for sel in ["table", "sup", "span.mw-editsection", "style", "script", "figure", ".toc"]:
#         for tag in soup.select(sel):
#             tag.decompose()

#     # Body text
#     content_div = soup.select_one(WIKI_MAIN_SELECTOR)
#     body_text = clean_text(content_div.get_text(" ", strip=True)) if content_div else ""

#     return title, summary, body_text
