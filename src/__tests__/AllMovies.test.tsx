import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AllMovies from "../pages/AllMovies";

// ✅ Mock components used inside AllMovies
jest.mock("../components/Header", () => (props: any) => (
  <div data-testid="header">Header - search: {props.search}</div>
));

jest.mock("../components/MovieListing", () => (props: any) => (
  <div data-testid="movie-listing">MovieListing - genre: {props.genre}</div>
));

jest.mock("../components/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));

describe("AllMovies Page", () => {
  it("renders Header, MovieListingPage, and Footer", () => {
    render(<AllMovies />);

    // Check for Header
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("search:"); // search prop should be passed

    // Check for MovieListingPage
    const listing = screen.getByTestId("movie-listing");
    expect(listing).toBeInTheDocument();
    expect(listing).toHaveTextContent("genre:");

    // Check for Footer
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });
});
