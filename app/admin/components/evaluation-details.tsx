"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Application } from "@/types";

interface EvaluationDetailsProps {
  selectedApplication: Application;
}

const EvaluationDetails: React.FC<EvaluationDetailsProps> = ({
  selectedApplication,
}) => {
  return (
    <>
      <div>
        <h3 className="text-sm font-medium mb-2">Skill Breakdown</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Technical Skills</span>
              <span>
                {selectedApplication.technical_score
                  ? `${selectedApplication.technical_score}%`
                  : "N/A"}
              </span>
            </div>
            <Progress
              value={selectedApplication.technical_score || 0}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Experience</span>
              <span>
                {selectedApplication.experience_score
                  ? `${selectedApplication.experience_score}%`
                  : "N/A"}
              </span>
            </div>
            <Progress
              value={selectedApplication.experience_score || 0}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Education</span>
              <span>
                {selectedApplication.education_score
                  ? `${selectedApplication.education_score}%`
                  : "N/A"}
              </span>
            </div>
            <Progress
              value={selectedApplication.education_score || 0}
              className="h-2"
            />
          </div>
        </div>
      </div>

      <Separator />

      {selectedApplication.recommendations &&
        selectedApplication.recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recommended Next Steps</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {selectedApplication.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
    </>
  );
};

export default EvaluationDetails;
