export interface NamedEntity {
  id: number;
  name: string;
}

export interface GameCover {
  id?: number;
  url?: string;
  image_id?: string;
  width?: number;
  height?: number;
}

export interface GameScreenshot {
  id: number;
  url: string;
  width?: number;
  height?: number;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  summary?: string;
  genres?: NamedEntity[];
  platforms?: NamedEntity[];
  cover?: GameCover;
}

export interface InvolvedCompany {
  id: number;
  developer?: boolean;
  company: NamedEntity;
}

export interface GameWebsite {
  id: number;
  url: string;
  category?: number;
}

export interface GameDetail extends Game {
  storyline?: string;
  artworks?: GameCover[];
  screenshots?: GameScreenshot[];
  websites?: GameWebsite[];
  involved_companies?: InvolvedCompany[];
}
