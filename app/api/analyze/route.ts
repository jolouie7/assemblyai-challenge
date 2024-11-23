import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

if (!process.env.ASSEMBLYAI_API_KEY) {
  throw new Error("ASSEMBLYAI_API_KEY is not set");
}

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { transcriptId } = await request.json();

    console.log("Transcript ID1:", transcriptId);

    if (!transcriptId) {
      return NextResponse.json(
        { error: "No transcript ID provided" },
        { status: 400 }
      );
    }

    // Get the transcript from AssemblyAI
    const transcript = await client.transcripts.get(transcriptId);

    // Generate analysis using LeMUR
    const prompt = "Provide a summary of the transcript.";
    const { response } = await client.lemur.task({
      transcript_ids: [transcript.id],
      prompt,
      final_model: "anthropic/claude-3-5-sonnet",
    });

    console.log("Response1:", response);

    return NextResponse.json({
      summary: response,
      status: "success",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze transcript" },
      { status: 500 }
    );
  }
}
