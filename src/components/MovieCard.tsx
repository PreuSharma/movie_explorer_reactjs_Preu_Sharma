import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { deleteMovie } from "../services/MovieServices";
import { FaCrown } from "react-icons/fa";


interface MovieCardProps {
  id: number;
  posterUrl: string;
  title: string;
  userRole: string;
  duration?: number;
  rating?: number;
  premium?: boolean;
  userPlanType: "basic" | "premium";
  onDelete?: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  posterUrl,
  title,
  userRole,
  duration,
  rating,
  premium = false,
  userPlanType,
  onDelete,
}) => {
  const navigate = useNavigate();

  const isLocked = premium && userPlanType === "basic";

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      toast.error("Upgrade to premium to add this movie.");
      return;
    }

    const existingList = JSON.parse(localStorage.getItem("movieList") || "[]");
    const movieExists = existingList.some(
      (movie: { id: number }) => movie.id === id
    );

    if (!movieExists) {
      const updatedList = [...existingList, { id, title, posterUrl }];
      localStorage.setItem("movieList", JSON.stringify(updatedList));
      toast.success("Movie added to your list!");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/dashboard/add-movie", {
      state: {
        id,
        mode: "edit",
      },
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmed) return;

    const success = await deleteMovie(id);

    if (success && onDelete) {
      onDelete(id);
    }
    if (success) {
      toast.success("Movie deleted successfully!");
    } else {
      toast.error("Failed to delete movie!");
    }
  };

  const handleCardClick = () => {
    if (isLocked) {
      toast.error("This is a premium movie. Upgrade your plan to access.");
      navigate("/dashboard/subscription");
      window.scrollTo(0,0);
      return;
    }
    else{
      navigate(`/dashboard/movie/${id}`);
    }
  };

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md bg-zinc-900 text-white hover:scale-105 transition-transform duration-300 ${
        isLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={handleCardClick}
    >
      {/* Lock Overlay if Premium Locked */}
      {isLocked && (
        <div className="absolute inset-0 bg-transparent bg-opacity-50 flex items-start justify-end z-20 text-red-600 text-bold">
          <FiLock size={20} className="text-red" />
        </div>
      )}

      {premium && (
  <div className="absolute top-50 left-4 z-20 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
    <FaCrown className="text-yellow-800" size={12} />
    
  </div>
)}


      {/* Add to List Button */}
      <button
        onClick={handleAddToList}
        title="Add to List"
        className="absolute rounded-lg z-10 w-10 h-14 bg-black backdrop-blur-sm bg-blue-500/20 text-red-600 flex items-center justify-center text-xl font-bold hover:scale-115 transition-transform duration-500 cursor-pointer"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)" }}
      >
        +
      </button>

      {/* Movie Poster */}
      <img src={posterUrl} alt={title} className="w-48 h-64 object-cover" />

      {/* Title */}
      <div className="p-2 text-center">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>

      {/* Duration */}
      {duration && (
        <div className="absolute bottom-10 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {duration} min
        </div>
      )}

      {/* Rating */}
      {rating && (
        <div className="absolute bottom-10 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {rating} ⭐
        </div>
      )}

      {/* Supervisor Options */}
      {userRole === "supervisor" && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button
            aria-label="Edit"
            onClick={handleEdit}
            className="bg-gray-800 text-white px-2 py-1 text-xs rounded hover:bg-white hover:text-gray-800 cursor-pointer"
          >
            <FiEdit />
          </button>
          <button
            aria-label="Delete"
            onClick={handleDelete}
            className="bg-gray-800 text-white px-2 py-1 text-xs rounded hover:bg-white hover:text-gray-800 cursor-pointer"
          >
            <FiTrash2 />
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
