import React from 'react';
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileStructure } from "@/utils/fileTypes";

interface FileExplorerProps {
  items: FileStructure[];
  selectedFile: string | null;
  onFileSelect: (file: FileStructure) => void;
  onFolderToggle: (path: string) => void;
}

export const FileExplorer = ({ items, selectedFile, onFileSelect, onFolderToggle }: FileExplorerProps) => {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.path}>
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-800 text-white",
              selectedFile === item.path && "bg-purple-500/20"
            )}
            onClick={() => item.type === 'folder' ? onFolderToggle(item.path) : onFileSelect(item)}
            style={{ paddingLeft: `${item.path.split('/').length * 12}px` }}
          >
            {item.type === 'folder' ? (
              <>
                {item.isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Folder className="h-4 w-4" />
              </>
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
          {item.type === 'folder' && item.isOpen && item.children && (
            <FileExplorer
              items={item.children}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
            />
          )}
        </div>
      ))}
    </div>
  );
};