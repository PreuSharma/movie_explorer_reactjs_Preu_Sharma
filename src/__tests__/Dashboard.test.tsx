// Removed unused React import
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import "@testing-library/jest-dom";

jest.mock("../components/Header", () => ({
  __esModule: true,
  default: ({ search }: any) => (
    <div data-testid="header">Mock Header - Search: {search}</div>
  ),
}));

jest.mock("../components/FeaturedBanner", () => ({
  __esModule: true,
  default: () => <div data-testid="featured-banner">Mock Featured Banner</div>,
}));

jest.mock("../components/MovieListing", () => ({
  __esModule: true,
  default: ({ search, genre }: any) => (
    <div data-testid="movie-listing">Mock Movie Listing - {search}, {genre}</div>
  ),
}));

jest.mock("../components/Subscription", () => ({
  __esModule: true,
  default: () => <div data-testid="subscription">Mock Subscription</div>,
}));

jest.mock("../components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Mock Footer</div>,
}));

describe("Dashboard Component", () => {
  it("renders all main sections", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("featured-banner")).toBeInTheDocument();
    expect(screen.getByTestId("movie-listing")).toBeInTheDocument();
    expect(screen.getByTestId("subscription")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("initial state values are passed correctly", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("header")).toHaveTextContent("Mock Header - Search:");
    expect(screen.getByTestId("movie-listing")).toHaveTextContent("Mock Movie Listing - ,");
  });

});
