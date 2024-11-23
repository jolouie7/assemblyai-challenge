import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI as AssemblyAIClient } from "assemblyai";

// Initialize AssemblyAI client
const client = new AssemblyAIClient({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer();
    // Upload the file to AssemblyAI
    const upload = await client.files.upload(buffer);

    // Start transcription with speaker labels
    const transcript = await client.transcripts.transcribe({
      audio: upload,
      speaker_labels: true,
    });

    // Return the transcript ID for polling
    return NextResponse.json({
      transcriptId: transcript.id,
      status: transcript.status,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to process audio file" },
      { status: 500 }
    );
  }
}

// Endpoint to check transcription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transcriptId = searchParams.get("transcriptId");

  if (!transcriptId) {
    return NextResponse.json(
      { error: "No transcript ID provided" },
      { status: 400 }
    );
  }

  try {
    const transcript = await client.transcripts.get(transcriptId);

    return NextResponse.json({
      status: transcript.status,
      transcript: transcript.status === "completed" ? transcript : null,
    });
  } catch (error) {
    console.error("Error checking transcript status:", error);
    return NextResponse.json(
      { error: "Failed to check transcript status" },
      { status: 500 }
    );
  }
}
