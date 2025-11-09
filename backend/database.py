import os
from datetime import datetime
from sqlalchemy import create_engine, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Mapped, mapped_column
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

# Production-ready engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False,
    future=True  # SQLAlchemy 2.0 style
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Quiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    url: Mapped[str] = mapped_column(String(1000), index=True, unique=True)
    title: Mapped[str] = mapped_column(String(512), index=True)
    date_generated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    scraped_content: Mapped[str | None] = mapped_column(Text)
    raw_html: Mapped[str | None] = mapped_column(Text)
    section_text_map: Mapped[str | None] = mapped_column(Text)
    full_quiz_data: Mapped[str] = mapped_column(Text)

    def __repr__(self):
        return f"<Quiz(id={self.id}, title={self.title})>"


def init_db():
    Base.metadata.create_all(engine)


@contextmanager
def get_db():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()







# import os
# from datetime import datetime
# from sqlalchemy import create_engine, Integer, String, DateTime, Text
# from sqlalchemy.orm import declarative_base, sessionmaker, Mapped, mapped_column
# from dotenv import load_dotenv

# # --- Load environment variables ---
# load_dotenv()

# # --- Database URL from .env ---
# DATABASE_URL = os.getenv("DATABASE_URL")
# if not DATABASE_URL:
#     raise RuntimeError("DATABASE_URL is not set in .env.")

# # --- SQLAlchemy setup ---
# engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)
# SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
# Base = declarative_base()

# # --- Quiz model ---
# class Quiz(Base):
#     __tablename__ = "quizzes"

#     id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
#     url: Mapped[str] = mapped_column(String(1000), index=True, unique=True)
#     title: Mapped[str] = mapped_column(String(512), index=True)
#     date_generated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
#     scraped_content: Mapped[str | None] = mapped_column(Text)
#     full_quiz_data: Mapped[str] = mapped_column(Text)

# # --- Initialize database ---
# def init_db():
#     Base.metadata.create_all(engine)
