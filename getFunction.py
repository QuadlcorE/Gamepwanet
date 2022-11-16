import json

import requests

from test2 import *


def get_top_games(number):
    '''Returns a list of dictionaries of the top 'number' popular games
    dictionary contains id, slug, name, released, metacritic, playtime.
    '''

    year = current_year()
    param = {
        "page_size" : number,
        "dates" : f"{year}-01-01,{year}-12-31",
        "ordering" : "-added"
    }

    url = "https://api.rawg.io/api/games?key=9584bc037067422aad0275f5f6af6650"

    response = requests.get(url, params=param)
    data = response.json()
    results = data["results"].copy()
    order_list = ["id", "slug", "name", "released", "metacritic", "playtime"]
    games = []

    for result in results:
        tmp = {}
        cnt = 0
        for x in order_list:
            tmp[order_list[cnt]] = result[order_list[cnt]]
            cnt += 1
        games.append(tmp)


    return games

def get_top_games_this_month(number):
    '''Returns a list containing dictionaries of top added games for the current month.
    Dictionaries same as get game_info.
    '''
    year = current_year()
    month = current_month()
    param = {
        "page_size" : number,
        "dates" : f"{year}-{month}-01,{year}-{month}-30",
        "ordering" : "-added"
    }
    
    url = "https://api.rawg.io/api/games?key=9584bc037067422aad0275f5f6af6650"

    response = requests.get(url, params=param)
    data = response.json()
    return data

def get_latest_releases():
    ''' To Do '''


def get_game_screenshots(game_pk):
    '''Returns a list of dictionaries for the game(game_pk).
    Dictionary returned contains width, id, height, image, is_deleted.
    game_pk : game slug 
    image : url to the image
    '''

    url = "https://api.rawg.io/api/games/{game_pk}/screenshots?key=9584bc037067422aad0275f5f6af6650".format(game_pk = game_pk)

    response = requests.get(url)
    data = response.json()

    jprint(data)
    return(data)


def get_game_background(game_pk):
    ''' Returns a link to background image. 
    Where game_pk = slug of the game
    '''
    game_info = get_game_info(game_pk)
    #print(game_info["background_image"])
    return game_info["background_image"]


def get_game_background_additional(game_pk):
    ''' Returns a link to the additional background image. 
    Where game_pk = slug of the game
    '''
    game_info = get_game_info(game_pk)
    return game_info["background_image_additional"]


def get_game_info(game_id):
    '''Returns a dictionary containing info on the game.
    where game_id = slug or id of the game
    '''
    param = {
        "id" : str(game_id)
    }
    
    url = "https://api.rawg.io/api/games/{id}?key=9584bc037067422aad0275f5f6af6650".format(id = game_id)

    response = requests.get(url, params = param)
    data = response.json()
    #write_txt(data)
    #jprint(data)
    return data

def get_game_screenshots(game_id):
    '''Returns a dictionary of image files
    '''

    param = {
        "id" : str(game_id),
        "page_size" : 10
    }

    url = "https://api.rawg.io/api/games/{game_pk}/screenshots?key=9584bc037067422aad0275f5f6af6650".format(game_pk = game_id)

    response = requests.get(url, params = param)
    data = response.json()

    #append_txt(data)
    #jprint(data)

    return data["results"]

def get_game_trailers(game_id):
    '''Returns a dict of game trailers containing preview as string
        and data as obj
    '''
    param = {
        "id" : str(game_id)
    }
    
    url = "https://api.rawg.io/api/games/{id}/movies?key=9584bc037067422aad0275f5f6af6650".format(id = game_id)

    response = requests.get(url, params = param)
    data = response.json()

    #append_txt(data)
    #jprint(data)

    return data

def search_for_a_game(search_query):
    '''
    Retuerns unknown for now
    '''

    param = {
        "page_size" : 21,
        "search" : search_query
    }

    url = "https://api.rawg.io/api/games?key=9584bc037067422aad0275f5f6af6650"

    response = requests.get(url, params = param)
    data = response.json()

    #write_txt(data)
    #jprint(data)

    return data 
