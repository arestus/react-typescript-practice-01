import { useContext, useEffect, useState } from "react";
import { fetchNextPage, resetMovies } from "../../reducers/movies";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MovieCard } from "./MovieCard";

import { useAppDispatch } from "../../hooks";
import { Container, Grid, LinearProgress } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Filters, MoviesFilter } from "./MoviesFilter";

function Movies() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<Filters>();
  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;
  const hasMorePages = useSelector((state: RootState) => state.movies.hasMorePages);
  const movies = useSelector((state: RootState) => state.movies.top);
  const loading = useSelector((state: RootState) => state.movies.loading);

  const [targetRef, entry] = useIntersectionObserver();

  useEffect(() => {
    dispatch(resetMovies());
  }, [dispatch]);

  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      const moviesFilters = filters
        ? {
            keywords: filters.keywords.map((k) => k.id),
          }
        : undefined;
      dispatch(fetchNextPage(moviesFilters));
    }
  }, [dispatch, entry?.isIntersecting, hasMorePages, filters]);

  return (
    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
      <Grid item xs="auto" sx={{ mt: 8 }}>
        <MoviesFilter
          onApply={(f) => {
            dispatch(resetMovies());
            setFilters(f);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <div>
            <Grid container spacing={4}>
              {movies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    overview={movie.overview}
                    popularity={movie.popularity}
                    image={movie.image}
                    enableUserActions={loggedIn}
                  />
                </Grid>
              ))}
            </Grid>
            <div ref={targetRef}>
              {loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}
            </div>
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Movies;
