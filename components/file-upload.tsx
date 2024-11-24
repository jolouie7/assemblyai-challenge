"use client";

import { Upload, X } from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileAudio } from "lucide-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import SummaryDisplay from "./summary-display";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    if (!file) return;

    // Log for debugging only in development
    if (process.env.NODE_ENV === "development") {
      console.log("Drop file:", file.name);
    }

    setFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
    },
    multiple: false,
  });

  const analyzeTranscript = async (transcriptId: string) => {
    const analysisResponse = await axios.post("/api/analyze", {
      transcriptId,
    });

    const analysisData = await analysisResponse.data;

    console.log("Summary:", analysisData.summary);
    setSummary(analysisData.summary);
    setUploading(false);
    toast({
      variant: "default",
      description: "Your file has been processed.",
    });
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload and start transcription
      const response = await axios.post("/api/transcribe", formData);

      const data = await response.data;

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to upload file");
      }

      // Start polling for completion
      const pollInterval = setInterval(async () => {
        const statusResponse = await axios.get(
          `/api/transcribe?transcriptId=${data.transcriptId}`
        );
        const statusData = await statusResponse.data;

        if (statusData.status === "completed") {
          clearInterval(pollInterval);

          // Handle completed transcript
          console.log(
            "Transcript completed:",
            statusData.transcript,
            "Transcript ID:",
            data.transcriptId
          );

          // Start analysis with the completed transcript ID
          analyzeTranscript(data.transcriptId);
        } else if (statusData.status === "error") {
          clearInterval(pollInterval);
          setUploading(false);
          throw new Error("Transcription failed");
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error("Error:", error);
      setUploading(false);
      toast({
        variant: "destructive",
        description: "An error occurred while processing your file.",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Upload Audio File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileAudio className="h-6 w-6 text-primary" />
                <span className="font-medium">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : isDragActive ? (
              <p>Drop the audio file here ...</p>
            ) : (
              <div>
                <FileAudio className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p>
                  Drag and drop an audio file here, or click to select a file
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: MP3, WAV, OGG, M4A
                </p>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={!file || uploading}
          onClick={handleSubmit}
          className="w-full"
        >
          {!uploading ? (
            <>
              <Spinner variant="white" /> Uploading...
            </>
          ) : (
            <>
              Upload and Process
              <Upload className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
      {summary && <SummaryDisplay summary={summary} />}
    </Card>
  );
}
