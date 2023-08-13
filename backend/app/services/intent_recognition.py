# services/intent_recognition.py


import json
from fastapi import Depends
from fastapi_plugins import depends_redis
import aioredis
from transformers import pipeline


intent_classifier = pipeline("text2text-generation", model="mrm8488/t5-base-finetuned-e2m-intent")

async def analyze_intent(text: str, redis: aioredis.Redis = Depends(depends_redis)):
    # Check if the result is already in the cache
    cached_result = await redis.get(f"intent:{text}")
    if cached_result:
        return json.loads(cached_result)
    
    # If not in cache, compute the intent recognition
    result = intent_classifier(text)[0]
    
    # Cache the result for future use (set an expiry time of 1 hour for example)
    await redis.set(f"intent:{text}", json.dumps(result))
    await redis.expire(f"intent:{text}", 3600)  # Set the expiration time here
    
    return result
