"use client";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuth } from "@/providers/auth-provider";
import Cookies from "js-cookie";

export const AuthChecker = () => {
  const {
    data: currentUserData,
    refetch: refetchCurrentUser,
    error,
  } = useCurrentUser();
  const { setUser, setAuthenticated, setLoading } = useAuth();

  useEffect(() => {
    try {
      // Check for token and fetch user data if token exists
      const token = Cookies.get("auth_token");
      if (token) {
        setLoading(true);
        refetchCurrentUser().catch((err) => {
          console.error("Failed to fetch current user:", err);
          setLoading(false);
        });
      }
    } catch (err) {
      console.error("Error in AuthChecker:", err);
      setLoading(false);
    }
  }, [refetchCurrentUser, setLoading]);

  useEffect(() => {
    try {
      if (currentUserData !== undefined) {
        if (currentUserData.success && currentUserData.user) {
          setUser(currentUserData.user);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Error processing current user data:", err);
      setLoading(false);
    }
  }, [currentUserData, setUser, setAuthenticated, setLoading]);

  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error("Current user query error:", error);
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  }, [error, setUser, setAuthenticated, setLoading]);

  return null; // This component doesn't render anything
};
