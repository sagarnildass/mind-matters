from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import openai
import pinecone
from typing import List
from app.core.database import get_db
from app.core.authentication import get_current_user
from app.core.models import ChatLog, ContentMetadata, RecentChatSummary
import os
from dotenv import load_dotenv, find_dotenv


def get_env_data_as_dict(path: str) -> dict:
    with open(path, 'r') as f:
       return dict(tuple(line.replace('\n', '').split('=')) for line
                in f.readlines() if not line.startswith('#'))

load_dotenv(find_dotenv())

# OPENAI_API_KEY = "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"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")


openai.api_key = OPENAI_API_KEY
pinecone.init(      
	# api_key="b05736e9-8819-4b51-b019-af78e951aecf",   
    api_key=PINECONE_API_KEY,   
	environment='us-west1-gcp'      
)      
index = pinecone.Index(index_name='openai')

router = APIRouter()

def get_user_profile_text(user_id, db: Session, N=50):
    chat_history = db.query(RecentChatSummary).filter(RecentChatSummary.user_id == user_id).order_by(
        RecentChatSummary.start_time.desc()).limit(N).all()
    profile_text = " ".join([log.content for log in chat_history])
    return profile_text

def get_profile_embedding(profile_text):
    embedded_query = openai.Embedding.create(
        input=profile_text,
        model='text-embedding-ada-002',
    )["data"][0]['embedding']
    return embedded_query

def query_articles_with_profile_embedding(embedded_query, db: Session, top_k=10):
    query_result = index.query(embedded_query, top_k=top_k)
    if not query_result.matches:
        return None

    matches = query_result.matches
    ids = [res.id for res in matches]

    # Fetch content metadata using the retrieved ids
    fetched_data = db.query(ContentMetadata).filter(ContentMetadata.id.in_(ids)).all()

    return fetched_data

@router.get("/get_recommendations")
def recommend_articles_based_on_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Step 1
    profile_text = get_user_profile_text(user.user_id, db)
    
    # Step 2
    embedded_query = get_profile_embedding(profile_text)
    
    # Step 3
    articles = query_articles_with_profile_embedding(embedded_query, db)
    
    return articles  # Step 4 would involve displaying these articles to the user

