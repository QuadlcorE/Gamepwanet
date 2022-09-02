import http.client

conn = http.client.HTTPSConnection("rawg-video-games-database.p.rapidapi.com")

headers = {
    'X-RapidAPI-Key': "4492af9db3msh254f3f7111083e7p17ea86jsn02544390b935",
    'X-RapidAPI-Host': "rawg-video-games-database.p.rapidapi.com"
    }

conn.request("GET", "/games?key=9584bc037067422aad0275f5f6af6650", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))