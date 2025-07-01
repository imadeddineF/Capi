import axios from "axios";
import { BASEURL } from "@/utils/base-url";
import Cookies from "js-cookie";

interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
  };
  code: number;
}

export async function registerAction(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  console.log("Register action called with email:", email);

  try {
    const response = await axios.post<RegisterResponse>(
      `${BASEURL}/auth/register`,
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include cookies in the request
        timeout: 10000, // 10 second timeout
      }
    );

    console.log("Response data:", response.data);

    if (response.data.status === "success") {
      const user = response.data.data;
      return { success: true, user };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error: any) {
    console.error("Register failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    let errorMessage = "Registration failed";

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
