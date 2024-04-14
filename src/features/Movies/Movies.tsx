import { useContext, useEffect } from "react";
import { fetchNextPage } from "../../reducers/movies";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MovieCard } from "./MovieCard";

import { useAppDispatch } from "../../hooks";
import { Container, Grid, LinearProgress, Typography } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

function Movies() {
  const dispatch = useAppDispatch();

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;
  const hasMorePages = useSelector((state: RootState) => state.movies.hasMorePages);
  const movies = useSelector((state: RootState) => state.movies.top);
  const loading = useSelector((state: RootState) => state.movies.loading);

  const [targetRef, entry] = useIntersectionObserver();

  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      dispatch(fetchNextPage());
    }
  }, [dispatch, entry?.isIntersecting, hasMorePages]);

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Now playing
      </Typography>
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
        <div ref={targetRef}>{loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}</div>
      </div>
    </Container>
  );
}

export default Movies;
