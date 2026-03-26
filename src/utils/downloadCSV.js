const downloadCSV = (data) => {
  if (!data || data.length === 0) return;

  const headers = [
    // Identity
    "Name", "Email", "Roll Number", "Gender", "Date of Birth", "Category",
    // Academic
    "Department", "Batch Year", "Current Semester", "Admission Score",
    // Performance
    "EI Score", "Percentile", "CGPA", "Consistency", "Velocity", "Status",
    // Section breakdown
    "Aptitude Score", "Technical Score", "Behavioral Score", "Communication Score",
    // Meta
    "Last Assessment",
  ];

  const rows = data.map((s) => [
    // Identity
    s.name,
    s.email,
    s.roll,
    s.gender       ?? "",
    s.date_of_birth ?? "",
    s.category     ?? "",
    // Academic
    s.dept,
    s.year,
    s.current_semester ? `Semester ${s.current_semester}` : "",
    s.admission_score  ?? "",
    // Performance
    s.eiScore,
    s.percentile,
    s.cgpa,
    s.consistency,
    s.velocity     ?? "",
    s.status       ?? "",
    // Section breakdown
    s.aptitude_score      ?? "",
    s.technical_score     ?? "",
    s.behavioral_score    ?? "",
    s.communication_score ?? "",
    // Meta
    s.lastAssessment
      ? new Date(s.lastAssessment).toLocaleDateString("en-IN", {
          day:   "2-digit",
          month: "short",
          year:  "numeric",
        })
      : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const timestamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute("download", `students_export_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // ✅ free memory
};

export default downloadCSV;