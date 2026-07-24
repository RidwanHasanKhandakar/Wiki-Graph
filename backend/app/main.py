from datetime import datetime, timezone
import os
from typing import Dict, Generator

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "wiki_graph.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ArticleModel(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ConnectionModel(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False)
    source_article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    target_article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


Base.metadata.create_all(bind=engine)

app = FastAPI(title="WikiGraph API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/articles/track")
def track_article(payload: Dict[str, str], db: Session = Depends(get_db)) -> Dict[str, object]:
    session_id = payload.get("sessionId") or "default"
    title = payload.get("title") or "Untitled"
    url = payload.get("url") or ""

    session = db.get(SessionModel, session_id)
    if session is None:
        session = SessionModel(id=session_id, name=session_id)
        db.add(session)

    previous_article = (
        db.query(ArticleModel)
        .filter(ArticleModel.session_id == session_id)
        .order_by(ArticleModel.created_at.desc())
        .first()
    )

    article = ArticleModel(session_id=session_id, title=title, url=url)
    db.add(article)
    db.flush()

    if previous_article is not None and previous_article.id != article.id:
        connection = ConnectionModel(
            session_id=session_id,
            source_article_id=previous_article.id,
            target_article_id=article.id,
        )
        db.add(connection)

    db.commit()
    db.refresh(article)

    return {
        "id": article.id,
        "title": article.title,
        "url": article.url,
        "session_id": session_id,
    }


@app.get("/api/graph")
def get_graph(session_id: str = Query(default="default"), db: Session = Depends(get_db)) -> Dict[str, object]:
    session = db.get(SessionModel, session_id)
    if session is None:
        session = SessionModel(id=session_id, name=session_id)
        db.add(session)
        db.commit()

    articles = (
        db.query(ArticleModel)
        .filter(ArticleModel.session_id == session_id)
        .order_by(ArticleModel.created_at.asc())
        .all()
    )
    connections = (
        db.query(ConnectionModel)
        .filter(ConnectionModel.session_id == session_id)
        .order_by(ConnectionModel.created_at.asc())
        .all()
    )

    nodes = [
        {
            "id": article.id,
            "label": article.title,
            "url": article.url,
        }
        for article in articles
    ]
    edges = [
        {
            "source": connection.source_article_id,
            "target": connection.target_article_id,
        }
        for connection in connections
    ]

    return {
        "session_id": session_id,
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "articles": len(nodes),
            "connections": len(edges),
        },
    }


@app.get("/api/sessions")
def list_sessions(db: Session = Depends(get_db)) -> Dict[str, object]:
    sessions = db.query(SessionModel).order_by(SessionModel.created_at.asc()).all()
    return {
        "sessions": [
            {
                "id": session.id,
                "name": session.name,
            }
            for session in sessions
        ]
    }
