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
