const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );

    const data = await response.json();

    return data;
};

export const searchMovies = async (query, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    const data = await response.json();

    return data;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await response.json();
  return data;
};

export const getMoviesBySort = async (sortId, page = 1, genreId = null) => {
  const genreParam = genreId ? `&with_genres=${genreId}` : "";
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortId}${genreParam}&page=${page}`
  );
  const data = await response.json();
  return data;
};

export const getMovieDetails = async (movieId) => {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
};

// Filtrelere uyan filmler arasından rastgele bir tane seçer.
// Önce toplam sayfa sayısını öğrenir, sonra rastgele bir sayfadan rastgele bir film alır.
export const getRandomMovie = async ({ genreId = null, minRating = 0, excludeIds = [] } = {}) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    sort_by: "popularity.desc",
    include_adult: "false",
    "vote_count.gte": "100",
  });
  if (genreId) params.set("with_genres", genreId);
  if (minRating > 0) params.set("vote_average.gte", minRating);

  const discover = async (page) => {
    params.set("page", page);
    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    if (!response.ok) throw new Error("Failed to fetch movies");
    return response.json();
  };

  const first = await discover(1);
  // TMDB discover en fazla 500 sayfaya izin veriyor
  const totalPages = Math.min(first.total_pages || 0, 500);
  if (totalPages === 0) return null;

  const randomPage = Math.floor(Math.random() * totalPages) + 1;
  const data = randomPage === 1 ? first : await discover(randomPage);

  const withPoster = (data.results || []).filter((m) => m.poster_path);
  const fresh = withPoster.filter((m) => !excludeIds.includes(m.id));
  const pool = fresh.length > 0 ? fresh : withPoster;
  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
};
