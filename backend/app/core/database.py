# backend/app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# app/core/database_listener.py
import asyncio
import asyncpg
from asyncpg import Connection
from typing import Callable
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Construct the database URL from environment variables
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")


SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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