// utils/studentTemplateDownload.js
import api from "../services/api";
import { STUDENT_API } from "../constants/apiUrlConstant";

export const handleDownloadTemplate = async (collegeId) => {
  if (!collegeId) {
    alert("College context missing. Please refresh and try again.");
    return;
  }

  try {
    const res = await api.get(STUDENT_API.DEPARTMENTS, {
      params: { college_id: collegeId }
    });
    const depts = res?.departments ?? res?.data?.departments ?? [];

    const headers = [
      "first_name", "last_name", "email",
      "enrollment_number", "department_id",
      "batch_year", "current_semester",
      "date_of_birth", "gender", "admission_score"
    ];

    const deptInfo = depts.map(d => `${d.id}=${d.name}`).join(" | ");
    const commentRow = [`# Valid department_ids: ${deptInfo}`];

    const exampleRows = depts.map((d, i) => [
      "First", "Last",
      `student${i + 1}@college.edu`,
      `EN2025_00${i + 1}`,
      d.id,
      "2025", "3",
      "2003-01-01", "Male", "80.0"
    ]);

    const csvContent = [commentRow, headers, ...exampleRows]
      .map(row => row.map(v => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Template download failed:", err);
    alert("Failed to generate template. Please try again.");
  }
};