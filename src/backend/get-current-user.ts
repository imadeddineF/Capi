import axios from "axios";
import { BASEURL } from "@/utils/base-url";
import Cookies from "js-cookie";

interface CurrentUserResponse {
  status: string;
  message: string;
  data: {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  };
  code: number;
}

export async function getCurrentUserAction(): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> {
  const token = Cookies.get("auth_token");

  if (!token) {
    return { success: false, error: "No authentication token found" };
  }

  try {
    const response = await axios.get<CurrentUserResponse>(
      `${BASEURL}/auth/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Include cookies in the request
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data.status === "success") {
      const user = response.data.data;
      return { success: true, user };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error: any) {
    console.error("Get current user failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    let errorMessage = "Failed to get current user";

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      errorMessage = "Request timeout. Please check your connection.";
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      errorMessage =
        "Cannot connect to server. Please check if the backend is running.";
    } else if (error.response?.status === 404) {
      errorMessage = "API endpoint not found. Please check the backend URL.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
}
