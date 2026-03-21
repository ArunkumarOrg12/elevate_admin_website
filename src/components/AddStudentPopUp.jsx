import { useState } from "react";
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
import { useCreateStudent, useGetDepartments } from "../controllers/studentsController";
import { useGetPrograms } from "../controllers/programController";

const GENDERS = ["Male", "Female", "Other"];

// Generate year options for batch start (last 10 years)
const currentYear = new Date().getFullYear();
const START_YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);
const DURATIONS = [3, 4, 5]; // years

const EMPTY_FORM = {
  first_name: "", last_name: "", email: "",
  department_id: "",
  program_id: "",           
  batch_start: "", batch_duration: "4",
  current_semester: "",
  date_of_birth: "", gender: "",
};

// Auto-generate enrollment number
function generateEnrollmentNumber(deptCode = "GEN", batchStart = "") {
  const year = batchStart ? String(batchStart).slice(2) : String(currentYear).slice(2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${year}${deptCode.toUpperCase().slice(0, 3)}${random}`;
}

export default function AddStudentPopUp({ open, onOpenChange, onAddStudent, collegeId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [createdStudent, setCreatedStudent] = useState(null); // show after success

  const createStudentMutation = useCreateStudent();
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartments(collegeId);
const { data: programs = [], isLoading: programsLoading } = useGetPrograms(
  collegeId,
  form.department_id || undefined   // ← only fetch when department selected
);

  const batchYear = form.batch_start && form.batch_duration
    ? `${form.batch_start}-${Number(form.batch_start) + Number(form.batch_duration)}`
    : "";

 const validate = () => {
  const e = {};
  if (!form.first_name.trim())        e.first_name       = "Required";
  if (!form.last_name.trim())         e.last_name        = "Required";
  if (!form.email.trim())             e.email            = "Required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Enter a valid email";
  if (!form.department_id)            e.department_id    = "Select a department";
  if (!form.program_id)               e.program_id       = "Select a program";   // ← add
  if (!form.batch_start)              e.batch_start      = "Select start year";
  if (!form.current_semester)         e.current_semester = "Required";
  if (!form.date_of_birth)            e.date_of_birth    = "Required";
  if (!form.gender)                   e.gender           = "Required";
  setErrors(e);
  return Object.keys(e).length === 0;
};

  const handleSubmit = () => {
    if (!validate()) return;
    if (!collegeId) {
      alert("College context missing. Please refresh and try again.");
      return;
    }

    const selectedDept = departments.find(d => String(d.id) === String(form.department_id));
    const enrollmentNumber = generateEnrollmentNumber(selectedDept?.code, form.batch_start);

    createStudentMutation.mutate({
       first_name:        form.first_name,
  last_name:         form.last_name,
  email:             form.email,
  college_id:        collegeId,
  department_id:     form.department_id,
  program_id:        form.program_id,      // ← add this
  enrollment_number: enrollmentNumber,
  batch_year:        batchYear,
  current_semester:  Number(form.current_semester),
  date_of_birth:     form.date_of_birth,
  gender:            form.gender,
    }, {
      onSuccess: (data) => {
        setCreatedStudent({ ...data, enrollment_number: enrollmentNumber });
        onAddStudent?.(data);
      },
    });
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setCreatedStudent(null);
    onOpenChange(false);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
    className: errors[key] ? "border-red-400 focus:ring-red-400" : "",
  });

  const err = (key) => errors[key] && (
    <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>
  );

  // ── Success screen ──────────────────────────────────────────────
  if (createdStudent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <DialogTitle>Student Created!</DialogTitle>
          <DialogDescription>
            Share these login credentials with the student.
          </DialogDescription>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium">{createdStudent.first_name} {createdStudent.last_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{createdStudent.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Enrollment Number (= default password)</p>
              <p className="text-sm font-bold text-indigo-600 tracking-wider">
                {createdStudent.enrollment_number}
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={handleClose}>Done</Button>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-10 w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Enrollment number is auto-generated and used as the default login password.
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
              <Input placeholder="e.g. Arjun" {...field("first_name")} />
              {err("first_name")}
            </div>
            <div>
              <Label className="mb-2">Last Name</Label>
              <Input placeholder="e.g. Sharma" {...field("last_name")} />
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
              {err("date_of_birth")}
            </div>
            <div>
              <Label className="mb-2">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
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
    value={form.department_id}
    onValueChange={(v) => setForm((p) => ({ ...p, department_id: v, program_id: "" }))}
    disabled={deptsLoading || !collegeId}
  >
    <SelectTrigger className={errors.department_id ? "border-red-400" : ""}>
      <SelectValue placeholder={
        !collegeId               ? "No college context" :
        deptsLoading             ? "Loading…" :
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

{/* Program — only shown after department is selected */}
{form.department_id && (
  <div>
    <Label className="mb-2">Program</Label>
    <Select
      value={form.program_id}
      onValueChange={(v) => setForm((p) => ({ ...p, program_id: v }))}
      disabled={programsLoading}
    >
      <SelectTrigger className={errors.program_id ? "border-red-400" : ""}>
        <SelectValue placeholder={
          programsLoading          ? "Loading…" :
          programs.length === 0    ? "No programs found for this department" :
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
    {!programsLoading && programs.length === 0 && (
      <p className="text-xs text-amber-600 mt-1">
        No programs found. Add programs to this department first.
      </p>
    )}
  </div>
)}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2">Batch Start Year</Label>
              <Select value={form.batch_start} onValueChange={(v) => setForm((p) => ({ ...p, batch_start: v }))}>
                <SelectTrigger className={errors.batch_start ? "border-red-400" : ""}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {START_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("batch_start")}
            </div>
            <div>
              <Label className="mb-2">Duration (years)</Label>
              <Select value={form.batch_duration} onValueChange={(v) => setForm((p) => ({ ...p, batch_duration: v }))}>
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

          <div>
            <Label className="mb-2">Current Semester</Label>
            <Select
              value={form.current_semester}
              onValueChange={(v) => setForm((p) => ({ ...p, current_semester: v }))}
            >
              <SelectTrigger className={errors.current_semester ? "border-red-400" : ""}>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                  <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("current_semester")}
          </div>

        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={createStudentMutation.isPending}>
            {createStudentMutation.isPending ? "Creating…" : "Add Student"}
          </Button>
        </DialogFooter>

        {createStudentMutation.isError && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {createStudentMutation.error?.response?.data?.message ||
             createStudentMutation.error?.message ||
             "Something went wrong. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}