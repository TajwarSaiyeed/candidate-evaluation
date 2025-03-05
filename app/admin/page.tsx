"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { generateEvaluationAction } from "@/actions/evaluate";
import { Application } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import CandidateList from "./components/candidate-list";
import CandidateDetails from "./components/candidate-details";

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

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

  const updateApplicationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating application status:", error);
    } else {
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
      setEvaluationLoading(true);
      const result = await generateEvaluationAction(
        selectedApplication.id,
        selectedApplication.job_id || ""
      );

      if (!result) {
        console.error("Error generating evaluation: No result returned");
        return;
      }
      if (result.error) {
        console.error("Error generating evaluation:", result.error);
      } else {
        const updatedApp = {
          ...selectedApplication,
          summary: result.summary || "",
          match_score: result.match_score || 0,
          technical_score: result.technical_score || 0,
          experience_score: result.experience_score || 0,
          education_score: result.education_score || 0,
          recommendations: result.recommendations || [],
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
    } finally {
      setEvaluationLoading(false);
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
          <CandidateList
            applications={applications}
            selectedApplication={selectedApplication}
            setSelectedApplication={setSelectedApplication}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedApplication ? (
            <CandidateDetails
              selectedApplication={selectedApplication}
              generateEvaluation={generateEvaluation}
              updateApplicationStatus={updateApplicationStatus}
              evaluationLoading={evaluationLoading}
            />
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
