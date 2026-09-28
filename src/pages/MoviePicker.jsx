import { useState } from "react";
import { getRandomMovie, getMovieDetails } from "../services/api.js";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MoviePicker.css";

const GENRES = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "10770", name: "TV Movie" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const RATINGS = [0, 5, 6, 7, 8];

const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

function MoviePicker() {
  const [genre, setGenre] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const handlePick = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const picked = await getRandomMovie({
        genreId: genre === "all" ? null : genre,
        minRating,
        excludeIds: history,
      });

      if (!picked) {
        setMovie(null);
        setError("No movies match these filters. Try loosening them up.");
        return;
      }

      // Detaylar (süre, türler, tagline) için ikinci istek; başarısız olursa temel veriyle devam
      let details = picked;
      try {
        details = { ...picked, ...(await getMovieDetails(picked.id)) };
      } catch (err) {
        console.log(err);
      }

      setMovie(details);
      setHistory((prev) => [picked.id, ...prev].slice(0, 50));
    } catch (err) {
      console.log(err);
      setError("Failed to pick a movie...");
    } finally {
      setLoading(false);
    }
  };

  const favorite = movie ? isFavorite(movie.id) : false;

  const toggleFavorite = () => {
    if (!movie) return;
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  };

  return (
    <div className="picker">
      <div className="page-header">
        <h1 className="page-title">Movie Picker</h1>
        <span className="page-subtitle">One random film from TMDB, filtered your way.</span>
      </div>

      <div className="picker-controls">
        <div className="picker-field">
          <label htmlFor="picker-genre">Genre</label>
          <select
            id="picker-genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="all">All Genres</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="picker-field">
          <label htmlFor="picker-rating">Min Rating</label>
          <select
            id="picker-rating"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {RATINGS.map((r) => (
              <option key={r} value={r}>
                {r === 0 ? "Any" : `${r}+ ★`}
              </option>
            ))}
          </select>
        </div>

        <button
          className="random-movie-button"
          onClick={handlePick}
          disabled={loading}
        >
          {loading ? "Picking…" : movie ? "Pick again" : "Pick a movie"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !movie && (
        <div className="picker-loading">
          <div className="picker-spinner" />
        </div>
      )}

      {!movie && !loading && !error && (
        <p className="picker-empty">Nothing picked yet.</p>
      )}

      {movie && (
        <div
          key={movie.id}
          className={`picker-result ${loading ? "is-loading" : ""}`}
          style={
            movie.backdrop_path
              ? {
                  "--backdrop": `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                }
              : undefined
          }
        >
          <div className="picker-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          <div className="picker-details">
            <h2>{movie.title}</h2>
            {movie.tagline && <p className="picker-tagline">{movie.tagline}</p>}

            <div className="picker-meta">
              {movie.release_date && <span>{movie.release_date.split("-")[0]}</span>}
              {formatRuntime(movie.runtime) && <span>{formatRuntime(movie.runtime)}</span>}
              {movie.vote_average > 0 && (
                <span className="picker-rating">★ {movie.vote_average.toFixed(1)}</span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="picker-genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="picker-genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && <p className="picker-overview">{movie.overview}</p>}

            <div className="picker-actions">
              <button
                className={`picker-fav-btn ${favorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                {favorite ? "♥ In favorites" : "♡ Add to favorites"}
              </button>
              <a
                className="picker-tmdb-link"
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
                rel="noreferrer"
              >
                TMDB page →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePicker;
