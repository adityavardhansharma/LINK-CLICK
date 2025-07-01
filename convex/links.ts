import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createLink = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    keywords: v.optional(v.array(v.string())),
    folderId: v.id("folders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify folder exists and belongs to user
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== args.userId) {
      throw new Error("Folder not found or unauthorized");
    }

    const linkId = await ctx.db.insert("links", {
      title: args.title,
      url: args.url,
      keywords: args.keywords || [],
      folderId: args.folderId,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update folder's updatedAt timestamp
    await ctx.db.patch(args.folderId, {
      updatedAt: Date.now(),
    });

    return linkId;
  },
});

export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.string(),
    url: v.string(),
    keywords: v.optional(v.array(v.string())),
    folderId: v.id("folders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    
    if (!link || link.userId !== args.userId) {
      throw new Error("Link not found or unauthorized");
    }

    // Verify new folder exists and belongs to user
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== args.userId) {
      throw new Error("Folder not found or unauthorized");
    }

    await ctx.db.patch(args.linkId, {
      title: args.title,
      url: args.url,
      keywords: args.keywords || [],
      folderId: args.folderId,
      updatedAt: Date.now(),
    });

    // Update folder's updatedAt timestamp
    await ctx.db.patch(args.folderId, {
      updatedAt: Date.now(),
    });
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id("links"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    
    if (!link || link.userId !== args.userId) {
      throw new Error("Link not found or unauthorized");
    }

    await ctx.db.delete(args.linkId);

    // Update folder's updatedAt timestamp
    await ctx.db.patch(link.folderId, {
      updatedAt: Date.now(),
    });
  },
});

export const getFolderLinks = query({
  args: {
    folderId: v.id("folders"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify folder belongs to user
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== args.userId) {
      return [];
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .collect();
    
    return links.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const searchLinks = query({
  args: {
    searchTerm: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return [];
    }

    const allLinks = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    const searchTerm = args.searchTerm.toLowerCase();
    
    const matchingLinks = allLinks.filter(link => {
      const titleMatch = link.title.toLowerCase().includes(searchTerm);
      const urlMatch = link.url.toLowerCase().includes(searchTerm);
      const keywordMatch = link.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm)
      );
      
      return titleMatch || urlMatch || keywordMatch;
    });

    // Get folder names for each link
    const linksWithFolders = await Promise.all(
      matchingLinks.map(async (link) => {
        const folder = await ctx.db.get(link.folderId);
        return {
          ...link,
          folderName: folder?.name || "Unknown",
        };
      })
    );
    
    return linksWithFolders.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getAllUserLinks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return links.sort((a, b) => b.updatedAt - a.updatedAt);
  },
}); 