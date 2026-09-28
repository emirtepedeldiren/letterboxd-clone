import '../css/Favorites.css'
import { Link } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'

function Favorite() {
    const { favorites } = useMovieContext()

    return (
        <div className="favorites">
            <div className="page-header">
                <h1 className="page-title">Favorites</h1>
                {favorites.length > 0 && (
                    <span className="page-subtitle">
                        {favorites.length} {favorites.length === 1 ? "film" : "films"}
                    </span>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="favorites-empty">
                    <h3>Nothing here yet</h3>
                    <p>Hover over a poster and hit ♥ to save it here.</p>
                    <Link to="/" className="favorites-empty-link">Browse movies</Link>
                </div>
            ) : (
                <div className="movies-grid">
                    {favorites.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorite
