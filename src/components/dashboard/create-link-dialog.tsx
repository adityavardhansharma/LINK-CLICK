"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, X, Tag } from "lucide-react";
import { isValidUrl } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFolderId?: Id<"folders">;
}

export function CreateLinkDialog({ open, onOpenChange, defaultFolderId }: CreateLinkDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    folderId: defaultFolderId || "",
    keywordInput: "",
  });
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createLink = useMutation(api.links.createLink);
  
  // Get user's folders for selection
  const folders = useQuery(
    api.folders.getUserFolders,
    user ? { userId: user._id } : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.url.trim() || !formData.folderId) return;

    if (!isValidUrl(formData.url)) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createLink({
        title: formData.title.trim(),
        url: formData.url.trim(),
        keywords: keywords.length > 0 ? keywords : undefined,
        folderId: formData.folderId as Id<"folders">,
        userId: user._id,
      });
      
      // Reset form
      setFormData({
        title: "",
        url: "",
        folderId: defaultFolderId || "",
        keywordInput: "",
      });
      setKeywords([]);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const keyword = formData.keywordInput.trim();
      if (keyword && !keywords.includes(keyword)) {
        setKeywords([...keywords, keyword]);
        setFormData(prev => ({ ...prev, keywordInput: "" }));
      }
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setFormData({
      title: "",
      url: "",
      folderId: defaultFolderId || "",
      keywordInput: "",
    });
    setKeywords([]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="glass-effect p-2 rounded-lg">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle>Add New Link</DialogTitle>
        </div>
      </DialogHeader>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="link-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="link-title"
              placeholder="Enter link title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (error) setError("");
              }}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="link-url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, url: e.target.value }));
                if (error) setError("");
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="folder-select" className="text-sm font-medium">
              Folder
            </label>
            <select
              id="folder-select"
              value={formData.folderId}
              onChange={(e) => setFormData(prev => ({ ...prev, folderId: e.target.value }))}
              className="glass-input flex h-10 w-full rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">Select a folder</option>
              {folders?.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Keywords (optional)
            </label>
            
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <Input
              id="keywords"
              placeholder="Add keywords, press Enter or comma to add"
              value={formData.keywordInput}
              onChange={(e) => setFormData(prev => ({ ...prev, keywordInput: e.target.value }))}
              onKeyDown={handleAddKeyword}
            />
            <p className="text-xs text-muted-foreground">
              Keywords help you find your links later
            </p>
          </div>

          {error && (
            <div className="glass-effect border-destructive/50 bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.title.trim() || !formData.url.trim() || !formData.folderId}
            >
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 