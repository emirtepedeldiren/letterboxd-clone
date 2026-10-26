import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/MovieCard.css'
import { useMovieContext } from '../contexts/MovieContext'

function MovieCard({movie}){

    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const favorite = isFavorite(movie.id)
    const navigate = useNavigate()
    const [imageFailed, setImageFailed] = useState(false)
    const showPoster = movie.poster_path && !imageFailed

    function onFavoriteClick(e) {
        e.preventDefault()
        // Tıklama karta kabarmasın, yoksa cardClick de çalışır
        e.stopPropagation()

        if(favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    function cardClick() {
        navigate(`/movie/${movie.id}`)
    }

    return <div className="movie-card" onClick={cardClick}>
        <div className="movie-poster">
            {showPoster ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="poster-placeholder">{movie.title}</div>
            )}
            <div className="movie-overlay">
                <button
                    className={`favorite-btn ${favorite ? "active" : ""}`}
                    onClick={onFavoriteClick}
                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >♥</button>
            </div>
        </div>
        <div className="movie-info">
            <h3 title={movie.title}>{movie.title}</h3>
            <div className="movie-meta">
                <span>{movie.release_date?.split("-")[0]}</span>
                {movie.vote_average > 0 && (
                    <span className="movie-score">★ {movie.vote_average.toFixed(1)}</span>
                )}
            </div>
        </div>
    </div>
}

export default MovieCard
