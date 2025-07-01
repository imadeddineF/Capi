import axios from "axios";
import { BASEURL } from "@/utils/base-url";
import Cookies from "js-cookie";

interface RegisterResponse {
  status?: string;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    dataSource: any;
    createdAt: string;
    updatedAt: string;
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
        withCredentials: true,
      }
    );

    console.log("Response data:", response.data);

    if (response.data.code < 400 && response.data.code >= 200) {
      const userData = response.data.data;

      const tokenOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      //   Cookies.set("auth_token", token, tokenOptions);
      Cookies.set("user_id", userData.id.toString(), tokenOptions);

      return { success: true, user: userData };
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
