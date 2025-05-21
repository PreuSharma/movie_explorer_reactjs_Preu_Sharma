const API_URL = "https://movie-explorer-ror-amansharma.onrender.com";


interface LoginPayload {
  user: {
    email: string;
    password: string;
  };
}

export const signUpUser = async (user: {
  name: string;
  email: string;
  password: string;
  mobile_number: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });

    const data = await response.json();
    if (!response.ok) {
      // throw new Error(data.message || "Signup failed. Please try again.");
      const errorMessage =
    Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors.join(", ")
      : data.message || "Signup failed. Please try again.";
  throw new Error(errorMessage);
      
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong. Please try again.");
  }
};

export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await fetch(`${API_URL}/users/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Login response data:", data);
    
    return { data, status: response.status };
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/users/sign_out`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed.");
    }

    return { message: "Logout successful", status: response.status };
  } catch (error: any) {
    console.error("Logout API error:", error);
    throw new Error(error.message || "Something went wrong during logout.");
  }
};



export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      throw new Error("No user data found. User might not be logged in.");
    }

    const user = JSON.parse(userData);
    const authToken = user?.token;
    if (!authToken) {
      throw new Error("No authentication token found in user data.");
    }

    console.log("Sending FCM token to backend:", token);
    console.log("Using auth token:", authToken);

    const response = await fetch(`${API_URL}/api/v1/update_device_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ device_token: token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to send device token: ${response.status} ${
          response.statusText
        } - ${errorData.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Device token sent to backend successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending device token to backend:", error);
    throw error;
  }
};
