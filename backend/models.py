from typing import List, Optional
from pydantic import BaseModel, Field
from typing import Literal


class KeyEntities(BaseModel):
    people: List[str] = []
    organizations: List[str] = []
    locations: List[str] = []


class QuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(..., min_items=4, max_items=4)
    answer: str
    difficulty: Literal['easy', 'medium', 'hard']
    explanation: str


class QuizOutput(BaseModel):
    id: Optional[int] = None
    url: str
    title: str
    summary: str
    key_entities: KeyEntities
    sections: List[str]
    quiz: List[QuizQuestion] = Field(..., min_items=5, max_items=10)
    related_topics: List[str] = Field(..., min_items=3)

