# services/suicide_predictor.py

import json
from fastapi import Depends
from fastapi_plugins import depends_redis
import aioredis
from transformers import pipeline


suicide_classifier = pipeline("text-classification", model="sagarnildass/suicide_detector_roberta_base")

async def analyze_suicide_sentiment(text: str, redis: aioredis.Redis = Depends(depends_redis)):
    # Check if the result is already in the cache
    cached_result = await redis.get(f"suicide:{text}")
    if cached_result:
        return json.loads(cached_result)
    
    # If not in cache, compute the sentiment analysis
    result = suicide_classifier.predict(text)[0]
    print(result)
    if result["label"] == "LABEL_1":
        result["label"] = "Not Suicidal"
    else:
        result["label"] = "Suicidal"
        
    # Cache the result for future use (set an expiry time of 1 hour for example)
    await redis.set(f"suicide:{text}", json.dumps(result).replace("'", '"'))
    await redis.expire(f"suicide:{text}", 3600)  # Set the expiration time here
    
    return result
