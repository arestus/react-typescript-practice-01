import { client } from "../api/tmdb";
import { AppThunk } from "../store";
import { ActionWithPayload, createReducer } from "./../redux/utils";

export interface Movie {
  id: number;
  title: string;
  popularity: number;
  overview: string;
  image?: string;
}

interface MovieState {
  top: Movie[];
  loading: boolean;
  page: number;
  hasMorePages: boolean;
}

const initialState = {
  top: [],
  loading: false,
  page: 0,
  hasMorePages: true,
};

const moviesLoaded = (movies: Movie[], page: number, hasMorePages: boolean) => ({
  type: "movies/loaded",
  payload: { movies, page, hasMorePages },
});

const moviesLoading = () => ({
  type: "movies/loading",
});

export function fetchNextPage(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    const nextPage = getState().movies.page + 1;
    dispatch(fetchPage(nextPage));
  };
}

function fetchPage(page: number): AppThunk<Promise<void>> {
  return async (dispatch) => {
    dispatch(moviesLoading());

    const config = await client.getConfiguration();
    const imageUrl = config.images.base_url;
    const nowPlaying = await client.getNowPlaying(page);

    const mappedResults: Movie[] = nowPlaying.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      image: movie.backdrop_path ? `${imageUrl}w780${movie.backdrop_path}` : undefined,
    }));

    const hasMorePage = nowPlaying.page < nowPlaying.totalPages;

    dispatch(moviesLoaded(mappedResults, page, hasMorePage));
  };
}
const moviesReducer = createReducer<MovieState>(initialState, {
  "movies/loaded": (
    state,
    action: ActionWithPayload<{ movies: Movie[]; page: number; hasMorePages: boolean }>
  ) => {
    return {
      ...state,
      top: [...state.top, ...action.payload.movies],
      page: action.payload.page,
      hasMorePages: action.payload.hasMorePages,
      loading: false,
    };
  },
  "movies/loading": (state, action) => {
    return {
      ...state,
      loading: true,
    };
  },
});

export default moviesReducer;
