import React, { useRef, useEffect, useState, useCallback } from "react";
import MovieCard from "./MovieCard";
import {
  getMoviesByGenre,
  searchMoviesByTitle,
} from "../services/MovieServices";
import { useSubscription } from "../context/SubscriptionContext";

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  premium: boolean;

  poster_url: string;
  banner_url: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface MovieResponse {
  movies: Movie[];
  pagination: Pagination;
}

interface MovieListingPageProps {
  search: string;
  genre: string;
  setGenre: (value: string) => void;
}

const MovieListing: React.FC<MovieListingPageProps> = ({
  search,
  genre,
  setGenre,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Top Rated");
  const [allFetchedMovies, setAllFetchedMovies] = useState<Movie[]>([]);
  const { planType } = useSubscription();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteMovie = (deletedId: number) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== deletedId));
    setAllFetchedMovies((prev) =>
      prev.filter((movie) => movie.id !== deletedId)
    );
  };

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userRole = userData.role || "viewer";

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let response: MovieResponse;
      let fetchedMovies: Movie[] = [];

      if (search.trim()) {
        response = await searchMoviesByTitle(search, page);
        fetchedMovies = response.movies || [];
        setHasMore(
          response.pagination?.current_page < response.pagination?.total_pages
        );
      } else {
        response = await getMoviesByGenre(genre, page);
        fetchedMovies = response.movies || [];
        setHasMore(
          response.pagination?.current_page < response.pagination?.total_pages
        );
      }

      if (selectedCategory === "Top Rated") {
        fetchedMovies.sort((a, b) => b.rating - a.rating);
      } else if (selectedCategory === "Latest by Year") {
        fetchedMovies.sort((a, b) => b.release_year - a.release_year);
      }

      if (page === 1) {
        setAllFetchedMovies(fetchedMovies);
        setMovies(fetchedMovies);
      } else {
        setAllFetchedMovies((prev) => [...prev, ...fetchedMovies]);
        setMovies((prev) => [...prev, ...fetchedMovies]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [genre, page, search, selectedCategory]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    setAllFetchedMovies([]);
    setHasMore(true);
  }, [genre, search, selectedCategory]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="w-full p-4 md:p-8 lg:p-12 bg-black min-h-screen">
      {/* Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 text-white">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {["Top Rated", "Latest by Year"].map((category) => (
            <button
              key={category}
              className={`transition-all duration-300 text-sm sm:text-base md:text-lg font-semibold px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-white text-black shadow-md"
                  : "bg-gray-800 hover:bg-white hover:text-black"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Genre Dropdown */}
        <div className="flex justify-center md:justify-end">
          <select
            className="transition-all duration-300 border border-gray-600 px-4 py-2 rounded-full bg-gray-800 text-white text-sm sm:text-base focus:outline-none hover:border-white"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Romance">Romance</option>
            <option value="Drama">Drama</option>
            <option value="horrror">Horror</option>
            <option value="Crime">Crime</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 cursor-pointer">
        {movies.length === 0 && !loading && (
          <p className="text-white col-span-full text-center">
            No movies found{search ? ` for "${search}"` : ""}.
          </p>
        )}
        {movies.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <MovieCard
              id={movie.id}
              posterUrl={movie.poster_url}
              title={movie.title}
              duration={movie.duration}
              rating={movie.rating}
              userRole={userRole}
              premium={movie.premium}
              userPlanType={planType || "basic"} 
              onDelete={handleDeleteMovie}
            />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-1"></div>

      {loading && (
        <div role="status" className="flex justify-center my-6">
          <div
            className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"
            aria-label="Loading"
          ></div>
        </div>
      )}

      {/* Continue Watching Section */}
      {!search && (
        <div className="mt-12 text-white">
          <h2 className="text-2xl mb-4">Continue Watching</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 cursor-pointer">
            {allFetchedMovies.slice(0, 3).map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard
                  id={movie.id}
                  posterUrl={movie.poster_url}
                  title={movie.title}
                  duration={movie.duration}
                  rating={movie.rating}
                  userRole={userRole}
                  premium={movie.premium}
                  userPlanType={planType || "basic"} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListing;
