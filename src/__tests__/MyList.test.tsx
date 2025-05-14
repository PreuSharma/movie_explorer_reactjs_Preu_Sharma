import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyList from "../pages/MyList";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
}));

jest.mock("../components/Header", () => () => <div data-testid="header" />);
jest.mock("../components/Footer", () => () => <div data-testid="footer" />);

describe("MyList Component", () => {
  const mockMovies = [
    { id: 1, title: "Movie One", posterUrl: "https://example.com/one.jpg" },
    { id: 2, title: "Movie Two", posterUrl: "https://example.com/two.jpg" },
  ];

  beforeEach(() => {
    localStorage.setItem("movieList", JSON.stringify(mockMovies));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders correctly with movies from localStorage", () => {
    render(<MyList />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Movie One")).toBeInTheDocument();
    expect(screen.getByText("Movie Two")).toBeInTheDocument();
  });

  it('shows "No movies added yet." when movie list is empty', () => {
    localStorage.setItem("movieList", JSON.stringify([]));
    render(<MyList />);
    expect(screen.getByText("No movies added yet.")).toBeInTheDocument();
  });

  it("removes a movie when Delete is clicked", () => {
    render(<MyList />);
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText("Movie One")).not.toBeInTheDocument();
    expect(screen.getByText("Movie Two")).toBeInTheDocument();

    expect(toast.success).toHaveBeenCalledWith("Movie removed from your list!");

    const updatedList = JSON.parse(localStorage.getItem("movieList") || "[]");
    expect(updatedList.length).toBe(1);
    expect(updatedList[0].title).toBe("Movie Two");
  });
});
