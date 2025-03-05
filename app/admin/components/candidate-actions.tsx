"use client";

import { Button } from "@/components/ui/button";
import { Application } from "@/types";

interface CandidateActionsProps {
  selectedApplication: Application;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
}

const CandidateActions: React.FC<CandidateActionsProps> = ({
  selectedApplication,
  updateApplicationStatus,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() =>
          updateApplicationStatus(selectedApplication.id, "Shortlisted")
        }
        variant={
          selectedApplication.status === "Shortlisted" ? "default" : "outline"
        }
      >
        Shortlist
      </Button>
      <Button
        size="sm"
        variant={
          selectedApplication.status === "Under Review" ? "default" : "outline"
        }
        onClick={() =>
          updateApplicationStatus(selectedApplication.id, "Under Review")
        }
      >
        Under Review
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          updateApplicationStatus(selectedApplication.id, "Schedule Interview")
        }
      >
        Schedule Interview
      </Button>
      <Button
        size="sm"
        variant={
          selectedApplication.status === "Rejected" ? "destructive" : "outline"
        }
        onClick={() =>
          updateApplicationStatus(selectedApplication.id, "Rejected")
        }
      >
        Reject
      </Button>
    </div>
  );
};

export default CandidateActions;
