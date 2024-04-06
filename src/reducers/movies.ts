import { Action, Reducer } from "redux";

export interface Movie {
  id: number;
  title: string;
  popularity: number;
  overview: string;
}

interface MovieState {
  top: Movie[];
}

const initialState = {
  top: [
    {
      id: 1,
      title: "The Shawshank Redemption",
      popularity: 9.2,
      overview: "Two imprisoned",
    },
    {
      id: 2,
      title: "The Godfather",
      popularity: 9.2,
      overview: "Two imprisoned",
    },
    {
      id: 3,
      title: "The Dark Knight",
      popularity: 9.0,
      overview: "Two imprisoned",
    },
  ],
};

const moviesReducer: Reducer<MovieState, Action> = (state, action) => {
  return initialState;
};

export default moviesReducer;
