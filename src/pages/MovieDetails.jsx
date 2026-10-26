import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import { formatRuntime } from "../utils/formatRuntime.js";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  // Sayfa doğrudan linkle açıldıysa geçmişte geri gidilecek yer yok, ana sayfaya dön
  const goBack = () => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  useEffect(() => {
    let ignore = false;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);

        if (ignore) return;
        setMovie(data);
        setError(null);
      } catch (err) {
        if (ignore) return;
        console.log(err);
        setError("Failed to load movie...")
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMovie();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  const favorite = isFavorite(movie.id);

  function toggleFavorite() {
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <div className="movie-details">
      <button className="details-back" onClick={goBack}>
        ← Back
      </button>

      <div className="details-content">
        <div className="details-poster">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          )}
        </div>

        <div className="details-info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="details-tagline">{movie.tagline}</p>}

          <div className="details-meta">
            {movie.release_date && <span>{movie.release_date.split("-")[0]}</span>}
            {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
            {movie.vote_average > 0 && (
              <span className="details-rating">★ {movie.vote_average.toFixed(1)}</span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="details-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="details-genre">{g.name}</span>
              ))}
            </div>
          )}

          {movie.overview && <p className="details-overview">{movie.overview}</p>}

          <button
            className={`details-fav-btn ${favorite ? "active" : ""}`}
            onClick={toggleFavorite}
          >
            {favorite ? "♥ In favorites" : "♡ Add to favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails
