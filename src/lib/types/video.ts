export interface Video {
  id: string;
  key: string;
  name: string;
  site: string; // YouTube, Vimeo, etc.
  size: number;
  type: string; // Trailer, Teaser, etc.
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}