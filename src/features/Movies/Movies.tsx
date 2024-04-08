import { useEffect, useState } from "react";
import { Movie } from "../../reducers/movies";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { MovieCard } from "./MovieCard";

import styles from "./Movies.module.scss";
import { MovieDetails, client } from "../../api/tmdb";

export function MoviesFetch() {
  const [movies, setMovies] = useState<MovieDetails[]>([]);

  useEffect(() => {
    async function loadData() {
      const config = await client.getConfiguration();
      const imageUrl = config.images.base_url;
      const results = await client.getNowPlaying();

      const mappedResults: Movie[] = results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        popularity: movie.popularity,
        image: movie.backdrop_path
          ? `${imageUrl}w780${movie.backdrop_path}`
          : undefined,
      }));

      setMovies(mappedResults);
    }

    loadData();
  }, []);

  return <Movies movies={movies} />;
}

interface MoviesProps {
  movies: Movie[];
}

function Movies({ movies }: MoviesProps) {
  return (
    <section>
      <div className={styles.list}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            overview={movie.overview}
            popularity={movie.popularity}
            image={movie.image}
          />
        ))}
      </div>
    </section>
  );
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies.top,
});

const connector = connect(mapStateToProps);

export default connector(Movies);
