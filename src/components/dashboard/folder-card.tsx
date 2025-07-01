"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Folder, MoreVertical, Link as LinkIcon, Trash2 } from "lucide-react";
import { FolderView } from "./folder-view";

interface FolderCardProps {
  folder: {
    _id: string;
    name: string;
    userId: string;
    createdAt: number;
    updatedAt: number;
  };
  onDelete: (folderId: string) => void;
}

export function FolderCard({ folder, onDelete }: FolderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get link count for this folder
  const links = useQuery(api.links.getFolderLinks, {
    folderId: folder._id as Id<"folders">,
    userId: folder.userId as Id<"users">,
  });

  const linkCount = links?.length || 0;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onDelete(folder._id);
  };

  if (isOpen) {
    return <FolderView folderId={folder._id as Id<"folders">} onBack={() => setIsOpen(false)} />;
  }

  return (
    <>
      <div 
        className="flex items-center gap-3 p-3 bg-card hover:bg-secondary/50 rounded-lg cursor-pointer group border border-border/40 hover:border-border transition-all"
        onClick={() => setIsOpen(true)}
      >
        {/* Folder Icon */}
        <Folder className="h-5 w-5 text-primary flex-shrink-0" />
        
        {/* Folder Name */}
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm truncate block">{folder.name}</span>
        </div>
        
        {/* Link Count */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <LinkIcon className="h-3 w-3" />
          <span>{linkCount}</span>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMenuClick}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
          
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[120px]">
              <div className="py-1">
                <button
                  onClick={handleDeleteClick}
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
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
} 