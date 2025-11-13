"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Loader2, FileSpreadsheet, FileImage } from "lucide-react";
import { processUploadedFile } from "@/lib/file-processing";
import { useAppContext } from "@/context/AppContext";

export function FileUploadZone() {
  const { refreshData } = useAppContext();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setProgress(10);
    setResult(null);

    try {
      // Read file content
      const content = await readFileContent(file);
      setProgress(30);

      // Process the file
      const response = await processUploadedFile({
        file_name: file.name,
        file_type: file.type || getFileType(file.name),
        file_size: file.size,
        file_content: content,
      });

      setProgress(90);

      if (response.error) {
        setResult({
          success: false,
          message: response.error,
        });
      } else {
        setResult({
          success: true,
          message: `Successfully imported ${response.data?.transactions_count || 0} transactions!`,
          count: response.data?.transactions_count,
        });

        // Refresh the app data
        if (refreshData) {
          await refreshData();
        }
      }

      setProgress(100);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Failed to process file",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, [refreshData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Transactions
        </CardTitle>
        <CardDescription>
          Upload your bank statements, GPay transactions, or any transaction file (CSV, PDF, JSON, or Image)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive ? "border-primary bg-primary/5" : "border-slate-600 hover:border-primary/50"}
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <div className="flex gap-3">
                <FileSpreadsheet className="h-10 w-10 text-slate-400" />
                <FileText className="h-10 w-10 text-slate-400" />
                <FileImage className="h-10 w-10 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-slate-200">
                {isDragActive
                  ? "Drop your file here"
                  : uploading
                  ? "Processing..."
                  : "Drag & drop your transaction file here"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                or click to browse • CSV, PDF, JSON, or Images
              </p>
            </div>
          </div>
        </div>

        {uploading && progress > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-slate-400 text-center">
              {progress < 30
                ? "Reading file..."
                : progress < 90
                ? "Processing and categorizing transactions..."
                : "Almost done..."}
            </p>
          </div>
        )}

        {result && (
          <Alert className={result.success ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <AlertDescription className="text-slate-200">
                {result.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="pt-4 space-y-2 text-sm text-slate-400">
          <p className="font-medium text-slate-300">Supported formats:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>CSV/Excel:</strong> Bank statements, GPay exports</li>
            <li><strong>PDF:</strong> Bank statements (extracted via OCR)</li>
            <li><strong>JSON:</strong> App exports from financial apps</li>
            <li><strong>Images:</strong> Screenshots of transactions</li>
          </ul>
          <p className="text-xs pt-2">
            💡 Transactions are automatically categorized using AI for accuracy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else if (content instanceof ArrayBuffer) {
        const decoder = new TextDecoder("utf-8");
        resolve(decoder.decode(content));
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));

    if (file.type.includes("image")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    case "pdf":
      return "application/pdf";
    case "png":
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    default:
      return "text/plain";
  }
}
