// ratings inside the ratings array
export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

// ESRB rating
export interface EsrbRating {
  id: number;
  slug: string;
  name: string;
}

// Platform info
export interface PlatformInfo {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  year_end: number | null;
  year_start: number | null;
  games_count: number;
  image_background: string;
}

// Platform wrapper
export interface Platform {
  platform: PlatformInfo;
  released_at: string;
  requirements_en: {
    minimum?: string;
    recommended?: string;
  } | null;
  requirements_ru: {
    minimum?: string;
    recommended?: string;
  } | null;
}

// Short screenshots
export interface Screenshot {
  id: number;
  image: string;
}

// Main Game type
export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;

  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  reviews_count: number;

  added: number;
  added_by_status: Record<string, number>;

  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;

  user_game: unknown | null;

  saturated_color: string;
  dominant_color: string;

  platforms: Platform[];

  esrb_rating: EsrbRating | null;

  short_screenshots: Screenshot[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MetacriticPlatform {
  metascore: number;
  url: string;
  platform: {
    platform: number;
    name: string;
    slug: string;
  };
}

export interface Screenshot {
  id:number,
  image: string,
  width: number,
  height: number,
  is_deleted: boolean,
}

export interface GameDetail {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  metacritic: number;
  metacritic_platforms: MetacriticPlatform[];
  released: string;
  tba: boolean;
  updated: string;
  background_image: string;
  background_image_additional: string;
  website: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  reactions: Record<string, number>;
  added: number;
  added_by_status: Record<string, number>;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: string;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: string;
  youtube_count: string;
  reviews_text_count: string;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  esrb_rating: EsrbRating | null;
  description_raw?: string;
  genres?: Array<{ id: number; name: string; slug: string }>;
  developers?: Array<{ id: number; name: string; slug: string }>;
  publishers?: Array<{ id: number; name: string; slug: string }>;
  platforms?: Array<{
    platform: { id: number; name: string; slug: string };
    released_at?: string | null;
  }>;
  screenshots:Array<Screenshot> | null
};