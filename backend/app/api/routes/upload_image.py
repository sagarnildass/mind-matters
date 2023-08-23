import os
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
import shutil

router = APIRouter()

@router.post("/upload-image/")
async def upload_image(user_id: int, file: UploadFile = File(...)):
    try:
        # Generate a unique filename using user_id and current timestamp
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"user_{user_id}_{timestamp}.jpg"
        filepath = os.path.join("uploaded_images", filename)

        # Ensure the 'uploaded_images' directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Now that the image is saved, you can process it further if needed
        return {"filename": filename, "message": "Image uploaded successfully!"}

    except Exception as e:
        return {"error": str(e)}