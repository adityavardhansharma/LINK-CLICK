import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple hash function (for demo purposes - use bcrypt in production)
function simpleHash(password: string): string {
  // Simple hash for demo - in production use proper hashing
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36) + password.length.toString(36);
}

// Generate a simple session token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const signup = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUserByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    // Check if username already exists
    const existingUserByUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      username: args.username,
      email: args.email,
      password: simpleHash(args.password),
      createdAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now(),
    });

    return { token, userId };
  },
});

export const login = mutation({
  args: {
    emailOrUsername: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const hashedPassword = simpleHash(args.password);
    
    // Try to find user by email first, then by username
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.emailOrUsername))
      .first();
    
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.emailOrUsername))
        .first();
    }

    if (!user || user.password !== hashedPassword) {
      throw new Error("Invalid credentials");
    }

    // Create new session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now(),
    });

    return { token, userId: user._id };
  },
});

export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
  },
});

export const verifySession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    
    return session && session.expiresAt > Date.now();
  },
}); 