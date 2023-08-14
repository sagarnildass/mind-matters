from fastapi import FastAPI, APIRouter, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi_plugins import redis_plugin
from fastapi_plugins import depends_redis
import aioredis
import fastapi_plugins
import numpy as np
from app.core.database import get_db
from app.core.models import Session as DBSession, ChatLog, AIInteraction
from app.api.models.model import SessionCreate, ChatLogCreate
from app.services.chat import initiate_chat
from app.api.routes import auth
from app.core.database import Base, engine, db_listener
from app.services.sentiment_analysis import analyze_sentiment
from app.services.intent_recognition import analyze_intent
from app.services.suicide_predictor import analyze_suicide_sentiment
from app.services.chatbot_service import get_response
from app.services.emotion_analysis import capture_emotion
from app.services import sentiment_analysis, intent_recognition, suicide_predictor

# from app.api.routes import chat  # Add this import at the top

import logging
from queue import Queue
import threading
import json
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=5)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Configure log format
log_format = {
    "timestamp": "%(asctime)s",
    "level": "%(levelname)s",
    "message": "%(message)s",
    "module": "%(module)s",
    "function": "%(funcName)s",
    "line_number": "%(lineno)d",
    "logger_name": "%(name)s",
}

formatter = logging.Formatter(json.dumps(log_format))

# Create a handler and set the formatter
handler = logging.StreamHandler()
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)


app = FastAPI()

class AppSettings(fastapi_plugins.RedisSettings):
    api_name: str = "Mental Health"

config = AppSettings()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,  # Add this if it's missing
    expose_headers=["*"]  # Add this if it's missing
)

# Redis Configuration
app.config = dict(
    REDIS_URL="redis://localhost:6379"
)

stop_thread = threading.Event()


@app.on_event("startup")
async def startup_event():
    # Any other startup tasks can be added here.
    sentiment_analysis.sentiment_classifier  # Just referencing it to ensure it's loaded. It's already loaded at module level.
    intent_recognition.intent_classifier  # Just referencing it to ensure it's loaded. It's already loaded at module level.
    suicide_predictor.suicide_classifier
    
    # DeepFace Initialization
    # initialize_deepface()
    await fastapi_plugins.redis_plugin.init_app(app, config=config)
    await fastapi_plugins.redis_plugin.init()

@app.on_event("shutdown")
async def on_shutdown() -> None:
    await redis_plugin.terminate()



@app.websocket("/chat/{user_id}")
async def start_chat(websocket: WebSocket, user_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), redis: aioredis.Redis = Depends(depends_redis)):
    await websocket.accept()
    session_data, ws_session_data, chat_log_data = await initiate_chat(user_id, db)
    await websocket.send_text("Chat session started!")

    emotion_queue = Queue()
    emotion_lock = threading.Lock()
    def send_emotions():
        nonlocal emotion_queue
        for emotions in capture_emotion(stop_thread):  # Pass the stop_thread event
            with emotion_lock:
                emotion_queue.put(emotions)
    # Start the function in a separate thread
    thread = threading.Thread(target=send_emotions)
    thread.start()

    stop_thread.clear()  # Reset the event for a new connection


    try:
        while True:
            data = await websocket.receive_text()
            
            start_time_sentiment = datetime.now()
            sentiment_result = await analyze_sentiment(data, redis)
            #print(sentiment_result)
            end_time_sentiment = datetime.now()

            # Extract the sentiment with the highest score
            top_sentiment = max(sentiment_result, key=lambda x: x['score'])


            start_time_intent = datetime.now()
            intent_result = await analyze_intent(data, redis)
            end_time_intent = datetime.now()

            intent_label = intent_result['generated_text']

            start_time_suicidal = datetime.now()
            suicidal_result = await analyze_suicide_sentiment(data, redis)
            logger.info('Suicidal result')
            logger.info(suicidal_result)
            end_time_suicidal = datetime.now()

            suicide_label = suicidal_result['label']
            emotion_data = None
            if not emotion_queue.empty():
                emotion_data = emotion_queue.get()

            # Generate chatbot response
            chatbot_response = get_response(user_id, data, db, top_sentiment['label'], suicide_label, emotion_data)
            
            
            # Send the generated response back to the user
            await websocket.send_text(f"Chatbot: {chatbot_response}")

            # Store the sentiment result in the ChatLog model or wherever appropriate
            chat_log = ChatLog(session_id=session_data.session_id, direction="user", content=data, sentiment=str(sentiment_result), topic=str(intent_result), is_suicidal=str(suicide_label))
            db.add(chat_log)
            db.commit()

            # Insert chatbot response into database
            chatbot_log = ChatLog(session_id=session_data.session_id, direction="ai", content=chatbot_response, sentiment=None, topic=None, is_suicidal=None)
            db.add(chatbot_log)
            db.commit()

            # Log AI interactions for sentiment analysis
            ai_interaction_sentiment = AIInteraction(
                log_id=chat_log.log_id,
                model_used="sentiment_analysis",
                response_time=(end_time_sentiment - start_time_sentiment).total_seconds(),
                confidence_score=top_sentiment['score'],
                prediction=top_sentiment['label']  # Add this line
            )
            db.add(ai_interaction_sentiment)

            # Log AI interactions for intent recognition
            ai_interaction_intent = AIInteraction(
                log_id=chat_log.log_id,
                model_used="intent_recognition",
                response_time=(end_time_intent - start_time_intent).total_seconds(),
                prediction=intent_label  # Add this line
            )
            db.add(ai_interaction_intent)

            db.commit()

            ai_interaction_suicide = AIInteraction(
                log_id=chat_log.log_id,
                model_used="suicide_detection",
                response_time=(end_time_suicidal - start_time_suicidal).total_seconds(),
                confidence_score=suicidal_result['score'],
                prediction=suicide_label  # Add this line
            )
            db.add(ai_interaction_suicide)

            db.commit()


            # Here you can also send back the sentiment result to the user or use it to guide the conversation.
            await websocket.send_text(f"Sentiment: {sentiment_result}")
            await websocket.send_text(f"Intent: {intent_result}")
            await websocket.send_text(f"Suicide: {suicidal_result}")

    except WebSocketDisconnect:
        stop_thread.set()  # Signal the thread to stop
        thread.join()  # Wait for the thread to finish
        ws_session_data.end_time = datetime.now()
        db.commit()


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Your FastAPI app is working correctly"}

# Include API routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
#app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])  

# Create tables in the database
Base.metadata.create_all(bind=engine)