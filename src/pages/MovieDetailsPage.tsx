import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMoviesById } from "../services/MovieServices";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieListingPage from "../components/MovieListing";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
       setLoading(true);
      if (movieId) {
        try {
          const movie = await getMoviesById(Number(movieId));
          setMovieDetails(movie || null);
          console.log("Movie ID:", movieId);
          window.scrollTo(0, 0); 
        } catch (error) {
          console.error("Error fetching movie details:", error);
          setMovieDetails(null);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchMovieDetails();
  }, [movieId]);

   if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}


  if (!movieDetails) {
    return <p className="text-white text-center">🎬 Movie not found</p>;
  }




  return (
    <div>
      <Header search={search} setSearch={setSearch} />

      <div className="relative w-full min-h-screen bg-black text-white">
        {/* 🔹 Background Blurred Poster + Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md"
          style={{
            backgroundImage: `url(${movieDetails.poster_url})`,
            zIndex: -1,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
        </div>

        {/* 🔹 Poster + Info Section */}
        <div className="relative z-10 pt-20 pb-12 px-4 sm:px-8 md:px-16 lg:px-32 flex flex-col md:flex-row items-center md:items-start gap-12">
          <img
            src={movieDetails.poster_url}
            alt={movieDetails.title}
            className="w-72 md:w-96 rounded-xl shadow-2xl object-cover transform hover:scale-105 transition duration-500"
          />

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-12 shadow-xl w-full text-white transition-all duration-300">
            <h1 className="text-4xl font-bold mb-4">{movieDetails.title}</h1>

            <p className="text-gray-200 text-lg mb-6 leading-relaxed">
              {movieDetails.description || "No description available."}
            </p>

            <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-300 mb-6">
              <span>
                🎭 <strong>Genre:</strong> {movieDetails?.genre}
              </span>
              <span>
                📅 <strong>Release:</strong> {movieDetails.release_year}
              </span>
              <span>
                ⭐ <strong>Rating:</strong> {movieDetails.rating}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm sm:text-base text-gray-300 mb-6">
              <span>
                📝 <strong>Director:</strong> {movieDetails.director}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-full text-white font-semibold shadow-md flex items-center gap-2 transition duration-300 cursor-pointer"
              onClick={() => {navigate(`/dashboard/my-list`)
                window.scrollTo(0, 0);
              }}>
               🔍 Explore From List
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 More Movies Section */}
        <div className="relative z-10 bg-black pt-12 pb-20 px-4 sm:px-8 md:px-16 lg:px-32">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white">
            Explore More in {movieDetails.genre}
          </h2>

          {/* Passing genre and search */}
          <MovieListingPage
            search={search}
            genre={movieDetails.genre}
            setGenre={() => {}}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
