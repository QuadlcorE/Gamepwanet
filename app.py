from flask import Flask,render_template
from getFunction import *

app = Flask(__name__)

@app.route("/")
def index():
    top_games = get_top_games()
    top_game_index = 0
    for game in top_games:
        game["background"] = get_game_background(game["slug"])
        game["index"] = top_game_index
        top_game_index += 1
    
    return render_template("index.html", top_games = top_games)
