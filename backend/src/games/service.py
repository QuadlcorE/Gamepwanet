"""
.. module: games.service
"""

import requests
import os
from dotenv import load_dotenv

load_dotenv()

rawg_url = os.getenv('RAWG_BASE_URL')
api_key = os.getenv('RAWG_API_KEY')

# TODO: Create function to retrieve games 

def retrieve_top_games(number: int):
    url = f"{rawg_url}/games"
    payload = { "key": api_key, "page_size": number}
    
    response = requests.get(url=url, params=payload)
    response_json = response.json()
    
    games = response_json["results"]
    
    return games