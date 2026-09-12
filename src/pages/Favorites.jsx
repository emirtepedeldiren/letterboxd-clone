import '../css/Favorites.css'
import { useMovieContext } from '../contexts/MovieContext'
import MovieCard from '../components/MovieCard'

function Favorite() {
    const { favorites } = useMovieContext()

    console.log("Favorites:", favorites)
    console.log("Favorites length:", favorites.length)

    if (favorites.length === 0) {
        return (
            <div className="favorites-empty">
                <h3>No Favorite Movies Yet</h3>
                <p>Start adding movies to your favorites and they will appear here</p>
            </div>
        )
    }

    return (
        <div className="favorites">
            <div className="movies-grid">
                {favorites.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        </div>
    )
}

export default Favorite