"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Copy, ExternalLink, MoreVertical, Trash2, Link as LinkIcon, Folder } from "lucide-react";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { CreateLinkDialog } from "./create-link-dialog";
import { Id } from "../../../convex/_generated/dataModel";

interface FolderViewProps {
  folderId: Id<"folders">;
  onBack: () => void;
}

export function FolderView({ folderId, onBack }: FolderViewProps) {
  const { user } = useAuth();
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Get folder with its links
  const folderWithLinks = useQuery(
    api.folders.getFolderWithLinks,
    user ? { folderId, userId: user._id } : "skip"
  );

  // Delete link mutation
  const deleteLink = useMutation(api.links.deleteLink);

  const handleCopy = async (url: string, id: string) => {
    try {
      await copyToClipboard(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!user) return;
    
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink({
          linkId: linkId as any,
          userId: user._id,
        });
        setOpenDropdownId(null);
      } catch (error) {
        console.error("Failed to delete link:", error);
        alert("Failed to delete link. Please try again.");
      }
    }
  };

  const handleMenuClick = (linkId: string) => {
    setOpenDropdownId(openDropdownId === linkId ? null : linkId);
  };

  if (!folderWithLinks) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative mb-6">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 rounded-2xl"></div>
        <div className="relative glass-effect rounded-2xl border border-border/40 backdrop-blur-xl bg-white/50 overflow-hidden">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Mobile: Back button */}
            <div className="p-4 border-b border-border/30">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="group gap-2 px-3 py-2 rounded-lg hover:bg-white/40 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </Button>
            </div>
            
            {/* Mobile: Folder info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-lg blur-sm opacity-20"></div>
                  <div className="relative glass-effect p-2.5 rounded-lg bg-gradient-to-br from-white/80 to-white/60 border border-primary/20">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-foreground tracking-tight truncate">{folderWithLinks.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <LinkIcon className="h-3 w-3" />
                    <span className="font-medium">
                      {folderWithLinks.links?.length || 0} {(folderWithLinks.links?.length || 0) === 1 ? "link" : "links"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Mobile: Action button */}
              <Button 
                onClick={() => setShowCreateLink(true)}
                className="w-full gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            {/* Desktop: Top section with navigation and folder info */}
            <div className="p-6 border-b border-border/30 bg-gradient-to-r from-white/20 to-transparent">
              <div className="flex items-center gap-6">
                {/* Back button */}
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="group gap-3 px-4 py-2.5 rounded-xl hover:bg-white/40 transition-all duration-200 border border-transparent hover:border-border/30"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                  <span className="font-medium">Back to Folders</span>
                </Button>
                
                {/* Separator */}
                <div className="w-px h-8 bg-border/40"></div>
                
                {/* Folder info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-sm opacity-20"></div>
                    <div className="relative glass-effect p-3 rounded-xl bg-gradient-to-br from-white/80 to-white/60 border border-primary/20">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{folderWithLinks.name}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <LinkIcon className="h-3 w-3" />
                        <span className="font-medium">
                          {folderWithLinks.links?.length || 0} {(folderWithLinks.links?.length || 0) === 1 ? "link" : "links"}
                        </span>
                      </div>
                      <span className="text-border">•</span>
                      <span className="text-muted-foreground font-medium">
                        Updated {formatDate(folderWithLinks.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop: Bottom section with action button */}
            <div className="p-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Organize and manage your saved links
              </div>
              <Button 
                onClick={() => setShowCreateLink(true)}
                className="group gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Add New Link
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      {folderWithLinks.links && folderWithLinks.links.length > 0 ? (
        <div className="space-y-1">
          {folderWithLinks.links.map((link) => (
            <div
              key={link._id}
              className="flex items-center gap-3 p-3 bg-card hover:bg-secondary/50 rounded-lg group border border-border/40 hover:border-border transition-all"
            >
              {/* Link Icon */}
              <LinkIcon className="h-4 w-4 text-primary flex-shrink-0" />
              
              {/* Link Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{link.title}</div>
                <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                {link.keywords && link.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {link.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary/50 text-secondary-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                    {link.keywords.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{link.keywords.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Date */}
              <div className="text-xs text-muted-foreground w-16 text-right">
                {formatDate(link.createdAt)}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(link.url, link._id)}
                  className="h-8 w-8 p-0 hover:bg-secondary/50 rounded-lg"
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(link.url, '_blank')}
                  className="h-8 w-8 p-0 hover:bg-secondary/50 rounded-lg"
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMenuClick(link._id)}
                    className="h-8 w-8 p-0 hover:bg-secondary/50 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  
                  {openDropdownId === link._id && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[120px]">
                      <div className="py-1">
                        <button
                          onClick={() => handleDeleteLink(link._id)}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {copiedId === link._id && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <div className="glass-effect p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No links yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your collection by adding your first link
          </p>
          <Button onClick={() => setShowCreateLink(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Link
          </Button>
        </div>
      )}

      {/* Create Link Dialog */}
      <CreateLinkDialog 
        open={showCreateLink}
        onOpenChange={setShowCreateLink}
        defaultFolderId={folderId}
      />
      
      {/* Click outside to close dropdown */}
      {openDropdownId && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setOpenDropdownId(null)}
        />
      )}
    </div>
  );
} 