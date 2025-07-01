import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    password: v.string(), // In production, this should be hashed
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_name", ["userId", "name"]),

  links: defineTable({
    title: v.string(),
    url: v.string(),
    keywords: v.optional(v.array(v.string())),
    folderId: v.id("folders"),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_folder", ["folderId"])
    .index("by_user", ["userId"])
    .index("by_folder_and_title", ["folderId", "title"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),
}); 