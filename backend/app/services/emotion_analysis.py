# app/services/emotion_analysis.py

import cv2
from fer import FER
from collections import deque

def capture_emotion(stop_event, n=10, window_size=5):
    """
    Asynchronously capture emotion every n frames and yield the result.
    Uses a sliding window of size window_size to aggregate emotions.
    """
    detector = FER(mtcnn=True)
    cap = cv2.VideoCapture(0)  # Use 0 for the default webcam
    frame_count = 0

    # Use a deque to store the last window_size emotion scores
    recent_emotions = deque(maxlen=window_size)

    while True:
        if stop_event.is_set():
            break
        ret, frame = cap.read()

        if not ret:
            break

        if frame_count % n == 0:
            try:
                emotions = detector.detect_emotions(frame)
                #print(emotions)
                emotion_scores = emotions[0]['emotions']
                

                if emotion_scores is not None:
                    recent_emotions.append(emotion_scores)

                    # Calculate the weighted average of recent emotion scores
                    weighted_scores = {emotion: 0 for emotion in emotion_scores}
                    for i, recent_score in enumerate(recent_emotions):
                        for emotion, score in recent_score.items():
                            # Newer frames have higher weight
                            weighted_scores[emotion] += score * (i + 1)

                    # Normalize the weighted scores
                    total_weight = sum(range(1, len(recent_emotions) + 1))
                    normalized_scores = {emotion: score / total_weight for emotion, score in weighted_scores.items()}
                    # print(normalized_scores)

                    dominant_emotion = max(normalized_scores, key=normalized_scores.get)
                    print(dominant_emotion)
                    yield dominant_emotion

            except Exception as e:
                print(f"Error in emotion detection: {e}")

        frame_count += 1

    cap.release()
