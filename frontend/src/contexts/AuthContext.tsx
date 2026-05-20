"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { clearAuth, getStoredToken, getStoredUser, saveAuth } from "@/lib/auth-storage";
import type { User, VerifyOtpFormData } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  statusMessage: string | null;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (data: VerifyOtpFormData) => Promise<void>;
  logout: () => void;
  clearStatusMessage: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (storedUser) {
      setUser(storedUser);
    }

    try {
      const res = await authService.getMe();
      if (res.data?.user) {
        setUser(res.data.user);
        saveAuth(token, res.data.user);
      }
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const sendOtp = async (email: string) => {
    const res = await authService.sendOtp(email);
    setStatusMessage(res.message || "OTP sent to your email");
  };

  const verifyOtp = async (data: VerifyOtpFormData) => {
    const res = await authService.verifyOtp(data);
    if (!res.data?.token || !res.data?.user) {
      throw new Error(res.message || "Login failed");
    }
    saveAuth(res.data.token, res.data.user);
    setUser(res.data.user);
    setStatusMessage(res.message || "User logged in successfully");
    router.push("/admin/dashboard");
  };

  const logout = () => {
    authService.logout();
    clearAuth();
    setUser(null);
    setStatusMessage(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        statusMessage,
        sendOtp,
        verifyOtp,
        logout,
        clearStatusMessage: () => setStatusMessage(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
