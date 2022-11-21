from flask import *

from getFunction import *

app = Flask(__name__)

@app.route("/")
def index():
    top_games = get_top_games(5)
    top_game_index = 0
    for game in top_games:
        game["background"] = get_game_background(game["slug"])
        game["index"] = top_game_index
        top_game_index += 1

    top_games_this_month = get_top_games_this_month(6)

    
    return render_template(
        "index.html",
        top_games = top_games,
        top_games_this_month = top_games_this_month
        )

@app.route("/search", methods=['GET','POST'])
def search():
    try:
        search_query = request.form.get("search_query")
        search_result = search_for_a_game(search_query)
        return render_template(
            "search.html",
            search_query = search_query,
            search_results = search_result
        )
    except: 
        return redirect(url_for('index'))

@app.route("/game/<gamename>", methods=['GET', 'POST'])
def game(gamename):
    #if request.method == 'POST': 
    #name = request.form['gameslug']
    game_info = get_game_info(gamename)
    game_screenshots = get_game_screenshots(gamename)
    tmp = 0
    for photo in game_screenshots:
        photo["index"] = tmp
        tmp+=1
    
    #game_trailer = get_game_trailers(gamename)

    return render_template(
        "game.html",
        gameinfo = game_info,        #remember to change this
        #gametrailer = game_trailer,
        game_screenshots = game_screenshots
        )