import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addMovie,
  getMoviesById,
  updateMovie,
} from "../services/MovieServices";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const AddMovie: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    release_year: "",
    duration: "",
    description: "",
    premium: false,
    rating: "",
    director: "",
    posterUrl: "",
    bannerUrl: "",
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [movieId, setMovieId] = useState<number | null>(null);
  const [search, setSearch] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (location.state?.mode === "edit" && location.state.id) {
        setLoading(true);
        const movie = await getMoviesById(location.state.id);
        if (movie) {
          setFormData({
            title: movie.title || "",
            genre: movie.genre || "",
            release_year: movie.release_year?.toString() || "",
            duration: movie.duration?.toString() || "",
            description: movie.description || "",
            premium: movie.premium || false,
            rating: movie.rating?.toString() || "",
            director: movie.director || "",

            posterUrl: movie.poster_url || "",
            bannerUrl: movie.banner_url || "",
          });
          setMovieId(movie.id);
        }
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [location.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (e.target.name === "poster") {
        setPoster(file);
      } else if (e.target.name === "banner") {
        setBanner(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      setLoading(true);

    try {
      if (movieId) {
        await updateMovie(movieId, {
          ...formData,
          poster: poster ?? undefined,
          banner: banner ?? undefined,
        });

        toast.success("Movie updated successfully!");
        navigate("/dashboard");
      } else {
        const data = new FormData();
        if (poster) data.append("movie[poster]", poster);
        if (banner) data.append("movie[banner]", banner);

        Object.entries(formData).forEach(([key, value]) => {
          data.append(`movie[${key}]`, value.toString());
        });

        await addMovie(data);
        toast.success("Movie added successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      const msg = error.message || "Something went wrong.";
      setMessage(msg);
      toast.error(msg);
    }
    finally {
    setLoading(false);
  }
  };

  if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
    </div>
  );
}


  return (
    <div>
      <Header search={search} setSearch={setSearch} />

      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-4">
        <div
          className="absolute inset-0 z-0"></div>
        <div className="relative z-10 w-full max-w-xl bg-gray-900 text-white rounded-lg shadow-2xl p-8 space-y-6 backdrop-blur-md bg-opacity-80">
          <h2 className="text-3xl font-bold text-center text-red-700 animate-pulse">
            🎬 {movieId ? "Edit Movie" : "Add Movie"}
          </h2>

          {message && (
            <p className="text-center text-sm text-green-400">{message}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Text Inputs */}
            {["title", "release_year", "duration", "director"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                value={(formData as any)[field]}
                onChange={handleChange}
                required
                className="w-full p-3 bg-black bg-opacity-50 border border-cyan-600 text-white rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ))}

            {/* Genre Dropdown */}
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black bg-opacity-50 border border-cyan-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="">Select Genre</option>
              {["Action", "Drama", "Romance", "horrror", "Sci-Fi", "Crime"].map(
                (genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                )
              )}
            </select>

            {/* Rating Dropdown */}
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black bg-opacity-50 border border-cyan-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="">Select Rating</option>
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            {/* Description */}
            <textarea
              name="description"
              placeholder="DESCRIPTION"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 bg-black bg-opacity-50 border border-cyan-600 text-white rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Premium Checkbox */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <label className="text-sm" htmlFor="premium">
                Premium:
              </label>
              <input
                id="premium"
                type="checkbox"
                name="premium"
                checked={formData.premium}
                onChange={handleChange}
                className="accent-cyan-500 w-5 h-5"
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-2 cursor-pointer">
              <label htmlFor="poster">Poster</label>
              <input
                id="poster"
                type="file"
                accept="image/*"
                name="poster"
                onChange={handleFileChange}
                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
              {formData.posterUrl && (
                <img
                  src={formData.posterUrl}
                  alt="Poster Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}

              <label htmlFor="banner">Banner</label>
              <input
                id="banner"
                type="file"
                accept="image/*"
                name="banner"
                onChange={handleFileChange}
                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
              {formData.bannerUrl && (
                <img
                  src={formData.bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-md font-semibold cursor-pointer"
            >
              {movieId ? "Update Movie" : "Add Movie"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddMovie;
