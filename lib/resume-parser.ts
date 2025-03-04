import * as parser from "pdf-parse/lib/pdf-parse.js";
export interface ParsedResume {
  text: string;
  keywords: string[];
}

const SKILL_KEYWORDS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "ruby",
  "php",
  "go",
  "rust",
  "swift",
  "react",
  "angular",
  "vue",
  "svelte",
  "next.js",
  "html",
  "css",
  "sass",
  "tailwind",
  "bootstrap",
  "node.js",
  "express",
  "django",
  "flask",
  "spring",
  "laravel",
  "rails",
  "fastapi",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "firebase",
  "dynamodb",
  "redis",
  "elasticsearch",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "terraform",
  "ci/cd",
  "jenkins",
  "github actions",
  "react native",
  "flutter",
  "android",
  "ios",
  "swift",
  "kotlin",
  "machine learning",
  "data analysis",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "communication",
  "teamwork",
  "leadership",
  "problem solving",
  "time management",
  "critical thinking",
];

const EDUCATION_KEYWORDS = [
  "bachelor",
  "master",
  "phd",
  "degree",
  "university",
  "college",
  "school",
  "gpa",
  "major",
  "minor",
  "computer science",
  "engineering",
  "information technology",
  "data science",
  "bootcamp",
];

const EXPERIENCE_KEYWORDS = [
  "experience",
  "work",
  "job",
  "internship",
  "project",
  "role",
  "position",
  "responsibility",
  "developed",
  "implemented",
  "designed",
  "created",
  "built",
  "managed",
  "led",
  "collaborated",
];

/**
 * Extract relevant keywords from resume text.
 */
function extractKeywords(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  SKILL_KEYWORDS.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundKeywords.push(skill);
    }
  });

  EDUCATION_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  EXPERIENCE_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  return Array.from(new Set(foundKeywords));
}

/**
 * Parse a PDF resume and extract its text and keywords using pdf-parse.
 */
export async function parsePdfResume(
  fileBuffer: Buffer
): Promise<ParsedResume> {
  try {
    console.log("Parsing PDF resume...", fileBuffer);
    
    const data = await parser(fileBuffer);
    const fullText = data.text;
    const keywords = extractKeywords(fullText);
    
    return {
      text: fullText,
      keywords,
    };
  } catch (error) {
    console.error("Error in parsePdfResume:", error);
    return {
      text: "An error occurred while processing the resume. Please try a different PDF file.",
      keywords: [],
    };
  }
}

/**
 * Optionally, extract sections from resume text.
 */
export function extractResumeSections(text: string): Record<string, string> {
  if (!text || typeof text !== "string") {
    return { summary: "" };
  }

  const sections: Record<string, string> = {};
  const sectionHeaders = [
    "education",
    "experience",
    "work experience",
    "skills",
    "projects",
    "certifications",
    "awards",
    "publications",
    "languages",
    "interests",
  ];

  let currentSection = "summary";
  sections[currentSection] = "";
  const lines = text.split("\n");

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    const matchedHeader = sectionHeaders.find(
      (header) =>
        lowerLine === header ||
        lowerLine === header + ":" ||
        lowerLine === header.toUpperCase() ||
        lowerLine === header.toUpperCase() + ":"
    );
    if (matchedHeader) {
      currentSection = matchedHeader;
      sections[currentSection] = "";
    } else {
      sections[currentSection] += line + "\n";
    }
  }

  Object.keys(sections).forEach((key) => {
    sections[key] = sections[key].trim();
  });

  return sections;
}
