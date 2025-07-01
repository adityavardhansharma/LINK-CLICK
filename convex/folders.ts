import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFolder = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if folder with same name already exists for user
    const existingFolder = await ctx.db
      .query("folders")
      .withIndex("by_user_and_name", (q) => 
        q.eq("userId", args.userId).eq("name", args.name)
      )
      .first();
    
    if (existingFolder) {
      throw new Error("Folder with this name already exists");
    }

    const folderId = await ctx.db.insert("folders", {
      name: args.name,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return folderId;
  },
});

export const getUserFolders = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const folders = await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return folders.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const updateFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const folder = await ctx.db.get(args.folderId);
    
    if (!folder || folder.userId !== args.userId) {
      throw new Error("Folder not found or unauthorized");
    }

    // Check if another folder with same name exists
    const existingFolder = await ctx.db
      .query("folders")
      .withIndex("by_user_and_name", (q) => 
        q.eq("userId", args.userId).eq("name", args.name)
      )
      .first();
    
    if (existingFolder && existingFolder._id !== args.folderId) {
      throw new Error("Folder with this name already exists");
    }

    await ctx.db.patch(args.folderId, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const folder = await ctx.db.get(args.folderId);
    
    if (!folder || folder.userId !== args.userId) {
      throw new Error("Folder not found or unauthorized");
    }

    // Delete all links in the folder first
    const links = await ctx.db
      .query("links")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .collect();
    
    for (const link of links) {
      await ctx.db.delete(link._id);
    }

    // Delete the folder
    await ctx.db.delete(args.folderId);
  },
});

export const getFolderWithLinks = query({
  args: {
    folderId: v.id("folders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const folder = await ctx.db.get(args.folderId);
    
    if (!folder || folder.userId !== args.userId) {
      return null;
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .collect();
    
    return {
      ...folder,
      links: links.sort((a, b) => b.updatedAt - a.updatedAt),
    };
  },
}); 