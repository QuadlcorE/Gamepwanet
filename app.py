from flask import Flask,render_template
from getFunction import *

app = Flask(__name__)

@app.route("/")
def index():
    top_games = get_top_games()
    for game in top_games:
        game["background"] = get_game_background(game["slug"])
    
    return render_template("index.html", top_games = top_games)

@