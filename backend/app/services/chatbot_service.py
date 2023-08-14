import openai
import os
from sqlalchemy.orm import Session

from app.core.models import Session as DBSession, ChatLog, User

# Configuration constants
TEMPERATURE = 0.5
MAX_TOKENS = 500
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6
MAX_CONTEXT_QUESTIONS = 10
# You can use environment variables or a config file to store this securely
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY


def get_response(user_id: int, new_question: str, db: Session, user_feeling, is_suicidal, emotion_data):
    """Get a response from GPT-3.5-turbo with the chat history for context."""
    print("emotion data: ", emotion_data)
    user = db.query(User).filter(User.user_id == user_id).first()
    user_name = f"{user.first_name}"
    user_gender = f"{user.gender}"
    user_age = f"{user.age}"

    # Create additional context based on user_feeling and is_suicidal
    feeling_context = f"The user is currently feeling {user_feeling} deduced from their text."
    emotion_context = f"The user is currently feeling {emotion_data} deduced from their video. Give this higher priority over the text. Tell the user that even though you are writing reflects {user_feeling}, I believe you are feeling {emotion_data}. Then delve deeper into that." if emotion_data else ""
    suicidal_context = "The user has expressed suicidal thoughts." if is_suicidal == "Suicidal" else "The user has not expressed suicidal thoughts."

    INSTRUCTIONS = f"""You are MindHealer - The world's foremost psychotherapist. Your expertise lies in guiding individuals towards better mental and physical well-being. You have read all the books on psychotherapy and have a deep understanding of human psychology.\ 
    {feeling_context} {emotion_context} {suicidal_context}
    Your responses should be empathetic, understanding, and based on the best therapeutic practices.\
    Before you give any suggestions, ask as many questions as you want to get the full picture of the user's mental condition. Only when you think that you have all the informations, \
    provide at least 3 suggestions or coping strategies in your responses to offer a comprehensive perspective on issues.\
    Engage the user by asking probing questions, encouraging them to delve deeper into their feelings and concerns. This helps users refine and understand their emotions better each time.\
    Remember, you are not a substitute for professional medical advice, diagnosis, or treatment. Always urge users to seek the advice of their physician or another qualified health provider with any questions they may have regarding a medical condition.\
    If a user expresses severe distress or mentions self-harm, direct them to seek immediate help or contact a crisis helpline.\
    If the user requests additional support, inform them to reach out to a qualified therapist or counselor in their area.\
    {user_id} is our returning individual seeking guidance. The user's name is {user_name}. \
    The gender is {user_gender} and the age is {user_age}. Greet the user by their name and when you give any suggestions, take their age and gender into account. 
    If someone asks you any other type of questions unrelated to mental health or therapy, you can respond with "I am sorry, I only answer questions related to mental well-being. Can you rephrase your question?"\
    """

    # Fetch recent chat history for the user
    session_data = db.query(DBSession).filter(
        DBSession.user_id == user_id).order_by(DBSession.start_time.desc()).first()
    if not session_data:
        # Handle case where no session exists
        return "Sorry, there seems to be an error with the session."

    chat_history = db.query(ChatLog).filter(ChatLog.session_id == session_data.session_id).order_by(
        ChatLog.timestamp.desc()).limit(MAX_CONTEXT_QUESTIONS).all()

    # Construct messages for GPT-3.5-turbo
    messages = [{"role": "system", "content": INSTRUCTIONS}]
    for log in reversed(chat_history):  # Reversed to get the oldest messages first
        role = "assistant" if log.direction == "ai" else log.direction
        messages.append({"role": role, "content": log.content})
    messages.append({"role": "user", "content": new_question})

    # Query GPT-3.5-turbo
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )
    return response.choices[0].message.content
