"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Folder, Search } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { useState } from "react";

interface SearchResult {
  _id: string;
  title: string;
  url: string;
  keywords?: string[];
  folderName: string;
  updatedAt: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
}

export function SearchResults({ results, searchTerm }: SearchResultsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (url: string, id: string) => {
    try {
      await copyToClipboard(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string): (string | React.ReactElement)[] => {
    if (!searchTerm) return [text];
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  if (results.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Search Results</h2>
        </div>
        
        <Card className="p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            No links match your search for &quot;{searchTerm}&quot;
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5" />
        <h2 className="text-2xl font-semibold">Search Results</h2>
        <span className="text-muted-foreground">({results.length} found)</span>
      </div>
      
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result._id} className="p-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {result.folderName}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-1">
                    {highlightSearchTerm(result.title, searchTerm)}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground break-all mb-2">
                    {highlightSearchTerm(result.url, searchTerm)}
                  </p>
                  
                  {result.keywords && result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/50 text-secondary-foreground"
                        >
                          {highlightSearchTerm(keyword, searchTerm)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(result.url, result._id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedId === result._id ? "Copied!" : "Copy"}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 