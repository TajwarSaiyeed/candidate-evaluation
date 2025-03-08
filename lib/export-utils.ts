import type { Application } from "@/types";

export function exportToCSV(applications: Application[]) {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Job Title",
    "Match Score",
    "Technical Score",
    "Experience Score",
    "Education Score",
    "Applied Date",
  ];

  const rows = applications.map((app) => [
    app.id,
    app.name || "",
    app.email || "",
    app.status || "",
    app.match_score?.toString() || "",
    app.technical_score?.toString() || "",
    app.experience_score?.toString() || "",
    app.education_score?.toString() || "",
    app.created_at ? new Date(app.created_at).toLocaleDateString() : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `applications_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(applications: Application[]) {
  const jsonString = JSON.stringify(applications, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `applications_export_${new Date().toISOString().split("T")[0]}.json`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
