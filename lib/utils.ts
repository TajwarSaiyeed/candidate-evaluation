import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Shortlisted":
      return "bg-green-500";
    case "Under Review":
      return "bg-blue-500";
    case "New":
      return "bg-yellow-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
export const getScoreColor = (score: number | null) => {
  if (!score) return "text-muted-foreground";
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};