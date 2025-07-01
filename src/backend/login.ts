// import { cookies } from "next/headers";
import axios from "axios";
import { BASEURL } from "@/utils/base-url";
import Cookies from "js-cookie";

interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
    };
    token: string;
  };
  code: number;
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  console.log("Login action called with email:", email);

  try {
    const response = await axios.post<LoginResponse>(
      `${BASEURL}/auth/login`,
      {
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
      const { user, token } = response.data.data;

      // Set cookies for client-side access using the correct cookie name
      const tokenOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      Cookies.set("auth_token", token, tokenOptions);
      Cookies.set("user_id", user.id.toString(), tokenOptions);

      return { success: true, user };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error: any) {
    console.error("Login failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    let errorMessage = "Login failed";

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
