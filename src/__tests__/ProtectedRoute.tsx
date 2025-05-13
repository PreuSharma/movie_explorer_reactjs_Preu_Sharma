import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

describe("ProtectedRoute", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("renders child component when token is present", () => {
    localStorage.setItem("token", "dummy-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects to login when token is not present", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Required")).toBeInTheDocument();
  });
});
