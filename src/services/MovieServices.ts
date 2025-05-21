import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://movie-explorer-ror-amansharma.onrender.com";


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

export const getAllMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const movies: Movie[] = response.data;
    console.log("fetched movies", movies);

    return movies;
  } catch (error: any) {
    console.log("error ", error.message);
  }
};

export const addMovie = async (
  formData: FormData
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${BASE_URL}/api/v1/movies`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to add movie");
  }

  return result;
};

export const getMoviesById = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/api/v1/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const movie: Movie = response.data;
    console.log("Fetched movie by ID:", movie);
    return movie;
  } catch (error: any) {
    console.error(`Error fetching movie with ID ${id}:`, error.message);
    return null;
  }
};

interface MovieResponse {
  movies: Movie[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export const getMoviesByGenre = async (
  genre: string,
  page: number = 1
): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params: {
        genre,
        page,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const movieData: MovieResponse = {
      movies: response.data.movies || [],
      pagination: response.data.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: response.data.movies?.length || 0,
        per_page: 10,
      },
    };

    console.log(`Fetched movies for genre ${genre}, page ${page}:`, movieData);
    return movieData;
  } catch (error: any) {
    console.error(
      `Error fetching movies for genre ${genre}, page ${page}:`,
      error.message
    );
    return {
      movies: [],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      },
    };
  }
};

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

export const searchMoviesByTitle = async (
  title: string,
  page: number = 1
): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/movies`, {
      params: {
        title,
        page,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const movieData: MovieResponse = {
      movies: response.data.movies || [],
      pagination: response.data.pagination || {
        current_page: page,
        total_pages: 1,
        total_count: response.data.movies?.length || 0,
        per_page: 10,
      },
    };

    console.log(`Fetched movies for title ${title}, page ${page}:`, movieData);
    return movieData;
  } catch (error: any) {
    console.error(
      `Error fetching movies for title ${title}, page ${page}:`,
      error.message
    );
    return {
      movies: [],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_count: 0,
        per_page: 10,
      },
    };
  }
};

interface MovieFormData {
  title: string;
  genre: string;
  release_year: string;
  director: string;
  duration: string;
  description: string;
  rating: string;
  premium: boolean;
  poster?: File;
  banner?: File;
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

export const updateMovie = async (
  id: number,
  formData: MovieFormData
): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    const releaseYearNum = Number(formData.release_year);
    const durationNum = Number(formData.duration);
    const ratingNum = Number(formData.rating);

    if (isNaN(releaseYearNum)) {
      toast.error("Release year must be a valid number.");
      return null;
    }

    const movieFormData = new FormData();
    movieFormData.append("movie[title]", formData.title);
    movieFormData.append("movie[genre]", formData.genre);
    movieFormData.append("movie[release_year]", releaseYearNum.toString());
    movieFormData.append("movie[director]", formData.director);
    movieFormData.append("movie[duration]", durationNum.toString());
    movieFormData.append("movie[description]", formData.description);
    movieFormData.append("movie[rating]", ratingNum.toString());
    movieFormData.append("movie[premium]", String(formData.premium));

    if (formData.poster) {
      movieFormData.append("movie[poster]", formData.poster);
    }

    if (formData.banner) {
      movieFormData.append("movie[banner]", formData.banner);
    }

    const response = await axios.patch(
      `${BASE_URL}/api/v1/movies/${id}`,
      movieFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    const movie: Movie = response.data.movie;
    return movie;
  } catch (error: any) {
    console.error("Error updating movie:", error.message, error.response?.data);
    const errorMessage =
      error.response?.data?.error || "Failed to update movie";
    toast.error(errorMessage);
    return null;
  }
};

export const deleteMovie = async (id: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    await axios.delete(`${BASE_URL}/api/v1/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log(`Movie with ID ${id} deleted successfully`);
    return true;
  } catch (error: any) {
    console.error("Error deleting movie:", error.message, error.response?.data);
    const errorMessage =
      error.response?.data?.error || "Failed to delete movie";
    toast.error(errorMessage);
    return false;
  }
};
