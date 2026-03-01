"""
.. module: games.service
"""

import requests
import os
from dotenv import load_dotenv
from datetime import date, timedelta

load_dotenv()

rawg_url = os.getenv('RAWG_BASE_URL')
api_key = os.getenv('RAWG_API_KEY')
url = f"{rawg_url}/games"

# TODO: Create function to retrieve games 

def retrieve_top_games(number: int):
    start_date = (date.today() - timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": number, "dates": f"{start_date},{end_date}", "ordering": "-rating"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games

def retrieve_hot_games():
    ... 

def retrieve_upcoming_games(number: int):
    end_date = (date.today() + timedelta(days=30)).strftime("%Y-%m-%d")
    start_date = date.today().strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": number, "dates": f"{start_date},{end_date}", "order": "released"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games