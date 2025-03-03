import { NextRequest, NextResponse } from "next/server";
import vectorDB from "@/lib/vector-db";
import { generateEmbeddings } from "@/lib/gemini-client";

// This prevents the route from being statically generated
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 10 } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Generate embeddings for the search query
    const queryEmbeddings = generateEmbeddings(query);

    // Search for similar candidates in the vector database
    const results = await vectorDB.search(queryEmbeddings, limit);

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error("Candidate search error:", error);
    return NextResponse.json(
      { error: "Failed to search candidates" },
      { status: 500 }
    );
  }
}
