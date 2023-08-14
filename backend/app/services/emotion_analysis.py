# app/services/emotion_analysis.py

import cv2
from deepface import DeepFace
import asyncio

def capture_emotion(stop_event, n=10):
    """
    Asynchronously capture emotion every n frames and yield the result.
    """
    emotions_over_time = {
        'happy': [],
        'sad': [],
        'neutral': [],
        'angry': [],
        'disgust': [],
        'fear': [],
        'surprise': [],
        # ... add all emotion types here
    }

    cap = cv2.VideoCapture(0)  # Use 0 for the default webcam
    frame_count = 0

    while True:
        if stop_event.is_set():  # Check if the stop flag is set
            break
        ret, frame = cap.read()

        if not ret:
            break

        if frame_count % n == 0:
            try:
                result = DeepFace.analyze(frame, actions=['emotion'])
                emotion_scores = result[0]['emotion']
            
                for emotion, score in emotion_scores.items():
                    emotions_over_time[emotion].append(score)

                if frame_count % n == 0:
                    aggregated_scores = {emotion: sum(scores)/len(scores) for emotion, scores in emotions_over_time.items()}
                    dominant_emotion = max(aggregated_scores, key=aggregated_scores.get)
                    yield dominant_emotion
                    emotions_over_time = {emotion: [] for emotion in emotions_over_time}  # Reset the scores after yielding dominant emotion

            except:
                pass
            

        frame_count += 1

        # Here we're not showing the frame using cv2.imshow, since it's unnecessary in a server context
        # but if you want to visualize the frames on the server side, you can use it

        #Introduce a small delay to avoid overloading the CPU
        # await asyncio.sleep(0.01)

    cap.release()