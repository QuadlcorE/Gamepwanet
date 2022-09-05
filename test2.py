import requests
import json

def jprint(obj):
    # create a formatted string of the Python JSON object
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)

def scout(url):
    response = requests.get(url)

    print(response.status_code)
    data = response.json()

    print(data["results"][1])

    jprint(data["results"][1])


    #while jprint(response.json()["next"]) != 'null':
    #    scout(response.json()["next"])
    
def write_txt(data):
    txt = json.dumps(data, sort_keys=True, indent=4)
    with open("data.txt", "w") as f:
        f.write(txt)

#scout("https://api.rawg.io/api/collections/lists/popular?key=9584bc037067422aad0275f5f6af6650")