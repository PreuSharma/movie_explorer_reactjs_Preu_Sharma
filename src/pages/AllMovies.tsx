import { useState } from "react";
import MovieListingPage from "../components/MovieListing";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AllMovies: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [genre, setGenre] = useState<string>("");

  return (
    <div>
      <Header search={search} setSearch={setSearch} />

      {/* Black background with animated glowing circles */}
      <div className="relative p-6 min-h-screen bg-black overflow-hidden flex items-center justify-center">
        {/* Glowing Circles Animation (Behind Content) */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="animate-pulse absolute bg-gradient-to-r from-blue-400 to-pink-500 opacity-60 rounded-full w-96 h-96 top-1/4 left-1/4"></div>
          <div className="animate-spin absolute bg-gradient-to-r from-yellow-400 to-red-500 opacity-50 rounded-full w-72 h-72 top-1/2 left-1/4"></div>
          <div className="animate-pulse absolute bg-gradient-to-r from-green-400 to-teal-500 opacity-70 rounded-full w-48 h-48 top-1/3 left-2/3"></div>
          <div className="animate-pulse absolute bg-gradient-to-r from-purple-400 to-indigo-500 opacity-40 rounded-full w-64 h-64 top-1/2 left-1/8"></div>

          {/* Add animated scaling and color-changing circles */}
          <div className="animate-pulse absolute bg-gradient-to-r from-indigo-600 to-green-500 opacity-30 rounded-full w-120 h-120 top-3/4 left-1/8 transform scale-125"></div>
          <div className="animate-ping absolute bg-gradient-to-r from-red-500 to-yellow-500 opacity-80 rounded-full w-60 h-60 top-1/3 left-1/2"></div>
        </div>

        {/* Movie Listing Page */}
        <MovieListingPage search={search} genre={genre} setGenre={setGenre} />
      </div>

      <Footer />
    </div>
  );
};

export default AllMovies;
