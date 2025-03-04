// actions/evaluate.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CandidateEvaluation,
  CandidateProfile,
  JobDescription,
} from "./evaluate";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function evaluateCandidate(
  candidate: CandidateProfile,
  job: JobDescription
): Promise<CandidateEvaluation> {
  try {
    if (!API_KEY) {
      console.warn("Missing Gemini API key. Using mock candidate evaluation.");
      return {
        summary: "Mock evaluation",
        matchScore: 75,
        strengths: ["Strong communication skills", "Great team player"],
        weaknesses: ["Limited experience with React"],
        recommendations: [
          "Take a React course",
          "Work on personal projects to build experience",
        ],
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Evaluate this candidate for the "${job.title}" position.

JOB DESCRIPTION:
${job.description}

REQUIREMENTS:
${job.requirements.join("\n")}

CANDIDATE PROFILE:
Name: ${candidate.name}
Skills: ${candidate.skills}
Experience: ${candidate.experience}
Resume: ${candidate.resumeText}

Please provide ONLY a JSON response (no additional commentary, no backticks) with the following structure:
{
  "summary": "Overall evaluation of the candidate",
  "matchScore": number, // a number between 0-100 representing the match score
  "strengths": ["List of 3-5 candidate strengths relevant to this position"],
  "weaknesses": ["List of 2-3 areas for improvement"],
  "recommendations": ["List of 2-3 specific recommendations for the candidate"]
}
    `;

    const result = await model.generateContent(prompt);

    // console.log("Gemini response:", result.response);

    const text = await result.response.text();

    const cleanedText = text.replace(/```json\n/g, "").replace(/```/g, "");

    try {
      return JSON.parse(cleanedText) as CandidateEvaluation;
    } catch (parseError) {
      console.error(
        "Error parsing Gemini response:",
        parseError,
        "Response text:",
        text,
        "Cleaned text:",
        cleanedText // Log the cleaned text for debugging
      );
      return {
        summary:
          "Error evaluating candidate - Could not parse Gemini response.",
        matchScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
      };
    }
  } catch (error) {
    console.error("Error evaluating candidate:", error);
    return {
      summary: "Error evaluating candidate - Gemini API call failed.",
      matchScore: 0,
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };
  }
}
