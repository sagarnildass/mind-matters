# backend/app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# app/core/database_listener.py
import asyncio
import asyncpg
from asyncpg import Connection
from typing import Callable


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:arteluser@mental-health.ces9ae0qravd.ap-south-1.rds.amazonaws.com/mental-health"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def db_listener(event_callback: Callable):
    conn: Connection = await asyncpg.connect(SQLALCHEMY_DATABASE_URL)
    try:
        while True:
            await asyncio.sleep(1)  # sleep forever, DB notifications will interrupt
    except asyncio.CancelledError:
        await conn.close()