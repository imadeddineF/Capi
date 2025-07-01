import Cookies from "js-cookie";
import axios from "axios";
import { BASEURL } from "@/utils/base-url";

export async function logoutAction(): Promise<{ success: boolean }> {
  const refreshToken = Cookies.get("auth_token");

  if (refreshToken) {
    try {
      await axios.post(
        `${BASEURL}/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
          withCredentials: true, // Include cookies in the request
          timeout: 10000, // 10 second timeout
        }
      );
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Error during logout:", error.message);
      // Don't throw error for logout - just clear cookies locally
    }
  }

  // Clear all auth cookies using the correct cookie names
  Cookies.remove("auth_token");
  Cookies.remove("admin_auth_token");
  Cookies.remove("user_id");

  return { success: true };
}
