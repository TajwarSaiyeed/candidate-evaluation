// components/admin/CandidateDetails.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application } from "@/types"; // Import the Application type
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EvaluationDetails from "./evaluation-details";
import CandidateActions from "./candidate-actions";

interface CandidateDetailsProps {
  selectedApplication: Application;
  generateEvaluation: () => Promise<void>;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  evaluationLoading: boolean;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({
  selectedApplication,
  generateEvaluation,
  updateApplicationStatus,
  evaluationLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{selectedApplication.name}</CardTitle>
            <CardDescription>{selectedApplication.email}</CardDescription>
          </div>
          <Badge
            variant={
              selectedApplication.status === "Rejected"
                ? "destructive"
                : "outline"
            }
          >
            {selectedApplication.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="evaluation">AI Evaluation</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Application Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Applied Date
                    </p>
                    <p className="font-medium">
                      {new Date(
                        selectedApplication.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <p className="font-medium">
                      {selectedApplication.linkedin_url ? (
                        <a
                          href={selectedApplication.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.split(",").map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Experience</h3>
                <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-line">
                  {selectedApplication.experience}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Actions</h3>
                <CandidateActions
                  selectedApplication={selectedApplication}
                  updateApplicationStatus={updateApplicationStatus}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evaluation">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Match Score</h3>
                  <span className={`font-bold`}>
                    {selectedApplication.match_score
                      ? `${selectedApplication.match_score}%`
                      : "Not evaluated"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">AI Feedback</h3>
                <p className="text-sm p-3 bg-muted rounded-md">
                  {selectedApplication.summary ||
                    "No AI evaluation available yet. Click the button below to generate an evaluation."}
                </p>
              </div>

              {!selectedApplication.summary && (
                <Button
                  className="w-full cursor-pointer"
                  onClick={generateEvaluation}
                  disabled={evaluationLoading}
                >
                  {evaluationLoading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    "Generate AI Evaluation"
                  )}
                </Button>
              )}

              {selectedApplication.summary && (
                <EvaluationDetails selectedApplication={selectedApplication} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="resume">
            <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
              {selectedApplication.resume_text ? (
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {selectedApplication.resume_text}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Resume content could not be extracted.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CandidateDetails;
