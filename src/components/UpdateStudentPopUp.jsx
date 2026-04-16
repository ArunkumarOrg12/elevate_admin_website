import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select, SelectTrigger, SelectContent,
  SelectItem, SelectValue,
} from "../components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { useUpdateStudent, useGetDepartments, useGetStudentById } from "../controllers/studentsController";
import { useGetPrograms } from "../controllers/programController";
import { useColleges } from "../controllers/collegesController";

const GENDERS = ["Male", "Female", "Other"];
const currentYear = new Date().getFullYear();
const START_YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);
const DURATIONS = [3, 4, 5];

export default function EditStudentDialog({ open, onOpenChange, student, collegeId }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [dobOpen, setDobOpen] = useState(false);

  const updateStudentMutation = useUpdateStudent();
  const { data: colleges = [], isLoading: collegesLoading } = useColleges();
  const { data: rawStudentResponse } = useGetStudentById(student?.id);
  const rawStudent = rawStudentResponse?.student || rawStudentResponse || {};

  // Use the college from form (if changed) or the prop fallback
  const activeCollegeId = form.college_id || collegeId;

  const { data: departments = [], isLoading: deptsLoading } = useGetDepartments(activeCollegeId);
  const { data: programs = [], isLoading: programsLoading } = useGetPrograms(
    activeCollegeId,
    form.department_id || undefined
  );

  // Parse batch_year safely (handles "2022-2026", "2024", or fallback)
  const parseBatchYear = (batchYear) => {
    const str = String(batchYear || "").trim();
    if (!str || str === "N/A" || str === "undefined") return { batch_start: "", batch_duration: "4" };
    
    if (str.includes("-")) {
      const [start, end] = str.split("-").map(s => s.trim());
      const duration = Number(end) - Number(start);
      return {
        batch_start: start,
        batch_duration: duration > 0 ? String(duration) : "4",
      };
    }
    
    // Fallback if it's just a starting year like "2024"
    if (/^\d{4}$/.test(str)) {
      return { batch_start: str, batch_duration: "4" };
    }
    
    return { batch_start: "", batch_duration: "4" };
  };

  // Populate form when student changes or raw data loads
  useEffect(() => {
    if (!student) return;
    
    // Prefer data fetched by ID over the partially mapped list item
    const batchData = rawStudent?.batch_year || student.batch_year || student.year || "";
    const { batch_start, batch_duration } = parseBatchYear(batchData);
    
    const dOB = rawStudent?.date_of_birth || student.date_of_birth;

    setForm({
      college_id: String(rawStudent?.college_id || student.college_id || collegeId || ""),
      first_name: rawStudent?.first_name || student.name?.split(" ")[0] || "",
      last_name: rawStudent?.last_name || student.name?.split(" ").slice(1).join(" ") || "",
      email: rawStudent?.email || student.email || "",
      department_id: String(rawStudent?.department_id || student.department_id || ""),
      program_id: String(rawStudent?.program_id || student.program_id || ""),
      batch_start,
      batch_duration,
      current_semester: String(rawStudent?.current_semester || student.current_semester || ""),
      date_of_birth: dOB ? new Date(dOB) : null,
      gender: rawStudent?.gender || student.gender || "",
    });
    setErrors({});
  }, [student, rawStudentResponse]);

  const batchYear = form.batch_start && form.batch_duration
    ? `${form.batch_start}-${Number(form.batch_start) + Number(form.batch_duration)}`
    : "";

  const validate = () => {
    const e = {};
    if (!form.college_id) e.college_id = "Select a college";
    if (!form.first_name?.trim()) e.first_name = "Required";
    if (!form.last_name?.trim()) e.last_name = "Required";
    if (!form.email?.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.department_id) e.department_id = "Select a department";
    if (!form.program_id) e.program_id = "Select a program";
    if (!form.gender) e.gender = "Select gender";

    // Age validation
    if (form.date_of_birth) {
      const dob = form.date_of_birth instanceof Date ? form.date_of_birth : new Date(form.date_of_birth);
      const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 15) e.date_of_birth = "Student must be at least 15 years old";
      if (age > 35) e.date_of_birth = "Age seems too high — please verify";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    updateStudentMutation.mutate({
      id: student.id,
      college_id: form.college_id,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      department_id: form.department_id,
      program_id: form.program_id,
      batch_year: batchYear ? String(batchYear) : undefined,
      current_semester: form.current_semester ? Number(form.current_semester) : undefined,
      date_of_birth: form.date_of_birth
        ? (form.date_of_birth instanceof Date
          ? form.date_of_birth.toISOString().split("T")[0]
          : form.date_of_birth)
        : undefined,
      gender: form.gender,
    }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const field = (key) => ({
    value: form[key] || "",
    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
    className: errors[key] ? "border-red-400" : "",
  });

  const err = (key) => errors[key] && (
    <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>
  );

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-10 w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update details for {student.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Personal */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Personal Information
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">First Name</Label>
              <Input placeholder="First name" {...field("first_name")} />
              {err("first_name")}
            </div>
            <div>
              <Label className="mb-2">Last Name</Label>
              <Input placeholder="Last name" {...field("last_name")} />
              {err("last_name")}
            </div>
          </div>

          <div>
            <Label className="mb-2">Email</Label>
            <Input type="email" placeholder="student@college.edu" {...field("email")} />
            {err("email")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Date of Birth</Label>
              <Popover open={dobOpen} onOpenChange={setDobOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2 rounded-[9px] border px-3 py-1.5 text-sm ${errors.date_of_birth ? "border-red-400" : "border-gray-200"
                      } bg-white ${form.date_of_birth ? "text-gray-900" : "text-gray-400"}`}
                  >
                    <CalendarIcon size={14} className="text-gray-400 flex-shrink-0" />
                    {form.date_of_birth ? format(form.date_of_birth, "dd MMM yyyy") : "Pick date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.date_of_birth}
                    onSelect={(d) => {
                      setForm((p) => ({ ...p, date_of_birth: d ?? null }));
                      setDobOpen(false);
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(1950, 0)}
                    endMonth={new Date()}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {err("date_of_birth")}
            </div>
            <div>
              <Label className="mb-2">Gender</Label>
              <Select value={form.gender || ""} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
                <SelectTrigger className={errors.gender ? "border-red-400" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              {err("gender")}
            </div>
          </div>

          {/* Academic */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pt-2">
            Academic Information
          </p>

          {/* College */}
          <div>
            <Label className="mb-2">College</Label>
            <Select
              value={form.college_id ? String(form.college_id) : ""}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, college_id: v, department_id: "", program_id: "" }))
              }
              disabled={collegesLoading}
            >
              <SelectTrigger className={errors.college_id ? "border-red-400" : ""}>
                <SelectValue placeholder={collegesLoading ? "Loading…" : "Select college"} />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("college_id")}
          </div>

          {/* Department */}
          <div>
            <Label className="mb-2">Department</Label>
            <Select
              value={form.department_id ? String(form.department_id) : ""}
              onValueChange={(v) => setForm((p) => ({ ...p, department_id: v, program_id: "" }))}
              disabled={deptsLoading || !activeCollegeId}
            >
              <SelectTrigger className={errors.department_id ? "border-red-400" : ""}>
                <SelectValue placeholder={
                  !activeCollegeId ? "Select college first" :
                    deptsLoading ? "Loading…" :
                      departments.length === 0 ? "No departments found" :
                        "Select department"
                } />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("department_id")}
          </div>

          {/* Program */}
          {form.department_id && (
            <div>
              <Label className="mb-2">Program</Label>
              <Select
                value={form.program_id ? String(form.program_id) : ""}
                onValueChange={(v) => setForm((p) => ({ ...p, program_id: v }))}
                disabled={programsLoading}
              >
                <SelectTrigger className={errors.program_id ? "border-red-400" : ""}>
                  <SelectValue placeholder={
                    programsLoading ? "Loading…" :
                      programs.length === 0 ? "No programs found" :
                        "Select program"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name} {p.code ? `(${p.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("program_id")}
            </div>
          )}

          {/* Batch Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2">Batch Start Year</Label>
              <Select
                value={form.batch_start || ""}
                onValueChange={(v) => setForm((p) => ({ ...p, batch_start: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {START_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Duration (years)</Label>
              <Select
                value={form.batch_duration || "4"}
                onValueChange={(v) => setForm((p) => ({ ...p, batch_duration: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>{d} years</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Batch Year</Label>
              <Input value={batchYear || "—"} disabled className="bg-gray-50 text-gray-500" />
            </div>
          </div>

          {/* Semester */}
          <div>
            <Label className="mb-2">Current Semester</Label>
            <Select
              value={form.current_semester || ""}
              onValueChange={(v) => setForm((p) => ({ ...p, current_semester: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                  <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateStudentMutation.isPending}>
            {updateStudentMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>

        {updateStudentMutation.isError && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {updateStudentMutation.error?.response?.data?.message ||
              updateStudentMutation.error?.message ||
              "Something went wrong. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}