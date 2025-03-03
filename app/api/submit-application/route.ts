import { NextRequest, NextResponse } from "next/server";
import vectorDB from "@/lib/vector-db";
import {
  generateEmbeddings,
  generateCandidateSummary,
} from "@/lib/gemini-client";

// This prevents the route from being statically generated
export const dynamic = "force-dynamic";

// In-memory storage for applications (would be a database in production)
const applications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    // Validate required fields
    if (
      !applicationData.name ||
      !applicationData.email ||
      !applicationData.skills ||
      !applicationData.experience
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique ID for the application
    const applicationId = `app_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Create the application record
    const application = {
      id: applicationId,
      ...applicationData,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    // Store the application
    applications.push(application);

    // Generate text embeddings for vector search
    const textToEmbed = `
      ${applicationData.name}
      ${applicationData.skills}
      ${applicationData.experience}
      ${applicationData.resumeText || ""}
      ${applicationData.resumeKeywords?.join(" ") || ""}
    `;

    const embeddings = generateEmbeddings(textToEmbed);

    // Store embeddings in vector database
    await vectorDB.upsert(applicationId, embeddings, {
      name: applicationData.name,
      email: applicationData.email,
      skills: applicationData.skills,
      keywords: applicationData.resumeKeywords || [],
    });

    // Generate a candidate summary using Gemini
    let summary = "";
    try {
      summary = await generateCandidateSummary({
        name: applicationData.name,
        email: applicationData.email,
        linkedinUrl: applicationData.linkedinUrl,
        skills: applicationData.skills,
        experience: applicationData.experience,
        resumeText: applicationData.resumeText || "",
        resumeKeywords: applicationData.resumeKeywords || [],
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      summary = "Unable to generate summary at this time.";
    }

    // Update the application with the summary
    application.summary = summary;

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// Get all applications (for admin use)
export async function GET() {
  return NextResponse.json(applications);
}
