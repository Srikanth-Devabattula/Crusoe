"use client";

import { useCallback, useState } from "react";

/**
 * Placeholder auth hook — extend with context/provider for full auth flow
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("authToken");
    const authenticated = Boolean(token);
    setIsAuthenticated(authenticated);
    return authenticated;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    checkAuth,
    logout,
  };
}
