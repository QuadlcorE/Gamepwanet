"""
.. module: games.service
"""

import httpx
import os
from dotenv import load_dotenv
import calendar
from datetime import date, timedelta, datetime
from ..errors import IGDBError
import logging 

load_dotenv()


logger = logging.getLogger(__name__)

igdb_client_id = os.getenv('IGDB_CLIENT_ID')
igdb_access_token = os.getenv('IGDB_ACCESS_TOKEN')

IGDB_BASE_URL = "https://api.igdb.com/v4"

GAME_FIELDS = "fields id,name,first_release_date,rating,rating_count,cover.url,genres.name,platforms.name,summary,slug;"

def _to_unix(d: date) -> int:
    return int(datetime(d.year, d.month, d.day).timestamp())


def _igdb_headers() -> dict:
    if not igdb_access_token or not igdb_client_id:
        raise EnvironmentError(
            "IGDB_CLIENT_ID and IGDB_ACCESS_TOKEN must be set in your .env file"
        )
    return {
        "Client-ID": igdb_client_id,
        "Authorization": f"Bearer {igdb_access_token}",
    }


def _igdb_query(endpoint: str, body: str) -> list:
    url = f"{IGDB_BASE_URL}/{endpoint}"
    try:
        response = httpx.post(url, headers=_igdb_headers(), content=body)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as err:
        try:
            error_detail = err.response.json()
        except Exception:
            error_detail = err.response.text
        raise IGDBError(
            status_code = err.response.status_code,
            detail=error_detail,
            query=body,
        ) from err
    except httpx.RequestError as err:
        raise IGDBError(status_code=503, detail=str(err), query=body) from err


def retrieve_top_games(page_size: int):
    start_ts = _to_unix(date.today() - timedelta(days=30))
    end_ts = _to_unix(date.today())

    body = (
        f"{GAME_FIELDS}"
        f"where first_release_date >= {start_ts} & first_release_date <= {end_ts} & rating_count > 0;"
        f"sort rating desc;"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)


def retrieve_hot_games(page_size: int):
    start_ts = _to_unix(date.today() - timedelta(days=60))
    end_ts = _to_unix(date.today())

    pop_body = (
        "fields game_id,value;"
        "where game_id != null & popularity_type = 1;"
        "sort value desc;"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {pop_body}")
    pop_results = _igdb_query("popularity_primitives", pop_body)
    game_ids = [str(entry["game_id"]) for entry in pop_results]

    if not game_ids:
        return []

    ids_str = ",".join(game_ids)
    body = (
        f"{GAME_FIELDS}"
        f"where id = ({ids_str})"
        f" & first_release_date >= {start_ts} & first_release_date <= {end_ts};"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)


def retrieve_hot_games_by_month(page_size: int, month: int):
    month = int(month)
    today = date.today()
    year = today.year if month <= today.month else today.year - 1

    start_ts = _to_unix(date(year, month, 1))
    end_ts = _to_unix(date(year, month, calendar.monthrange(year, month)[1]))

    body = (
        f"{GAME_FIELDS}"
        f"where first_release_date >= {start_ts} & first_release_date <= {end_ts} & rating_count > 0;"
        f"sort rating desc;"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)


def retrieve_weekly_games(page_size: int):
    start_ts = _to_unix(date.today() - timedelta(days=7))
    end_ts = _to_unix(date.today())

    body = (
        f"{GAME_FIELDS}"
        f"where first_release_date >= {start_ts} & first_release_date <= {end_ts} & rating_count > 0;"
        f"sort rating desc;"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)


def retrieve_game_details(game_slug: str):
    body = (
        "fields id,name,first_release_date,rating,rating_count,cover.url,"
        "genres.name,platforms.name,summary,slug,storyline,"
        "involved_companies.company.name,involved_companies.developer,"
        "websites.url,websites.category,videos.video_id,"
        "artworks.url,artworks.image_id,artworks.width,artworks.height;"
        f'where slug = "{game_slug}";'
    )
    games = _igdb_query("games", body)
    if not games:
        raise IGDBError(status_code=404, detail=f"Game {game_slug} not found")
    game = games[0]

    screenshot_body = (
        f"fields id,url,width,height;"
        f"where game = {game['id']};"
        f"limit 20;"
    )
    game["screenshots"] = _igdb_query("screenshots", screenshot_body)

    return game


def retrieve_upcoming_games(page_size: int):
    start_ts = _to_unix(date.today())
    end_ts = _to_unix(date.today() + timedelta(days=30))

    body = (
        f"{GAME_FIELDS}"
        f"where first_release_date >= {start_ts} & first_release_date <= {end_ts};"
        f"sort first_release_date asc;"
        f"limit {page_size};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)


def get_search_game(search: str, page_size: int, page: int):
    offset = (page - 1) * page_size

    body = (
        f"{GAME_FIELDS}"
        f'search "{search}";'
        f"limit {page_size};"
        f"offset {offset};"
    )
    logger.debug(f"IGDB Query: {body}")
    return _igdb_query("games", body)
