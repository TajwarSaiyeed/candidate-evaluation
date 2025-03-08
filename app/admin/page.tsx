"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { generateEvaluationAction } from "@/actions/evaluate";
import type { Application } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import CandidateList from "./components/candidate-list";
import CandidateDetails from "./components/candidate-details";
import { FilterDialog } from "@/components/filter-dialog";
import { SortDialog } from "@/components/sort-dialog";
import { ExportDialog } from "@/components/export-dialog";

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  // Dialog states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Filter and sort states
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    score: "all",
  });

  const [sort, setSort] = useState({
    field: "created_at",
    direction: "desc" as "asc" | "desc",
  });

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
        setFilteredApplications(data || []);
        if (data && data.length > 0) {
          setSelectedApplication(data[0]);
        }
      }
      setLoading(false);
    }
    fetchApplications();
  }, [isAdmin]);

  // Apply filters to applications
  useEffect(() => {
    let result = [...applications];

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((app) => app.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filters.dateRange === "today") {
        result = result.filter((app) => {
          const appDate = new Date(app.created_at || "");
          return appDate >= today;
        });
      } else if (filters.dateRange === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        result = result.filter((app) => {
          const appDate = new Date(app.created_at || "");
          return appDate >= weekStart;
        });
      } else if (filters.dateRange === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        result = result.filter((app) => {
          const appDate = new Date(app.created_at || "");
          return appDate >= monthStart;
        });
      }
    }

    // Apply score filter
    if (filters.score !== "all") {
      if (filters.score === "high") {
        result = result.filter((app) => (app.match_score || 0) >= 80);
      } else if (filters.score === "medium") {
        result = result.filter((app) => {
          const score = app.match_score || 0;
          return score >= 50 && score < 80;
        });
      } else if (filters.score === "low") {
        result = result.filter((app) => (app.match_score || 0) < 50);
      }
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.name?.toLowerCase().includes(term) ||
          app.email?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sort.field as keyof Application];
      const fieldB = b[sort.field as keyof Application];

      // Handle null/undefined values
      if (fieldA === undefined || fieldA === null)
        return sort.direction === "asc" ? -1 : 1;
      if (fieldB === undefined || fieldB === null)
        return sort.direction === "asc" ? 1 : -1;

      // Compare based on type
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sort.direction === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        // For numbers and dates
        return sort.direction === "asc"
          ? fieldA < fieldB
            ? -1
            : fieldA > fieldB
            ? 1
            : 0
          : fieldB < fieldA
          ? -1
          : fieldB > fieldA
          ? 1
          : 0;
      }
    });

    setFilteredApplications(result);
  }, [applications, filters, sort, searchTerm]);

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

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleApplySort = (newSort: typeof sort) => {
    setSort(newSort);
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDialogOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CandidateList
            applications={filteredApplications}
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

      {/* Dialogs */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <SortDialog
        open={sortDialogOpen}
        onOpenChange={setSortDialogOpen}
        onApplySort={handleApplySort}
        currentSort={sort}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        applications={filteredApplications}
      />
    </div>
  );
}
