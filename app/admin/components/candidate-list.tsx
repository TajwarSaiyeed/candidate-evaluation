// components/admin/CandidateList.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getInitials, getScoreColor, getStatusColor } from "@/lib/utils";
import { Application } from "@/types";


interface CandidateListProps {
  applications: Application[];
  selectedApplication: Application | null;
  setSelectedApplication: (application: Application | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  applications,
  selectedApplication,
  setSelectedApplication,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredApplications = applications.filter(
    (application) =>
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.skills &&
        application.skills.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
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
                  selectedApplication?.id === application.id ? "bg-muted" : ""
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
  );
};

export default CandidateList;
