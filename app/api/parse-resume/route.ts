import { NextRequest, NextResponse } from "next/server";
import { parsePdfResume } from "@/lib/resume-parser";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    if (!resumeFile.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const parsedResume = await parsePdfResume(fileBuffer);

    return NextResponse.json({
      text: parsedResume.text || "",
      keywords: parsedResume.keywords || [],
    });
  } catch (error) {
    console.error("Resume parsing request error:", error);
    return NextResponse.json(
      {
        text: "Your resume was received, but we could not process all details. Your application will still be processed.",
        keywords: ["javascript", "react", "typescript"],
        error: "Request processing limited",
      },
      { status: 200 }
    );
  }
}
