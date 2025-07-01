"use client";

import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexProvider({ children }: { children: ReactNode }) {
  // Handle missing environment variable gracefully
  if (!convexUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-destructive mb-4">Configuration Error</h1>
          <p className="text-muted-foreground mb-4">
            Convex environment variables are not configured.
          </p>
          <div className="bg-muted p-3 rounded text-sm mb-4">
            <p className="font-mono text-xs">Missing: NEXT_PUBLIC_CONVEX_URL</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Please check your environment variables in Vercel dashboard.
          </p>
        </div>
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);
  
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
} 