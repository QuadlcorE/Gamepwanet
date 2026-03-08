"""
.. module: games.service
"""

import requests
import os
from dotenv import load_dotenv
import calendar
from datetime import date, timedelta

load_dotenv()

rawg_url = os.getenv('RAWG_BASE_URL')
api_key = os.getenv('RAWG_API_KEY')
url = f"{rawg_url}/games"

def retrieve_top_games(page_size: int):
    start_date = (date.today() - timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = date.today().strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": page_size, "dates": f"{start_date},{end_date}", "ordering": "-rating"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games

def retrieve_hot_games(page_size: int ):
    # TODO: Retrieve hot games in the last 60 days.
    start_date = (date.today() - timedelta(days=60)).strftime("%Y-%m-%d") 
    end_date = date.today().strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": page_size, "dates": f"{start_date},{end_date}", "ordering": "popularity"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games

def retrieve_hot_games_by_month(page_size: int, month: int):
    today = date.today()
    year = today.year if month <= today.month else today.year - 1

    start_date = date(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = date(year, month, last_day)

    start_date = start_date.strftime("%Y-%m-%d")
    end_date = end_date.strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": page_size, "dates": f"{start_date},{end_date}", "ordering": "popularity"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games
    

def retrieve_upcoming_games(page_size: int):
    end_date = (date.today() + timedelta(days=30)).strftime("%Y-%m-%d")
    start_date = date.today().strftime("%Y-%m-%d")
    
    payload = { "key": api_key, "page_size": page_size, "dates": f"{start_date},{end_date}", "order": "released"}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games