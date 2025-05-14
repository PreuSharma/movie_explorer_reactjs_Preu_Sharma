import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as MovieService from "../services/MovieServices";
import "@testing-library/jest-dom";

jest.mock("../components/Header", () => () => (
  <div data-testid="header">Header</div>
));
jest.mock("../components/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("../components/MovieListing", () => ({ search, genre }: any) => (
  <div data-testid="movie-listing">{`${search} - ${genre}`}</div>
));

describe("MovieDetailsPage", () => {
  const mockMovie = {
    id: 1,
    title: "Inception",
    description: "A mind-bending thriller.",
    genre: "Sci-Fi",
    release_year: 2010,
    rating: 8.8,
    main_lead: "Leonardo DiCaprio",
    director: "Christopher Nolan",
    streaming_platform: "Netflix",
    poster_url: "https://example.com/poster.jpg",
    banner_url: "https://example.com/banner.jpg",
    duration: 148,
    premium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Movie not found' when movieDetails is null", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockResolvedValue(mockMovie);

    render(
      <MemoryRouter initialEntries={["/movies/1"]}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("🎬 Movie not found")).toBeInTheDocument()
    );
  });

  it("fetches and displays movie details when valid movieId is given", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockResolvedValue(mockMovie);

    render(
      <MemoryRouter initialEntries={["/movies/1"]}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Inception")).toBeInTheDocument()
    );
    expect(screen.getByText("A mind-bending thriller.")).toBeInTheDocument();
    expect(screen.getByText(/Genre:/).closest("div")).toHaveTextContent(
      `Genre: ${mockMovie.genre}`
    );
    expect(screen.getByText(/Director:/).closest("div")).toHaveTextContent(
      `Director: ${mockMovie.director}`
    );

    expect(screen.getByTestId("movie-listing")).toHaveTextContent(
      `${mockMovie.genre}`
    );
  });

  it("calls getMoviesById with correct movieId", async () => {
    const spy = jest
      .spyOn(MovieService, "getMoviesById")
      .mockResolvedValue(mockMovie);

    render(
      <MemoryRouter initialEntries={["/movies/42"]}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(spy).toHaveBeenCalledWith(42));
  });

  it("handles fetch error gracefully", async () => {
    jest
      .spyOn(MovieService, "getMoviesById")
      .mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter initialEntries={["/movies/999"]}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("🎬 Movie not found")).toBeInTheDocument()
    );
  });

  it("renders Header and Footer", async () => {
    jest.spyOn(MovieService, "getMoviesById").mockResolvedValue(mockMovie);

    render(
      <MemoryRouter initialEntries={["/movies/5"]}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });
});
