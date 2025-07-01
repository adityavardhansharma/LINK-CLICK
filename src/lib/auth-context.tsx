"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loginMutation = useMutation(api.auth.login);
  const signupMutation = useMutation(api.auth.signup);
  const logoutMutation = useMutation(api.auth.logout);

  const user = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : "skip"
  );

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem("linkme-token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitialized(true);
  }, []);

  // Calculate loading state
  const loading = !isInitialized || (token !== null && user === undefined);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const result = await loginMutation({ emailOrUsername, password });
      setToken(result.token);
      localStorage.setItem("linkme-token", result.token);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const result = await signupMutation({ username, email, password });
      setToken(result.token);
      localStorage.setItem("linkme-token", result.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await logoutMutation({ token });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    setToken(null);
    localStorage.removeItem("linkme-token");
  };

      return (
      <AuthContext.Provider
        value={{
          user: user || null,
          loading,
          login,
          signup,
          logout,
          token,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 