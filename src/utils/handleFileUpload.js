import * as XLSX from "xlsx";
import Papa from "papaparse";

export const handleFileUpload = (e, callback) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileType = file.name.split(".").pop().toLowerCase();

  const processData = (rawData) => {
    // Map flat spreadsheet rows to the nested structure used in Students.js
  const formattedData = rawData.map((row) => ({
  first_name:        row["first_name"]  || "",
  last_name:         row["last_name"]   || "",
  email:             row["email"]       || "",
  college_id:        row["college_id"]  || "",
  department_id:     Number(row["department_id"])    || null,
  program_id:        Number(row["program_id"])       || null,
  enrollment_number: row["enrollment_number"]        || "",
  batch_year:        row["batch_year"]               || "",
  current_semester:  Number(row["current_semester"]) || null,
  date_of_birth:     row["date_of_birth"]            || "",
  gender:            row["gender"]                   || "",
  admission_score:   Number(row["admission_score"])  || null,
}));

    if (callback) callback(formattedData);
  };

  if (fileType === "csv") {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => processData(results.data),
    });
  } else if (fileType === "xlsx" || fileType === "xls") {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      processData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Unsupported file type");
  }
};