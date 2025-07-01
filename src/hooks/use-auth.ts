import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginAction,
  registerAction,
  logoutAction,
  getCurrentUserAction,
} from "@/backend";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setAuthenticated, setLoading } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAction(email, password),
    onSuccess: (data: { success: boolean; user?: any; error?: string }) => {
      if (data.success && data.user) {
        // Update auth context
        setUser(data.user);
        setAuthenticated(true);
        setLoading(false);

        // Invalidate and refetch current user
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        // Redirect to chat
        router.push("/chat");
        toast.success("Login successful!");
      } else {
        toast.error(data.error || "Login failed");
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setLoading(false);
      toast.error("Login failed. Please try again.");
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => registerAction(name, email, password),
    onSuccess: (data: { success: boolean; user?: any; error?: string }) => {
      if (data.success) {
        // Redirect to login page after successful registration
        router.push("/chat");
        toast.success("Registration successful! Please sign in.");
      } else {
        toast.error(data.error || "Registration failed");
      }
    },
    onError: (error) => {
      console.error("Register error:", error);
      toast.error("Registration failed. Please try again.");
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setAuthenticated, setLoading } = useAuth();

  return useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      // Update auth context
      setUser(null);
      setAuthenticated(false);
      setLoading(false);

      // Clear all queries from cache
      queryClient.clear();
      // Redirect to landing page
      router.push("/");
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      setLoading(false);
      toast.error("Logout failed. Please try again.");
    },
  });
};

// Get current user query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUserAction,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Don't auto-fetch, call refetch manually
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  return {
    isAuthenticated,
    user,
    isLoading,
  };
};
