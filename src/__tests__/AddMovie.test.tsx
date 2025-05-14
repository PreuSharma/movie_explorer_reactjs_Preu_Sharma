import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addMovie,
  getMoviesById,
  updateMovie,
} from "../services/MovieServices";
import AddMovie from "../pages/AddMovie";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("../services/MovieServices");
jest.mock("react-hot-toast");

const mockedUseLocation = useLocation as jest.Mock;
const mockedUseNavigate = useNavigate as jest.Mock;
const mockedAddMovie = addMovie as jest.Mock;
const mockedGetMoviesById = getMoviesById as jest.Mock;
const mockedUpdateMovie = updateMovie as jest.Mock;
const mockedToastSuccess = toast.success as jest.Mock;
const mockedToastError = toast.error as jest.Mock;

jest.mock("../components/Header", () => () => <div>Header</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);

describe("AddMovie Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(jest.fn());
    mockedUseLocation.mockReturnValue({ state: {} });
  });

  test("renders Add Movie form when not in edit mode", () => {
    render(<AddMovie />);
    expect(screen.getByText("🎬 Add Movie")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("TITLE")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GENRE")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("RELEASE YEAR")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("DURATION")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("RATING")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("DIRECTOR")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("DESCRIPTION")).toBeInTheDocument();
    expect(screen.getByLabelText("Poster")).toBeInTheDocument();
    expect(screen.getByLabelText("Banner")).toBeInTheDocument();
    expect(screen.getByLabelText("Premium:")).toBeInTheDocument();
    expect(screen.getByText("Add Movie")).toBeInTheDocument();
  });

  test("renders Edit Movie form when in edit mode", async () => {
    const mockMovie = {
      id: 1,
      title: "Test Movie",
      genre: "Action",
      release_year: 2023,
      duration: 120,
      description: "A test movie",
      premium: true,
      rating: "8.5",
      director: "John Doe",
      poster_url: "http://example.com/poster.jpg",
      banner_url: "http://example.com/banner.jpg",
    };
    mockedUseLocation.mockReturnValue({ state: { mode: "edit", id: 1 } });
    mockedGetMoviesById.mockResolvedValue(mockMovie);

    render(<AddMovie />);

    await waitFor(() => {
      expect(screen.getByText("🎬 Edit Movie")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("TITLE")).toHaveValue("Test Movie");
      expect(screen.getByPlaceholderText("GENRE")).toHaveValue("Action");
      expect(screen.getByPlaceholderText("RELEASE YEAR")).toHaveValue("2023");
      expect(screen.getByPlaceholderText("DURATION")).toHaveValue("120");
      expect(screen.getByPlaceholderText("RATING")).toHaveValue("8.5");
      expect(screen.getByPlaceholderText("DIRECTOR")).toHaveValue("John Doe");
      expect(screen.getByPlaceholderText("DESCRIPTION")).toHaveValue(
        "A test movie"
      );
      expect(screen.getByLabelText("Premium:")).toBeChecked();
      expect(screen.getByAltText("Poster Preview")).toHaveAttribute(
        "src",
        "http://example.com/poster.jpg"
      );
      expect(screen.getByAltText("Banner Preview")).toHaveAttribute(
        "src",
        "http://example.com/banner.jpg"
      );
    });
  });

  test("updates form data on input change", () => {
    render(<AddMovie />);
    const titleInput = screen.getByPlaceholderText("TITLE");
    fireEvent.change(titleInput, { target: { value: "New Movie" } });
    expect(titleInput).toHaveValue("New Movie");

    const premiumCheckbox = screen.getByLabelText("Premium:");
    fireEvent.click(premiumCheckbox);
    expect(premiumCheckbox).toBeChecked();
  });

  test("handles poster and banner file uploads", () => {
    render(<AddMovie />);
    const posterInput = screen.getByLabelText("Poster") as HTMLInputElement;
    const bannerInput = screen.getByLabelText("Banner") as HTMLInputElement;

    const posterFile = new File(["poster"], "poster.jpg", {
      type: "image/jpeg",
    });
    const bannerFile = new File(["banner"], "banner.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(posterInput, { target: { files: [posterFile] } });
    fireEvent.change(bannerInput, { target: { files: [bannerFile] } });

    expect(posterInput.files![0]).toBe(posterFile);
    expect(bannerInput.files![0]).toBe(bannerFile);
  });

  test("submits form to add a new movie", async () => {
    mockedAddMovie.mockResolvedValue({});
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    render(<AddMovie />);

    fireEvent.change(screen.getByPlaceholderText("TITLE"), {
      target: { value: "New Movie" },
    });
    fireEvent.change(screen.getByPlaceholderText("GENRE"), {
      target: { value: "Action" },
    });
    fireEvent.change(screen.getByPlaceholderText("RELEASE YEAR"), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByPlaceholderText("DURATION"), {
      target: { value: "120" },
    });
    fireEvent.change(screen.getByPlaceholderText("RATING"), {
      target: { value: "8.5" },
    });
    fireEvent.change(screen.getByPlaceholderText("DIRECTOR"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("DESCRIPTION"), {
      target: { value: "A new movie" },
    });

    const posterFile = new File(["poster"], "poster.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(screen.getByLabelText("Poster"), {
      target: { files: [posterFile] },
    });

    fireEvent.click(screen.getByText("Add Movie"));

    await waitFor(() => {
      expect(mockedAddMovie).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockedToastSuccess).toHaveBeenCalledWith(
        "Movie added successfully!"
      );
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("submits form to update an existing movie", async () => {
    mockedUseLocation.mockReturnValue({ state: { mode: "edit", id: 1 } });
    mockedGetMoviesById.mockResolvedValue({
      id: 1,
      title: "Test Movie",
      genre: "Action",
      release_year: 2023,
      duration: 120,
      description: "A test movie",
      premium: true,
      rating: "8.5",
      director: "John Doe",
      poster_url: "http://example.com/poster.jpg",
      banner_url: "http://example.com/banner.jpg",
    });
    mockedUpdateMovie.mockResolvedValue({});
    const navigate = jest.fn();
    mockedUseNavigate.mockReturnValue(navigate);

    render(<AddMovie />);

    await waitFor(() => {
      expect(screen.getByText("🎬 Edit Movie")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("TITLE"), {
      target: { value: "Updated Movie" },
    });
    fireEvent.click(screen.getByText("Update Movie"));

    await waitFor(() => {
      expect(mockedUpdateMovie).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "Updated Movie",
        })
      );
      expect(mockedToastSuccess).toHaveBeenCalledWith(
        "Movie updated successfully!"
      );
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays error message on form submission failure", async () => {
    mockedAddMovie.mockRejectedValue(new Error("Failed to add movie"));
    render(<AddMovie />);

    fireEvent.change(screen.getByPlaceholderText("TITLE"), {
      target: { value: "New Movie" },
    });
    fireEvent.change(screen.getByPlaceholderText("GENRE"), {
      target: { value: "Action" },
    });
    fireEvent.change(screen.getByPlaceholderText("RELEASE YEAR"), {
      target: { value: "2023" },
    });
    fireEvent.change(screen.getByPlaceholderText("DURATION"), {
      target: { value: "120" },
    });
    fireEvent.change(screen.getByPlaceholderText("RATING"), {
      target: { value: "8.5" },
    });
    fireEvent.change(screen.getByPlaceholderText("DIRECTOR"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("DESCRIPTION"), {
      target: { value: "A new movie" },
    });

    fireEvent.click(screen.getByText("Add Movie"));

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith("Failed to add movie");
      expect(screen.getByText("Failed to add movie")).toBeInTheDocument();
    });
  });

  test("prevents form submission if required fields are empty", async () => {
    render(<AddMovie />);
    fireEvent.click(screen.getByText("Add Movie"));

    await waitFor(() => {
      expect(mockedAddMovie).not.toHaveBeenCalled();
      expect(screen.getByPlaceholderText("TITLE")).toBeInvalid();
      expect(screen.getByPlaceholderText("DESCRIPTION")).toBeInvalid();
    });
  });
});
