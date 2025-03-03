"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Download,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";
import { generateEvaluationAction } from "@/actions/evaluate";

type Application = Database["public"]["Tables"]["applications"]["Row"];

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    async function fetchApplications() {
      if (!isAdmin) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
        if (data && data.length > 0) {
          setSelectedApplication(data[0]);
        }
      }
      setLoading(false);
    }

    fetchApplications();
  }, [isAdmin]);

  const filteredApplications = applications.filter(
    (application) =>
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.skills &&
        application.skills.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating application status:", error);
    } else {
      // Update local state
      setApplications(
        applications.map((app) => (app.id === id ? { ...app, status } : app))
      );

      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
    }
  };

  const generateEvaluation = async () => {
    if (!selectedApplication) return;
    try {
      const result = await generateEvaluationAction(
        selectedApplication.id,
        selectedApplication.job_id || ""
      );

      if (!result) {
        console.error("Error generating evaluation: No result returned");
        return null;
      }

      if (result.error) {
        console.error("Error generating evaluation:", result.error);
      } else {
        const updatedApp = {
          ...selectedApplication,
          summary: result.summary || "",
          match_score: result.matchScore || 0,
        };
        setSelectedApplication(updatedApp);
        setApplications(
          applications.map((app) =>
            app.id === selectedApplication.id ? updatedApp : app
          )
        );
      }
    } catch (error) {
      console.error("Error calling generateEvaluationAction:", error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and evaluate candidate applications
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>
                {filteredApplications.length} total applications
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredApplications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No applications found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedApplication?.id === application.id
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(application.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{application.name}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {application.skills.split(",")[0]},{" "}
                              {application.skills.split(",")[1]}...
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getScoreColor(
                              application.match_score
                            )}`}
                          >
                            {application.match_score
                              ? `${application.match_score}%`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedApplication ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedApplication.name}</CardTitle>
                    <CardDescription>
                      {selectedApplication.email}
                    </CardDescription>
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
                            <p className="text-sm text-muted-foreground">
                              LinkedIn
                            </p>
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
                          {selectedApplication.skills
                            .split(",")
                            .map((skill, index) => (
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
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                "Shortlisted"
                              )
                            }
                            variant={
                              selectedApplication.status === "Shortlisted"
                                ? "default"
                                : "outline"
                            }
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              selectedApplication.status === "Under Review"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                "Under Review"
                              )
                            }
                          >
                            Under Review
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              selectedApplication.status ===
                              "Schedule Interview"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                "Schedule Interview"
                              )
                            }
                          >
                            Schedule Interview
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              selectedApplication.status === "Rejected"
                                ? "destructive"
                                : "outline"
                            }
                            onClick={() =>
                              updateApplicationStatus(
                                selectedApplication.id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="evaluation">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium">Match Score</h3>
                          <span
                            className={`font-bold ${getScoreColor(
                              selectedApplication.match_score
                            )}`}
                          >
                            {selectedApplication.match_score
                              ? `${selectedApplication.match_score}%`
                              : "Not evaluated"}
                          </span>
                        </div>
                        <Progress
                          value={selectedApplication.match_score || 0}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          AI Feedback
                        </h3>
                        <p className="text-sm p-3 bg-muted rounded-md">
                          {selectedApplication.summary ||
                            "No AI evaluation available yet. Click the button below to generate an evaluation."}
                        </p>
                      </div>

                      {!selectedApplication.summary && (
                        <Button className="w-full" onClick={generateEvaluation}>
                          Generate AI Evaluation
                        </Button>
                      )}

                      {selectedApplication.summary && (
                        <>
                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Skill Breakdown
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Technical Skills</span>
                                  <span>85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Experience</span>
                                  <span>70%</span>
                                </div>
                                <Progress value={70} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Education</span>
                                  <span>90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Recommended Next Steps
                            </h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>
                                Schedule a technical interview to assess
                                practical skills
                              </li>
                              <li>Request code samples or portfolio review</li>
                              <li>Evaluate cultural fit with the team</li>
                            </ul>
                          </div>
                        </>
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a candidate to view their details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
