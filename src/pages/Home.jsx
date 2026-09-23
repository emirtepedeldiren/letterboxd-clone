import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchMovies, getPopularMovies, getMoviesByGenre } from "../services/api.js";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const location = useLocation();

  useEffect(() => {
    const fetchMovies = async () => {
      // Eğer kullanıcı arama yapıyorsa kategori/popüler filtresini tetikleme
      if (searchQuery.trim()) return;

      try {
        setLoading(true);
        let data;

        if (selectedCategory === "all") {
          data = await getPopularMovies(currentPage);
        } else {
          // Doğrudan API'den seçilen türe ait filmleri çekiyoruz
          data = await getMoviesByGenre(selectedCategory, currentPage);
        }

        setMovies(data.results || []);
        // TMDB max 500 sayfa kabul eder
        setTotalPages(Math.min(data.total_pages || 1, 500));
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage(1);
    }
  }, [location.key, location.pathname]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchQuery(""); // Kategori seçilince aramayı temizle
    setCurrentPage(1);  // Kategori değişince 1. sayfadan başlat
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    setCurrentPage(1);
    setSelectedCategory("all"); // Arama yaparken kategori filtresini sıfırla

    try {
      const searchResults = await searchMovies(searchQuery, 1);

      setMovies(searchResults.results || []);
      setTotalPages(Math.min(searchResults.total_pages || 1, 500));
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
          <div className="categorization">
            <label htmlFor="movie-category">Genres:</label>

            <select
              name="movie-category"
              id="movie-category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Genres</option>
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="80">Crime</option>
              <option value="99">Documentary</option>
              <option value="18">Drama</option>
              <option value="10751">Family</option>
              <option value="14">Fantasy</option>
              <option value="36">History</option>
              <option value="27">Horror</option>
              <option value="10402">Music</option>
              <option value="9648">Mystery</option>
              <option value="10749">Romance</option>
              <option value="878">Science Fiction</option>
              <option value="10770">TV Movie</option>
              <option value="53">Thriller</option>
              <option value="10752">War</option>
              <option value="37">Western</option>
            </select>
          </div>

          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))
            ) : (
              <p className="no-movies">No movies found.</p>
            )}
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
