import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import { logoutUser } from "../services/userServices";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { searchMoviesByTitle } from "../services/MovieServices";


interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

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

const Header: React.FC<SearchProps> = memo(({ search, setSearch }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 10,
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    console.log("userData", userData);

    const token = localStorage.getItem("token");
    if (userData && token) {
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserRole(userData.role);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setMovieResults([]);
        setCurrentPage(1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = useCallback(async (title: string, page: number) => {
    if (title.trim() === "") {
      setMovieResults([]);
      setIsSearching(false);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      });
      return;
    }

    try {
      setIsSearching(true);
      const response: MovieResponse = await searchMoviesByTitle(title, page);
      setMovieResults(response.movies);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to fetch movies. Please try again.");
      setMovieResults([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (value: string, page: number) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        handleSearch(value, page);
      }, 400);
    },
    [handleSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setCurrentPage(1);
      debouncedSearch(value, 1);
    },
    [setSearch, debouncedSearch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.total_pages) {
        setCurrentPage(newPage);
        debouncedSearch(search, newPage);
      }
    },
    [search, pagination.total_pages, debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    setMovieResults([]);
    setCurrentPage(1);
    setPagination({
      current_page: 1,
      total_pages: 1,
      total_count: 0,
      per_page: 10,
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setSearch]);

  const toggleSearch = useCallback(() => {
    setShowSearch((prev) => {
      if (prev) {
        setMovieResults([]);
        setCurrentPage(1);
        setSearch("");
      }
      return !prev;
    });
  }, [setSearch]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await logoutUser();
      toast.success(`Logout Successful: ${response.message || "OK"}`);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      toast.error(error.message);
    }
  }, []);

  return (
    <header className="bg-black text-white px-4 py-4 flex items-center justify-between flex-wrap relative shadow-md z-50">
      {/* Logo and Mobile Toggle */}
      <div className="flex items-center space-x-4 ">
        <h1
          className="text-xl font-bold tracking-wide mt-1 cursor-pointer"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Movie Explorer <span className="text-red-600">+</span>
        </h1>
        <button
          className="md:hidden" aria-label="menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <FiX className="text-2xl mt-3" />
          ) : (
            <FiMenu className="text-2xl mt-2" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 text-md font-medium">
        {[
          { name: "Home", path: "/dashboard" },
          { name: "Movies", path: "/dashboard/movies" },
          { name: "My List", path: "/dashboard/my-list" },
          { name: "Subscription", path: "/dashboard/subscription" },
        ].map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`cursor-pointer transition ${
                isActive ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
        {isLoggedIn &&
          userRole === "supervisor" &&
          (() => {
            const isActive = location.pathname === "/dashboard/add-movie";

            return (
              <Link
                to="/dashboard/add-movie"
                className={`cursor-pointer transition ${
                  isActive ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                Add Movie
              </Link>
            );
          })()}
      </nav>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 mt-3 md:mt-0 relative">
        {/* Search Icon + Dropdown */}
        <div className="relative" ref={searchRef}>
          <FiSearch aria-label="search"
            className="text-xl cursor-pointer hover:text-red-600 transition" 
            onClick={toggleSearch}
          />
          {showSearch && (
            <div className="absolute top-8 right-0 sm:right-2 text-black rounded-xl shadow-lg p-4 w-96 max-w-[80vw] z-20">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  data-testid="search-input"
                  placeholder="Search movies..."
                  value={search}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none"
                />
                <FiSearch aria-label="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                    aria-label="clear"
                  >
                    <FiX className="text-xl" />
                  </button>
                )}
              </div>
              {/* Search Results */}
              <div className="mt-4 max-h-80 overflow-y-auto">
                {isSearching && (
                  <p className="text-sm text-gray-500 px-2 py-1">
                    Searching...
                  </p>
                )}
                {!isSearching && movieResults.length === 0 && search && (
                  <p className="text-sm text-gray-500 px-2 py-1">
                    No results found.
                  </p>
                )}
                {!isSearching &&
                  movieResults.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/dashboard/movie/${movie.id}`}
                      className="block p-2 bg-white hover:bg-gray-200 rounded transition"
                      onClick={() => {
                        setShowSearch(false);
                        setMovieResults([]);
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/48x64?text=No+Image";
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">{movie.title}</p>
                          <p className="text-xs text-gray-600">
                            {movie.release_year} • {movie.genre} •{" "}
                            {movie.rating}/10
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              {/* Pagination */}
              {!isSearching &&
                movieResults.length > 0 &&
                pagination.total_pages > 1 && (
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.current_page} of {pagination.total_pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.total_pages}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Profile Dropdown or Login Link */}
        {isLoggedIn ? (
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:ring-2 hover:ring-red-600 transition"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            {showDropdown && (
              <div className="absolute top-12 right-0 sm:right-2 bg-white text-black rounded-xl shadow-lg p-4 w-64 max-w-[90vw] z-20">
                <p className="font-semibold text-base sm:text-lg mb-1">
                  Welcome, {userName}
                </p>
                <p className="text-sm text-gray-700 break-words">
                  Email: {userEmail}
                </p>
                <p className="text-sm text-gray-700 mb-4 break-words">
                  Role: {userRole}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-white hover:text-red-600 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="w-full mt-4 flex flex-col space-y-2 text-sm md:hidden transition-all bg-black px-4 pb-4" data-testid="mobile-nav">
          {(() => {
            return [
              { name: "Home", path: "/dashboard" },
              { name: "Movies", path: "/dashboard/movies" },
              { name: "My List", path: "/dashboard/my-list" },
              { name: "Subscription", path: "/dashboard/subscription" },
            ].map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`cursor-pointer transition ${
                    isActive ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  {item.name}
                </Link>
              );
            });
          })()}
          {isLoggedIn &&
            userRole === "supervisor" &&
            (() => {
              const isActive = location.pathname === "/dashboard/add-movie";

              return (
                <Link
                  to="/dashboard/add-movie"
                  className={`cursor-pointer transition ${
                    isActive ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  Add Movie
                </Link>
              );
            })()}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="cursor-pointer transition hover:text-red-500"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
});

export default Header;
