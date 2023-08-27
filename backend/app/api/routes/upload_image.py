# backend/app/api/routes/upload_image.py

import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.authentication import get_current_user
import shutil
import boto3

from app.core.models import User

router = APIRouter()

s3 = boto3.client('s3')
BUCKET_NAME = "artelus-mental-health"
SUB_FOLDER = "profile-pictures"
CLOUDFRONT_URL = "https://d1xgv8sy7k5ere.cloudfront.net"

@router.post("/upload-image/")
async def upload_image(user=Depends(get_current_user), file: UploadFile = File(...)):
    try:
        # Generate a unique filename using user_id and current timestamp
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"user_{user.user_id}_{timestamp}.jpg"
        filepath = os.path.join("uploaded_images", filename)

        # Ensure the 'uploaded_images' directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Now that the image is saved, you can process it further if needed
        return {"filename": filename, "message": "Image uploaded successfully!"}

    except Exception as e:
        return {"error": str(e)}
    

@router.post("/upload-profile-picture/")
async def upload_profile_picture(user=Depends(get_current_user), file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Check if user has an existing profile image
        existing_user = db.query(User).filter(User.user_id == user.user_id).first()
        if existing_user and existing_user.profile_image:
            # Extract the S3 path from the URL
            existing_s3_path = existing_user.profile_image.replace(CLOUDFRONT_URL + "/", "")
            
            # Delete the existing image from S3
            s3.delete_object(Bucket=BUCKET_NAME, Key=existing_s3_path)

        # Generate a unique filename using user_id and current timestamp
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"user_{user.user_id}_{timestamp}.jpg"
        s3_path = os.path.join(SUB_FOLDER, str(user.user_id), filename)

        # Upload the new image to S3
        s3.upload_fileobj(
            file.file,
            BUCKET_NAME,
            s3_path,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )

        # Update the profile_image column in the t_users table
        existing_user.profile_image = f"{CLOUDFRONT_URL}/{s3_path}"
        db.commit()

        return {"message": "Profile picture updated successfully!"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/get-profile-image/")
def get_profile_image(user=Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(User).filter(User.user_id == user.user_id).first()
    if results and results.profile_image:
        return {"profile_image_url": results.profile_image}
    else:
        raise HTTPException(status_code=404, detail="Profile image not found.")