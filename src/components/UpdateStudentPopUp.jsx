import { useState, useEffect } from "react";
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
import { useUpdateStudent } from "../controllers/studentsController";
import { useGetDepartments } from "../controllers/studentsController";
import { useGetPrograms } from "../controllers/programController";

const GENDERS = ["Male", "Female", "Other"];
const currentYear = new Date().getFullYear();
const START_YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);
const DURATIONS = [3, 4, 5];

export default function EditStudentDialog({ open, onOpenChange, student, collegeId }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const updateStudentMutation = useUpdateStudent();
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartments(collegeId);
  const { data: programs = [], isLoading: programsLoading } = useGetPrograms(
    collegeId,
    form.department_id || undefined
  );

  // Parse batch_year like "2022-2026" back into start + duration
  const parseBatchYear = (batchYear) => {
    if (!batchYear || !String(batchYear).includes("-")) return { batch_start: "", batch_duration: "4" };
    const [start, end] = String(batchYear).split("-");
    return {
      batch_start:    start,
      batch_duration: String(Number(end) - Number(start)),
    };
  };

  // Populate form when student changes
  useEffect(() => {
    if (!student) return;
    const { batch_start, batch_duration } = parseBatchYear(student.year);
    setForm({
      first_name:        student.name?.split(" ")[0] || "",
      last_name:         student.name?.split(" ").slice(1).join(" ") || "",
      email:             student.email || "",
      department_id:     student.department_id || "",
      program_id:        student.program_id || "",
      batch_start,
      batch_duration,
      current_semester:  String(student.current_semester || ""),
      date_of_birth:     student.date_of_birth || "",
      gender:            student.gender || "",
    });
    setErrors({});
  }, [student]);

  const batchYear = form.batch_start && form.batch_duration
    ? `${form.batch_start}-${Number(form.batch_start) + Number(form.batch_duration)}`
    : "";

  const validate = () => {
    const e = {};
    if (!form.first_name?.trim()) e.first_name = "Required";
    if (!form.last_name?.trim())  e.last_name  = "Required";
    if (!form.email?.trim())      e.email      = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.department_id)      e.department_id = "Select a department";
    if (!form.program_id)         e.program_id    = "Select a program";
    if (!form.gender)             e.gender        = "Select gender";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    updateStudentMutation.mutate({
      id:               student.id,
      first_name:       form.first_name,
      last_name:        form.last_name,
      email:            form.email,
      department_id:    form.department_id,
      program_id:       form.program_id,
      batch_year:       batchYear || undefined,
      current_semester: form.current_semester ? Number(form.current_semester) : undefined,
      date_of_birth:    form.date_of_birth || undefined,
      gender:           form.gender,
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
              <Input type="date" {...field("date_of_birth")} />
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

          {/* Department */}
          <div>
            <Label className="mb-2">Department</Label>
            <Select
              value={form.department_id ? String(form.department_id) : ""}
              onValueChange={(v) => setForm((p) => ({ ...p, department_id: v, program_id: "" }))}
              disabled={deptsLoading}
            >
              <SelectTrigger className={errors.department_id ? "border-red-400" : ""}>
                <SelectValue placeholder={deptsLoading ? "Loading…" : "Select department"} />
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
                    programsLoading       ? "Loading…" :
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