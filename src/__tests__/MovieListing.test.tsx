import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieListing from "../components/MovieListing"; // Adjust the path
import * as MovieServices from "../services/MovieServices";
import { SubscriptionProvider } from "../context/SubscriptionContext";

beforeAll(() => {
  global.IntersectionObserver = class {
    root: Element | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
});


// Mocking MovieCard
jest.mock("../components/MovieCard", () => ({ 
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

// Mock API methods
jest.mock("../services/MovieServices");

const mockedGetMoviesByGenre = MovieServices.getMoviesByGenre as jest.Mock;
const mockedSearchMoviesByTitle = MovieServices.searchMoviesByTitle as jest.Mock;

const renderComponent = (search = "", genre = "") => {
  const setGenre = jest.fn();
  return render(
    <SubscriptionProvider>
      <MovieListing search={search} genre={genre} setGenre={setGenre} />
    </SubscriptionProvider>
  );
};

describe("MovieListing Component", () => {
  beforeEach(() => {
    localStorage.setItem("userData", JSON.stringify({ role: "admin" }));
    mockedGetMoviesByGenre.mockReset();
    mockedSearchMoviesByTitle.mockReset();
  });

  test("renders movies based on genre", async () => {
    mockedGetMoviesByGenre.mockResolvedValueOnce({
      movies: [
        { id: 1, title: "Movie A", duration: 120, rating: 4.5, poster_url: "", premium: false },
      ],
      pagination: { current_page: 1, total_pages: 1, total_count: 1, per_page: 10 },
    });

    renderComponent();

    await waitFor(() => {
      const movieElements = screen.getAllByText("Movie A");
      expect(movieElements.length).toBeGreaterThan(0);
    });
  });

  test("renders movies based on search", async () => {
    mockedSearchMoviesByTitle.mockResolvedValueOnce({
      movies: [
        { id: 2, title: "Search Result", duration: 110, rating: 4.8, poster_url: "", premium: true },
      ],
      pagination: { current_page: 1, total_pages: 1, total_count: 1, per_page: 10 },
    });

    renderComponent("search term");

    await waitFor(() => {
      expect(screen.getByText("Search Result")).toBeInTheDocument();
    });
  });

  test("displays 'No movies found' when movie list is empty", async () => {
    mockedGetMoviesByGenre.mockResolvedValueOnce({
      movies: [],
      pagination: { current_page: 1, total_pages: 1, total_count: 0, per_page: 10 },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/No movies found/)).toBeInTheDocument();
    });
  });

  test("changes genre using dropdown", async () => {
    mockedGetMoviesByGenre.mockResolvedValue({
      movies: [],
      pagination: { current_page: 1, total_pages: 1, total_count: 0, per_page: 10 },
    });

    const setGenre = jest.fn();
    const { getByRole, rerender } = render(
      <SubscriptionProvider>
        <MovieListing search="" genre="" setGenre={setGenre} />
      </SubscriptionProvider>
    );
    const select = getByRole("combobox") as HTMLSelectElement;

    act(() => {
      fireEvent.change(select, { target: { value: "Action" } });
      setGenre("Action");
    });

    rerender(
      <SubscriptionProvider>
        <MovieListing search="" genre="Action" setGenre={setGenre} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(select.value).toBe("Action");
    });
  });

  test("renders Continue Watching section if no search", async () => {
    mockedGetMoviesByGenre.mockResolvedValueOnce({
      movies: [
        { id: 3, title: "Watch Later", duration: 90, rating: 3.5, poster_url: "", premium: false },
      ],
      pagination: { current_page: 1, total_pages: 1, total_count: 1, per_page: 10 },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Continue Watching")).toBeInTheDocument();
      const watchLaterElements = screen.getAllByText("Watch Later");
      expect(watchLaterElements.length).toBeGreaterThan(0);
    });
  });
});
