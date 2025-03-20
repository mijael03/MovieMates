export interface LiteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

export interface LiteMovieResponse {
  page: number;
  results: LiteMovie[];
  total_pages: number;
  total_results: number;
}