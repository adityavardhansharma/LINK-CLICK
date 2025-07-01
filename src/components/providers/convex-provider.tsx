"use client";

import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexProvider({ children }: { children: ReactNode }) {
  // Handle missing environment variable gracefully
  if (!convexUrl || convexUrl === "" || convexUrl === "https://placeholder.convex.cloud") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-destructive mb-4">Setup Required</h1>
          <p className="text-muted-foreground mb-4">
            Convex database needs to be configured to continue.
          </p>
          <div className="bg-muted p-3 rounded text-sm mb-4 text-left">
            <p className="font-mono text-xs mb-2">1. Run in your terminal:</p>
            <p className="font-mono text-xs bg-background p-2 rounded">npx convex dev</p>
            <p className="font-mono text-xs mt-2 mb-2">2. This will create/update .env.local with:</p>
            <p className="font-mono text-xs bg-background p-2 rounded">NEXT_PUBLIC_CONVEX_URL=your_url</p>
            <p className="font-mono text-xs mt-2">3. Restart your dev server</p>
          </div>
          <p className="text-xs text-muted-foreground">
            This will set up your Convex backend and database automatically.
          </p>
        </div>
      </div>
    );
  }

  // Validate URL format
  try {
    new URL(convexUrl);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-destructive mb-4">Invalid Convex URL</h1>
          <p className="text-muted-foreground mb-4">
            The Convex URL in your environment is not valid.
          </p>
          <div className="bg-muted p-3 rounded text-sm mb-4">
            <p className="font-mono text-xs">Current: {convexUrl}</p>
            <p className="font-mono text-xs mt-2">Expected format: https://your-project.convex.cloud</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Please run <code>npx convex dev</code> to get the correct URL.
          </p>
        </div>
      </div>
    );
  }

  const convex = new ConvexReactClient(convexUrl);
  
  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
} 