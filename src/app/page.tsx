"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth/auth-form";
import { Dashboard } from "@/components/dashboard/dashboard";

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Default to sign-in page when not authenticated
  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === "login" ? "signup" : "login")}
      />
    );
  }

  // Show dashboard when authenticated
  return <Dashboard />;
}

export default function Home() {
  // Show fallback if environment variables are missing
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-destructive mb-4">Configuration Error</h1>
          <p className="text-muted-foreground mb-4">
            Convex environment variables are not configured. Please run:
          </p>
          <code className="bg-muted p-2 rounded text-sm block mb-4">
            npx convex dev
          </code>
          <p className="text-xs text-muted-foreground">
            This will create the necessary .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
