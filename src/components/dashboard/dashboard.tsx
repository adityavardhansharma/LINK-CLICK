"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { Search, Plus, Folder, LogOut, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FolderCard } from "./folder-card";
import { SearchResults } from "./search-results";
import { CreateFolderDialog } from "./create-folder-dialog";
import { CreateLinkDialog } from "./create-link-dialog";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);
  
  // Fetch user's folders
  const folders = useQuery(
    api.folders.getUserFolders,
    user ? { userId: user._id } : "skip"
  );

  // Search results
  const searchResults = useQuery(
    api.links.searchLinks,
    user && searchTerm.trim() 
      ? { userId: user._id, searchTerm: searchTerm.trim() }
      : "skip"
  );

  // Delete folder mutation
  const deleteFolder = useMutation(api.folders.deleteFolder);

  const handleDeleteFolder = async (folderId: string) => {
    if (!user) return;
    
    if (confirm("Are you sure you want to delete this folder? All links in this folder will also be deleted.")) {
      try {
        await deleteFolder({
          folderId: folderId as any,
          userId: user._id,
        });
      } catch (error) {
        console.error("Failed to delete folder:", error);
        alert("Failed to delete folder. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 relative">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5"></div>
        <div className="relative glass-effect border-b backdrop-blur-xl bg-white/60">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-sm opacity-20"></div>
                    <div className="relative glass-effect p-2.5 rounded-xl bg-gradient-to-br from-white/90 to-white/70 border border-primary/20 shadow-md">
                      <LinkIcon className="h-6 w-6 text-primary drop-shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        LINK
                      </span>
                      <span className="text-foreground/80 ml-0.5">CLICK</span>
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/80">
                      {user.username}
                    </p>
                  </div>
                </div>
                
                {/* Mobile Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/30 px-2 py-1 rounded-lg">
                    <span className="font-bold">{folders?.length || 0}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    size="sm"
                    className="gap-1 px-2 py-1.5 rounded-lg border-border/40 bg-white/30 hover:bg-white/50"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl blur-sm opacity-20"></div>
                    <div className="relative glass-effect p-4 rounded-2xl bg-gradient-to-br from-white/90 to-white/70 border border-primary/20 shadow-lg">
                      <LinkIcon className="h-8 w-8 text-primary drop-shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        LINK
                      </span>
                      <span className="text-foreground/80 ml-1">CLICK</span>
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/80">
                      Welcome back, <span className="text-foreground font-semibold">{user.username}</span>
                    </p>
                  </div>
                </div>
                
                {/* Stats and Actions */}
                <div className="flex items-center gap-6">
                  {/* Stats Card */}
                  <div className="flex items-center gap-4 glass-effect px-4 py-3 rounded-xl bg-white/40 border border-border/30">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{folders?.length || 0}</div>
                      <div className="text-xs text-muted-foreground font-medium">Folders</div>
                    </div>
                    <div className="w-px h-8 bg-border/40"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">∞</div>
                      <div className="text-xs text-muted-foreground font-medium">Links</div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="group gap-3 px-4 py-2.5 rounded-xl border-border/40 bg-white/30 hover:bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  >
                    <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search links by title, URL, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowCreateFolder(true)}
            className="flex-1 sm:flex-none"
          >
            <Folder className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
          
          <Button 
            onClick={() => setShowCreateLink(true)}
            variant="secondary"
            className="flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>

        {/* Search Results or Folders */}
        {searchTerm.trim() ? (
          <SearchResults 
            results={searchResults || []}
            searchTerm={searchTerm}
          />
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Folders</h2>
            
            {folders && folders.length > 0 ? (
              <div className="space-y-3">
                {folders.map((folder) => (
                  <FolderCard 
                    key={folder._id} 
                    folder={folder} 
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No folders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first folder to start organizing your links
                </p>
                <Button onClick={() => setShowCreateFolder(true)}>
                  <Folder className="h-4 w-4 mr-2" />
                  Create First Folder
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateFolderDialog 
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
      />
      
      <CreateLinkDialog 
        open={showCreateLink}
        onOpenChange={setShowCreateLink}
      />
    </div>
  );
} 