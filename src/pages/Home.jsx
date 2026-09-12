import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchMovies, getPopularMovies } from "../services/api.js";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const location = useLocation();

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                setLoading(true);

                const popularMovies = await getPopularMovies(currentPage);

                setMovies(popularMovies.results);
                setTotalPages(popularMovies.total_pages);
                setError(null);

            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        };

        loadPopularMovies();
    }, [currentPage]);

    useEffect(() => {
      if (location.pathname === "/") {
          setCurrentPage(1);
      }
    }, [location.key]);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;
        if (loading) return;

        setLoading(true);
        setCurrentPage(1);

        try {
            const searchResults = await searchMovies(searchQuery, 1);

            setMovies(searchResults.results);
            setTotalPages(searchResults.total_pages);
            setError(null);

        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">

            <form onSubmit={handleSearch} className="search-form">

                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button type="submit" className="search-button">
                    Search
                </button>

            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <MovieCard
                                movie={movie}
                                key={movie.id}
                            />
                        ))}
                    </div>

                    <div className="pagination">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        
                    </div>
                </>
            )}

        </div>
    );
}

export default Home;