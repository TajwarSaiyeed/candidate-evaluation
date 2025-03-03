// actions/evaluate.ts
import { supabase } from "@/lib/supabase/client";
import { evaluateCandidate } from "./server-action";

export interface CandidateProfile {
  name: string;
  email: string;
  linkedinUrl?: string;
  skills: string;
  experience: string;
  resumeText: string;
  resumeKeywords: string[];
}

export interface JobDescription {
  title: string;
  description: string;
  requirements: string[];
}

export interface CandidateEvaluation {
  summary: string;
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export async function generateEvaluationAction(
  candidateId: string,
  jobId: string
) {
  try {
    const { data: candidateData, error: candidateError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", candidateId)
      .maybeSingle();

    if (candidateError || !candidateData) {
      console.error("Error fetching candidate: 47 No line", candidateError);
      return { error: "Failed to fetch candidate data" };
    }

    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !jobData) {
      console.error("Error fetching job data:", jobError);
      return { error: "Failed to fetch job data" };
    }

    const candidate: CandidateProfile = {
      name: candidateData.name,
      email: candidateData.email,
      linkedinUrl: candidateData.linkedin_url || undefined,
      skills: candidateData.skills,
      experience: candidateData.experience,
      resumeText: candidateData.resume_text || "",
      resumeKeywords: candidateData.resume_keywords || [],
    };

    const job: JobDescription = {
      title: jobData.title,
      description: jobData.description,
      requirements: jobData.requirements || [],
    };

    const evaluation = await evaluateCandidate(candidate, job);

    const { error: updateError } = await supabase
      .from("applications")
      .update({
        summary: evaluation.summary,
        match_score: evaluation.matchScore,
      })
      .eq("id", candidateId);

    if (updateError) {
      console.error("Error updating application:", updateError);
      return { error: "Failed to update application data" };
    }

    return {
      summary: evaluation.summary,
      matchScore: evaluation.matchScore,
    };
  } catch (error) {
    console.error("Error in generateEvaluationAction:", error);
    return { error: "An unexpected error occurred" };
  }
}
