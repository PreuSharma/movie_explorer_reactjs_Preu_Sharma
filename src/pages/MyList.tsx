import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const MyList: React.FC = () => {
  const [search, setSearch] = React.useState<string>("");
  const [movieList, setMovieList] = useState<
    { id: number; title: string; posterUrl: string }[]
  >([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("movieList") || "[]");
    setMovieList(storedList);
  }, []);

  const handleDelete = (id: number) => {
    const updatedList = movieList.filter((movie) => movie.id !== id);
    setMovieList(updatedList);
    localStorage.setItem("movieList", JSON.stringify(updatedList));

    toast.success("Movie removed from your list!");
  };

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

        {/* Movie List Container */}
        <div>
          <h1 className="text-2xl font-bold text-center mb-4 text-white"></h1>

          {/* Movie Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 z-20">
            {movieList.length === 0 ? (
              <p className="text-center text-lg text-gray-500">
                No movies added yet.
              </p>
            ) : (
              movieList.map((movie, index) => (
                <div
                  key={movie.id}
                  className="relative rounded-lg overflow-hidden shadow-lg bg-zinc-800 text-white hover:scale-105 transition-transform duration-300 transform hover:rotate-3 animate-fly-in cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-40 object-cover rounded-t-lg lg:h-80"
                    onClick={() => {
                    window.location.href = `/dashboard/movie/${movie.id}`;
                  }}
                  />
                  <div className="p-3 text-center">
                    <h2 className="text-sm font-semibold" >{movie.title}</h2>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-white hover:text-gray-800 cursor-pointer transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyList;
