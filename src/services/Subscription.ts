const BASE_URL = `https://movie-explorer-ror-amansharma.onrender.com`;

import axios from "axios";
import toast from "react-hot-toast";

export const createSubscription = async (planType: string): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      `${BASE_URL}/api/v1/subscriptions`,
      { plan_type: planType },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const checkoutUrl =
      response.data.checkoutUrl ||
      response.data.data?.checkoutUrl ||
      response.data.url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from server.");
    }

    return checkoutUrl;
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    throw new Error(error.message || "Failed to initiate subscription");
  }
};

export const getSubscriptionStatus = async (token: string) => {
  try {
    if (!token) {
      toast.error("You need to sign in first.");
      throw new Error("An unexpected error occurred");
    }

    const response = await axios.get(
      `${BASE_URL}/api/v1/subscriptions/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status ===200) {
    console.log("Subscription Status Response:", response.data);
    localStorage.setItem("subscriptionStatus", response.data.plan_type);
    }
    if ("error" in response.data) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error("Subscription Status Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
    });
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch subscription status"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};




export const verifySubscription = async (sessionId: string, authToken: string) => {
  if (!sessionId) {
    throw new Error("No session ID found in the URL.");
  }

  if (!authToken) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const response = await axios.get(
    `https://movie-explorer-ror-amansharma.onrender.com/api/v1/subscriptions/success?session_id=${sessionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return response.data;
};
