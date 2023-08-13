# services/sentiment_analysis.py

import json
from fastapi import Depends
from fastapi_plugins import depends_redis
import aioredis
from transformers import pipeline


sentiment_classifier = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions", tokenizer="SamLowe/roberta-base-go_emotions", return_all_scores=True)

async def analyze_sentiment(text: str, redis: aioredis.Redis = Depends(depends_redis)):
    # Check if the result is already in the cache
    cached_result = await redis.get(text)
    if cached_result:
        return json.loads(cached_result)
    
    # If not in cache, compute the sentiment analysis
    result = sentiment_classifier(text)[0]
    
    # Cache the result for future use (set an expiry time of 1 hour for example)
    await redis.set(text, json.dumps(result))
    await redis.expire(text, 3600)  # Set the expiration time here
    
    return result
