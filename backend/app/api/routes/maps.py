import requests
from fastapi import APIRouter, HTTPException
from typing import List, Dict
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_API_KEY")

router = APIRouter()

@router.get("/therapists")
def fetch_therapists_nearby(lat: float, lng: float):
    therapists = get_nearby_therapists(lat, lng)
    # print(therapists)
    if not therapists:
        raise HTTPException(status_code=404, detail="No therapists found.")
    return therapists


def get_nearby_therapists(lat: float, lng: float):
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    radius = 5000  # Search within 5km radius, adjust as necessary
    
    # Make the API request
    response = requests.get(base_url, params={
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": "therapist,counseling",
        "key": GOOGLE_MAPS_API_KEY
    })
    #print(response.json()['results'])

    results = response.json().get('results', [])
    therapists = []

    for result in results:
        #print(result.keys())
        name = result['name']
        address = result.get('vicinity', '')
        location = result['geometry']['location']
        maps_link = f"https://www.google.com/maps/place/?q=place_id:{result['place_id']}"
        rating = result['rating']
        num_ratings = result['user_ratings_total']
        if "photos" in result.keys():
            photo = "https://maps.googleapis.com/maps/api/place/photo?photoreference={}&sensor=false&maxheight=1200&maxwidth=1200&key={}".format(result['photos'][0]['photo_reference'], GOOGLE_MAPS_API_KEY)
        else:
            photo = ""
        
        therapists.append({
            "name": name,
            "address": address,
            "link": maps_link,
            "location": location,
            "photo": photo,
            "rating": rating,
            "num_rating": num_ratings
        })
        
    return therapists