/**
 * RAWG API Utility
 * Provides functions for fetching game data from the RAWG.io API
 */

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_RAWG_URL;

// Helper to get current year and month
const getCurrentYear = (): number => new Date().getFullYear();
const getCurrentMonth = (): string => String(new Date().getMonth() + 1).padStart(2, "0");

// Types
export interface GameSummary {
    id: number;
    slug: string;
    name: string;
    released: string | null;
    metacritic: number | null;
    playtime: number;
}

export interface GameInfo {
    id: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    description_raw: string;
    metacritic: number | null;
    released: string | null;
    background_image: string | null;
    background_image_additional: string | null;
    website: string;
    rating: number;
    playtime: number;
    genres: Array<{ id: number; name: string; slug: string }>;
    platforms: Array<{
        platform: { id: number; name: string; slug: string };
        released_at: string | null;
    }>;
    developers: Array<{ id: number; name: string; slug: string }>;
    publishers: Array<{ id: number; name: string; slug: string }>;
    esrb_rating: { id: number; name: string; slug: string } | null;
    [key: string]: unknown;
}

export interface Screenshot {
    id: number;
    image: string;
    width: number;
    height: number;
    is_deleted: boolean;
}

export interface Trailer {
    id: number;
    name: string;
    preview: string;
    data: {
        480: string;
        max: string;
    };
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/**
 * Fetches the top popular games for the current year
 * @param count - Number of games to fetch
 * @returns Array of game summaries
 */
export async function getTopGames(count: number): Promise<GameSummary[]> {
    const year = getCurrentYear();
    const params = new URLSearchParams({
        key: API_KEY,
        page_size: String(count),
        dates: `${year}-01-01,${year}-12-31`,
        ordering: "-added",
    });

    const response = await fetch(`${BASE_URL}/games?${params}`);
    const data: PaginatedResponse<Record<string, unknown>> = await response.json();

    return data.results.map((result) => ({
        id: result.id as number,
        slug: result.slug as string,
        name: result.name as string,
        released: result.released as string | null,
        metacritic: result.metacritic as number | null,
        playtime: result.playtime as number,
    }));
}

/**
 * Fetches top games added this month
 * @param count - Number of games to fetch
 * @returns Paginated response with game data
 */
export async function getTopGamesThisMonth(
    count: number
): Promise<PaginatedResponse<Record<string, unknown>>> {
    const year = getCurrentYear();
    const month = getCurrentMonth();
    const params = new URLSearchParams({
        key: API_KEY,
        page_size: String(count),
        dates: `${year}-${month}-01,${year}-${month}-30`,
        ordering: "-added",
    });

    const response = await fetch(`${BASE_URL}/games?${params}`);
    return response.json();
}

/**
 * Fetches detailed info for a specific game
 * @param gameId - Game slug or ID
 * @returns Game info object
 */
export async function getGameInfo(gameId: string | number): Promise<GameInfo> {
    const params = new URLSearchParams({ key: API_KEY });
    const response = await fetch(`${BASE_URL}/games/${gameId}?${params}`);
    return response.json();
}

/**
 * Fetches screenshots for a game
 * @param gameId - Game slug or ID
 * @param pageSize - Number of screenshots to fetch (default: 10)
 * @returns Array of screenshot objects
 */
export async function getGameScreenshots(
    gameId: string | number,
    pageSize: number = 10
): Promise<Screenshot[]> {
    const params = new URLSearchParams({
        key: API_KEY,
        page_size: String(pageSize),
    });

    const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?${params}`);
    const data: PaginatedResponse<Screenshot> = await response.json();
    return data.results;
}

/**
 * Fetches the background image URL for a game
 * @param gameId - Game slug or ID
 * @returns Background image URL or null
 */
export async function getGameBackground(gameId: string | number): Promise<string | null> {
    const gameInfo = await getGameInfo(gameId);
    return gameInfo.background_image;
}

/**
 * Fetches the additional background image URL for a game
 * @param gameId - Game slug or ID
 * @returns Additional background image URL or null
 */
export async function getGameBackgroundAdditional(
    gameId: string | number
): Promise<string | null> {
    const gameInfo = await getGameInfo(gameId);
    return gameInfo.background_image_additional;
}

/**
 * Fetches trailers/movies for a game
 * @param gameId - Game slug or ID
 * @returns Paginated response with trailers
 */
export async function getGameTrailers(
    gameId: string | number
): Promise<PaginatedResponse<Trailer>> {
    const params = new URLSearchParams({ key: API_KEY });
    const response = await fetch(`${BASE_URL}/games/${gameId}/movies?${params}`);
    return response.json();
}

/**
 * Searches for games by query
 * @param query - Search query string
 * @param pageSize - Number of results to return (default: 21)
 * @returns Paginated response with search results
 */
export async function searchForGame(
    query: string,
    pageSize: number = 21
): Promise<PaginatedResponse<Record<string, unknown>>> {
    const params = new URLSearchParams({
        key: API_KEY,
        page_size: String(pageSize),
        search: query,
    });

    const response = await fetch(`${BASE_URL}/games?${params}`);
    return response.json();
}
