import requests 
import json

from test2 import jprint

def get_top_games():
    '''Returns a list of dictionaries of the top 5 popular games
    dictionary contains id, slug, name, released, metacritic, playtime.
    '''

    param = {
        "page_size" : "10",
        "dates" : "2022-01-01,2022-12-31",
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


def get_game_backgrounds(game_pk):
    ''' To Do '''


def get_game_info(game_pk):
    ''' To Do '''


#get_top_games()
#get_game_screenshots("lost-ark")