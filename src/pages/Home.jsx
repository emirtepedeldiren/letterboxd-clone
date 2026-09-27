import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  searchMovies,
  getPopularMovies,
  getMoviesByGenre,
  getMoviesBySort
} from "../services/api.js";
import "../css/Home.css";

const formatDate = (date) => date.toISOString().split("T")[0];

const getSortQuery = (sortBy) => {
  const today = new Date();

  switch (sortBy) {
    case "top_rated":
      return "vote_average.desc&vote_count.gte=200";

    case "trending": {
      const monthAgo = new Date();
      monthAgo.setDate(today.getDate() - 30);
      return `popularity.desc&primary_release_date.gte=${formatDate(monthAgo)}&primary_release_date.lte=${formatDate(today)}`;
    }

    case "upcoming": {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      return `popularity.desc&primary_release_date.gte=${formatDate(tomorrow)}`;
    }

    case "now_playing": {
      const sixWeeksAgo = new Date();
      sixWeeksAgo.setDate(today.getDate() - 42);
      return `popularity.desc&primary_release_date.gte=${formatDate(sixWeeksAgo)}&primary_release_date.lte=${formatDate(today)}`;
    }

    case "popular":
    default:
      return "popularity.desc";
  }
};

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const location = useLocation();

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchQuery.trim()) return;

      try {
        setLoading(true);
        let data;
        const genreId = selectedCategory === "all" ? null : selectedCategory;

        if (sortBy === "popular") {
          data = genreId
            ? await getMoviesByGenre(genreId, currentPage)
            : await getPopularMovies(currentPage);
        } else {
          data = await getMoviesBySort(getSortQuery(sortBy), currentPage, genreId);
        }

        setMovies(data.results || []);
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
  }, [currentPage, selectedCategory, sortBy]);

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage(1);
    }
  }, [location.key, location.pathname]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    setCurrentPage(1);
    setSelectedCategory("all");

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
          <div className="filters">
            <div className="categorization">
              <label htmlFor="genre">Genre</label>

              <select
                id="genre"
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

            <div className="popularity-filter">
              <label htmlFor="popularity">Sort By</label>

              <select
                id="popularity"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="popular">Popular</option>
                <option value="top_rated">Top Rated</option>
                <option value="trending">Trending</option>
                <option value="upcoming">Upcoming</option>
                <option value="now_playing">Now Playing</option>
              </select>
            </div>
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
          <div className="footer">
              <Footer/>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
