import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface CandidateProfile {
  name: string;
  email: string;
  linkedinUrl?: string;
  skills: string;
  experience: string;
  resumeText: string;
  resumeKeywords: string[];
}

interface JobDescription {
  title: string;
  description: string;
  requirements: string[];
}

interface CandidateEvaluation {
  summary: string;
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * Generate a summary of a candidate's resume and profile
 */
export async function generateCandidateSummary(
  candidate: CandidateProfile
): Promise<string> {
  try {
    if (!API_KEY) {
      console.warn("Missing Gemini API key. Using mock data instead.");
      return mockCandidateSummary(candidate);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate a concise professional summary for this candidate based on their profile and resume.
      
      Candidate Name: ${candidate.name}
      Skills: ${candidate.skills}
      Experience: ${candidate.experience}
      Resume Text: ${candidate.resumeText}
      Keywords: ${candidate.resumeKeywords.join(", ")}
      
      The summary should be 2-3 sentences highlighting their key qualifications, experience level, and standout skills.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating candidate summary:", error);
    return mockCandidateSummary(candidate);
  }
}

/**
 * Evaluate a candidate against a job description
 */
export async function evaluateCandidate(
  candidate: CandidateProfile,
  job: JobDescription
): Promise<CandidateEvaluation> {
  try {
    if (!API_KEY) {
      console.warn("Missing Gemini API key. Using mock data instead.");
      return mockCandidateEvaluation(candidate, job);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Evaluate this candidate for the ${job.title} position.
      
      JOB DESCRIPTION:
      ${job.description}
      
      REQUIREMENTS:
      ${job.requirements.join("\n")}
      
      CANDIDATE PROFILE:
      Name: ${candidate.name}
      Skills: ${candidate.skills}
      Experience: ${candidate.experience}
      Resume: ${candidate.resumeText}
      
      Provide a JSON response with the following structure:
      {
        "summary": "Overall evaluation of the candidate",
        "matchScore": A number between 0-100 representing how well the candidate matches the job,
        "strengths": [List of 3-5 candidate strengths relevant to this position],
        "weaknesses": [List of 2-3 areas where the candidate could improve],
        "recommendations": [List of 2-3 specific recommendations for the candidate]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text) as CandidateEvaluation;
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      return mockCandidateEvaluation(candidate, job);
    }
  } catch (error) {
    console.error("Error evaluating candidate:", error);
    return mockCandidateEvaluation(candidate, job);
  }
}

/**
 * Generate text embeddings for vector search
 * This is a mock implementation since we don't have direct access to embedding models
 */
export function generateEmbeddings(text: string): number[] {
  // In a real application, you would call an embedding API
  // This is a mock that creates random embeddings of dimension 768
  return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
}

/**
 * Mock candidate summary for when API key is not available
 */
function mockCandidateSummary(candidate: CandidateProfile): string {
  const summaries = [
    `${
      candidate.name
    } is a skilled professional with experience in ${candidate.skills
      .split(",")
      .slice(0, 3)
      .join(
        ", "
      )}. They have demonstrated strong capabilities in their previous roles and would be a valuable addition to the team.`,
    `Experienced in ${candidate.skills.split(",").slice(0, 2).join(" and ")}, ${
      candidate.name
    } brings practical knowledge and a problem-solving approach to their work. Their background shows a consistent pattern of growth and learning.`,
    `A dedicated professional with expertise in ${
      candidate.skills.split(",")[0]
    }, ${
      candidate.name
    } has a track record of delivering quality results. Their experience in ${
      candidate.experience.split(".")[0]
    } demonstrates their commitment to excellence.`,
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
}

/**
 * Mock candidate evaluation for when API key is not available
 */
function mockCandidateEvaluation(
  candidate: CandidateProfile,
  job: JobDescription
): CandidateEvaluation {
  const skills = candidate.skills
    .toLowerCase()
    .split(",")
    .map((s) => s.trim());
  const requirements = job.requirements.map((r) => r.toLowerCase());

  // Calculate a mock match score based on skills matching requirements
  let matchCount = 0;
  requirements.forEach((req) => {
    if (
      skills.some(
        (skill) => req.includes(skill) || skill.includes(req.split(" ")[0])
      )
    ) {
      matchCount++;
    }
  });

  const matchScore = Math.min(
    100,
    Math.round((matchCount / requirements.length) * 100) +
      Math.floor(Math.random() * 20)
  );

  return {
    summary: `${candidate.name} appears to be a ${
      matchScore > 80 ? "strong" : matchScore > 60 ? "good" : "potential"
    } candidate for the ${job.title} position. Their experience with ${skills
      .slice(0, 3)
      .join(", ")} aligns with several of our requirements.`,
    matchScore,
    strengths: [
      `Experience with ${skills[0] || "relevant technologies"}`,
      `Knowledge of ${skills[1] || "industry standards"}`,
      `Background in ${candidate.experience.split(".")[0]}`,
      `Demonstrated skills in problem-solving`,
    ],
    weaknesses: [
      requirements.find(
        (req) => !skills.some((skill) => req.includes(skill))
      ) || "Limited experience with some required technologies",
      "Could benefit from more specialized knowledge in this field",
    ],
    recommendations: [
      "Consider additional training in specific job requirements",
      "Highlight relevant project experience in the interview",
      "Prepare examples of problem-solving abilities",
    ],
  };
}
