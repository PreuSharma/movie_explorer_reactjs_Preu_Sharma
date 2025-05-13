import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubscriptionPage from "../components/Subscription";
import "@testing-library/jest-dom";
import * as subscriptionService from "../services/Subscription";
import { BrowserRouter as Router } from "react-router-dom";

// Mock window.location.href
delete (window as any).location;
(window as any).location = { href: "" };

jest.mock("../services/Subscription");

describe("SubscriptionPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all subscription plans", () => {
    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    expect(screen.getByText("1 Day Pass")).toBeInTheDocument();
    expect(screen.getByText("1 Month Pass")).toBeInTheDocument();
    expect(screen.getByText("3 Month Premium")).toBeInTheDocument();
  });

  test("updates button text to 'Selected' when plan is chosen", () => {
    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    const chooseButtons = screen.getAllByText("Choose", { selector: "button" });
    fireEvent.click(chooseButtons[0]);

    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  test("shows confirmation section and 'Subscribe Now' after selecting a plan", () => {
    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    const chooseButtons = screen.getAllByText("Choose", { selector: "button" });
    fireEvent.click(chooseButtons[0]);

    expect(screen.getByText("Confirm Your Subscription")).toBeInTheDocument();
    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  test("calls createSubscription and redirects on success", async () => {
    const mockUrl = "https://mock-checkout.com";
    (subscriptionService.createSubscription as jest.Mock).mockResolvedValueOnce(mockUrl);

    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    fireEvent.click(screen.getAllByText("Choose", { selector: "button" })[0]);
    fireEvent.click(screen.getByText("Subscribe Now"));

    await waitFor(() => {
      expect(subscriptionService.createSubscription).toHaveBeenCalled();
      expect(window.location.href).toBe(mockUrl);
    });
  });

  test("shows error message on API failure", async () => {
    (subscriptionService.createSubscription as jest.Mock).mockRejectedValueOnce(
      new Error("Subscription failed")
    );

    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    fireEvent.click(screen.getAllByText("Choose", { selector: "button" })[0]);
    fireEvent.click(screen.getByText("Subscribe Now"));

    await waitFor(() => {
      expect(screen.getByText("Subscription failed")).toBeInTheDocument();
    });
  });

  test("does not show 'Subscribe Now' if no plan is selected", () => {
    render(
      <Router>
        <SubscriptionPage />
      </Router>
    );

    expect(screen.queryByText("Subscribe Now")).not.toBeInTheDocument();
  });
});
