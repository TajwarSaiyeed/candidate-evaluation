"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
  acceptedFileTypes?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUploader({
  onFileSelect,
  currentFile,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
  },
  maxSize = 5242880, // 5MB
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!currentFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
            isDragReject && "border-destructive bg-destructive/5"
          )}
        >
          <input {...getInputProps()} />
          <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            {isDragActive
              ? "Drop the file here..."
              : "Drag and drop your resume, or click to select"}
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            PDF only, max 5MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileUp className="h-5 w-5 flex-shrink-0 text-primary" />
            <span className="text-sm truncate">{currentFile.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
}