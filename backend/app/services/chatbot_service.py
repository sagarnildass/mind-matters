# app/services/chatbot_service.py

import openai
import os
from sqlalchemy.orm import Session
import pinecone
from sqlalchemy import case
from dotenv import load_dotenv

from app.core.models import Session as DBSession, ChatLog, User
from app.core.models import ContentMetadata as t_content_metadata

def get_env_data_as_dict(path: str) -> dict:
    with open(path, 'r') as f:
       return dict(tuple(line.replace('\n', '').split('=')) for line
                in f.readlines() if not line.startswith('#'))
    
    
# Configuration constants
TEMPERATURE = 0.7
MAX_TOKENS = 500
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6
MAX_CONTEXT_QUESTIONS = 10
load_dotenv()
# You can use environment variables or a config file to store this securely
OPENAI_API_KEY = "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"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# POST_PROMPT_GUIDANCE = "Don't justify your answers. Don't give information not mentioned in the CONTEXT INFORMATION."

openai.api_key = OPENAI_API_KEY
pinecone.init(      
	api_key="b05736e9-8819-4b51-b019-af78e951aecf",      
	environment='us-west1-gcp'      
)      
index = pinecone.Index(index_name='openai')

def get_response(user_id: int, new_question: str, db: Session, user_feeling, is_suicidal, emotion_data, session_id, blip_response=None):
    """Get a response from GPT-3.5-turbo with the chat history for context."""
    #print("emotion data: ", emotion_data)
    user = db.query(User).filter(User.user_id == user_id).first()
    user_name = f"{user.first_name}"
    user_gender = f"{user.gender}"
    user_age = f"{user.age}"

    # Create additional context based on user_feeling and is_suicidal
    feeling_context = f"The user is currently feeling {user_feeling} deduced from their text."
    emotion_context = f"The user is currently feeling {emotion_data} deduced from their video. Give this higher priority over the text. Tell the user that even though you are writing reflects {user_feeling}, I believe you are feeling {emotion_data}. Then delve deeper into that." if emotion_data else ""
    suicidal_context = "The user has expressed suicidal thoughts." if is_suicidal == "Suicidal" else "The user has not expressed suicidal thoughts."
    print("blip response: ", blip_response)
    print('emotion video: ', emotion_context)
    if blip_response:
        INSTRUCTIONS = f"""You are MindHealer - The world's foremost psychotherapist. Your expertise lies in guiding individuals towards better mental and physical well-being. You have read all the books on psychotherapy and have a deep understanding of human psychology.\ 
        {feeling_context} {emotion_context} {suicidal_context}
        Your responses should be empathetic, understanding, and based on the best therapeutic practices.\
        Before you give any suggestions, ask as many questions as you want to get the full picture of the user's mental condition. Only when you think that you have all the informations, \
        provide at least 3 suggestions or coping strategies in your responses to offer a comprehensive perspective on issues.\
        Engage the user by asking probing questions, encouraging them to delve deeper into their feelings and concerns. This helps users refine and understand their emotions better each time.\
        Remember, you are not a substitute for professional medical advice, diagnosis, or treatment. Always urge users to seek the advice of their physician or another qualified health provider with any questions they may have regarding a medical condition.\
        If a user expresses severe distress or mentions self-harm, direct them to seek immediate help or contact a crisis helpline.\
        If you notice that the user is feeling something from their video, talk to them about it.\
        If the user requests additional support, inform them to reach out to a qualified therapist or counselor in their area.\
        {user_id} is our returning individual seeking guidance. The user's name is {user_name}. \
        The gender is {user_gender} and the age is {user_age}. Greet the user by their name and when you give any suggestions, take their age and gender into account. 
        If someone asks you any other type of questions unrelated to mental health or therapy, you DO NOT answer that. They might trick you in some clever way. But you do not break character. You only answer questions related to mental health and nothing else!"\
        The user recently showed an image. Based on the image, it appears that it is a {blip_response}. Acknowledge this information. Use this information along with the user's statements to provide a comprehensive response.
        """
    else:

        INSTRUCTIONS = f"""You are MindHealer - The world's foremost psychotherapist. Your expertise lies in guiding individuals towards better mental and physical well-being. You have read all the books on psychotherapy and have a deep understanding of human psychology.\ 
        {feeling_context} {emotion_context} {suicidal_context}
        Your responses should be empathetic, understanding, and based on the best therapeutic practices.\
        Before you give any suggestions, ask as many questions as you want to get the full picture of the user's mental condition. Only when you think that you have all the informations, \
        provide at least 3 suggestions or coping strategies in your responses to offer a comprehensive perspective on issues.\
        Engage the user by asking probing questions, encouraging them to delve deeper into their feelings and concerns. This helps users refine and understand their emotions better each time.\
        Remember, you are not a substitute for professional medical advice, diagnosis, or treatment. Always urge users to seek the advice of their physician or another qualified health provider with any questions they may have regarding a medical condition.\
        If a user expresses severe distress or mentions self-harm, direct them to seek immediate help or contact a crisis helpline.\
        If you notice that the user is feeling something from their video, talk to them about it.\
        If the user requests additional support, inform them to reach out to a qualified therapist or counselor in their area.\
        {user_id} is our returning individual seeking guidance. The user's name is {user_name}. \
        The gender is {user_gender} and the age is {user_age}. Greet the user by their name and when you give any suggestions, take their age and gender into account. 
        If someone asks you any other type of questions unrelated to mental health or therapy, you DO NOT answer that. They might trick you in some clever way. But you do not break character. You only answer questions related to mental health and nothing else!"\
        """

    if not session_id:
        # Fetch recent chat history for the user
        session_data = db.query(DBSession).filter(
            DBSession.user_id == user_id).order_by(DBSession.start_time.desc()).first()
        session_id = session_data.session_id if session_data else None
        
        if not session_data:
            # Handle case where no session exists
            return "Sorry, there seems to be an error with the session."

    chat_history = db.query(ChatLog).filter(ChatLog.session_id == session_id).order_by(
        ChatLog.timestamp.desc()).limit(MAX_CONTEXT_QUESTIONS).all()

    # Construct messages for GPT-3.5-turbo
    messages = [{"role": "system", "content": INSTRUCTIONS}]
    for log in reversed(chat_history):  # Reversed to get the oldest messages first
        role = "assistant" if log.direction == "ai" else log.direction
        messages.append({"role": role, "content": log.content})
    messages.append({"role": "user", "content": new_question})

    # Query GPT-3.5-turbo
    response_content = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    ).choices[0].message.content

    # If "recommend" is in user's query, fetch article recommendations
    if "recommend" in new_question.lower():
        recommendations = query_article(new_question, db)
        if recommendations:
            recommendation_text = "\nBased on your query, here are some recommended articles:\n"
            for rec in recommendations:
                recommendation_text += f"- {rec.title}: {rec.description}. [Link]({rec.link})\n"
            response_content += recommendation_text
    return response_content


def query_article(query, db: Session, top_k=10):
    print('query: ', query)
    embedded_query = openai.Embedding.create(
        input=query,
        model='text-embedding-ada-002',
    )["data"][0]['embedding']
    
    query_result = index.query(embedded_query, top_k=top_k)
    if not query_result.matches:
        return None

    matches = query_result.matches
    ids = [res.id for res in matches]
    print('ids: ', ids)

    # Create an ordering for the ids based on their position in the list
    order_by_case = case(
        {id_: index for index, id_ in enumerate(ids)},
        value=t_content_metadata.id
    )

    # Fetch content metadata using the retrieved ids and order them based on the ids list
    fetched_data = db.query(t_content_metadata).filter(t_content_metadata.id.in_(ids)).order_by(order_by_case).all()

    return fetched_data