import { useEffect } from "react";
import { useState } from "react";
import Main, {
  Box,
  MovieList,
  MovieDetails,
  WatchedSummary,
  WatchedMovieList,
} from "./components/Main";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import NavBar, { Search, NumResults } from "./components/NavBar";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${query}`
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching the data");
        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found!");
        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              selectedId={selectedId}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
