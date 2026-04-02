import { useEffect, useState } from "react";
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
import { useCreateStudent, useGetDepartments } from "../controllers/studentsController";
import { useGetPrograms } from "../controllers/programController";
import { useColleges } from "../controllers/collegesController";

const GENDERS = ["Male", "Female", "Other"];



// Generate year options for batch start (last 10 years)
const currentYear = new Date().getFullYear();
// Only allow batch years up to current year (no future batches)
const START_YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);
const DURATIONS = [3, 4, 5]; // years

const EMPTY_FORM = {
  first_name: "", last_name: "", email: "",
  college_id: "",
  department_id: "",
  program_id: "",
  batch_start: "", batch_duration: "4",
  current_semester: "",
  date_of_birth: null, gender: "",
};

// Auto-generate enrollment number
function generateEnrollmentNumber(deptCode = "GEN", batchStart = "") {
  const year = batchStart ? String(batchStart).slice(2) : String(currentYear).slice(2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${year}${deptCode.toUpperCase().slice(0, 3)}${random}`;
}

export default function AddStudentPopUp({ open, onOpenChange, onAddStudent, collegeId }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, college_id: collegeId || "" }));
  const [errors, setErrors] = useState({});
  const [createdStudent, setCreatedStudent] = useState(null);
  const [dobOpen, setDobOpen] = useState(false);

  const createStudentMutation = useCreateStudent();
  const { data: colleges = [], isLoading: collegesLoading } = useColleges();
  const activeCollegeId = form.college_id || collegeId;
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartments(activeCollegeId);
  const { data: programs = [], isLoading: programsLoading } = useGetPrograms(
    activeCollegeId,
    form.department_id || undefined
  );

  const batchYear = form.batch_start && form.batch_duration
    ? `${form.batch_start}-${Number(form.batch_start) + Number(form.batch_duration)}`
    : "";

  const validate = () => {
    const e = {};

    // ... your existing validations ...

    // ✅ Batch start can't be in the future
    if (form.batch_start && Number(form.batch_start) > currentYear) {
      e.batch_start = "Batch cannot start in the future";
    }

    // ✅ Batch must not have fully ended
    if (form.batch_start && form.batch_duration) {
      const endYear = Number(form.batch_start) + Number(form.batch_duration);
      if (endYear < currentYear) {
        e.batch_start = `This batch ended in ${endYear}. Cannot add students to a completed batch.`;
      }
    }

    // ✅ Semester must be in the valid range for selected batch
    const validSems = getAvailableSemesters();
    if (form.current_semester && !validSems.includes(Number(form.current_semester))) {
      e.current_semester = "Semester is not valid for the selected batch and current date";
    }

    // ✅ Age validation — must be between 15 and 35
    if (form.date_of_birth) {
      const dob = form.date_of_birth instanceof Date ? form.date_of_birth : new Date(form.date_of_birth);
      const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 15) e.date_of_birth = "Student must be at least 15 years old";
      if (age > 35) e.date_of_birth = "Age seems too high — please verify";
    }

    // ✅ Email must match college domain (optional but professional)
    // Uncomment and set your domain if you want this:
    // if (form.email && !form.email.endsWith("@vit.ac.in")) {
    //   e.email = "Must use official college email (@vit.ac.in)";
    // }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getAvailableSemesters = () => {
    if (!form.batch_start || !form.batch_duration) return [];

    const startYear = Number(form.batch_start);
    const duration = Number(form.batch_duration);
    const totalSems = duration * 2;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1–12

    if (startYear > currentYear) return []; // future batch — no semesters yet

    // How many 6-month blocks have elapsed since batch start (July of start year)?
    // Sem 1: Jul–Dec of startYear
    // Sem 2: Jan–Jun of startYear+1
    // Sem 3: Jul–Dec of startYear+1 ...
    const monthsElapsed =
      (currentYear - startYear) * 12 + (currentMonth - 7); // July = month 7 = sem1 start

    // Each semester = 6 months. +1 because we're *in* the current semester
    const currentSem = Math.floor(monthsElapsed / 6) + 1;

    // Clamp between 1 and totalSems
    const maxSem = Math.min(Math.max(currentSem, 1), totalSems);

    return Array.from({ length: maxSem }, (_, i) => i + 1);
  };




  const handleSubmit = () => {
    if (!validate()) return;
    if (!form.college_id && !collegeId) {
      alert("Please select a college.");
      return;
    }

    const selectedDept = departments.find(d => String(d.id) === String(form.department_id));
    const enrollmentNumber = generateEnrollmentNumber(selectedDept?.code, form.batch_start);

    createStudentMutation.mutate({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      college_id: form.college_id || collegeId,
      department_id: form.department_id,
      program_id: form.program_id,      // ← add this
      enrollment_number: enrollmentNumber,
      batch_year: batchYear ? String(batchYear) : undefined,
      current_semester: Number(form.current_semester),
      date_of_birth: form.date_of_birth ? form.date_of_birth.toISOString().split("T")[0] : undefined,
      gender: form.gender,
    }, {
      onSuccess: (data) => {
        setCreatedStudent({ ...data, enrollment_number: enrollmentNumber });
        onAddStudent?.(data);
      },
    });
  };

  const handleClose = () => {
    setForm({ ...EMPTY_FORM, college_id: collegeId || "" });
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

  useEffect(() => {
    const validSems = getAvailableSemesters();
    if (!validSems.includes(Number(form.current_semester))) {
      setForm((p) => ({ ...p, current_semester: "" }));
    }
  }, [form.batch_start, form.batch_duration]);

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

          {/* College */}
          <div>
            <Label className="mb-2">College</Label>
            <Select
              value={form.college_id}
              onValueChange={(v) => setForm((p) => ({ ...p, college_id: v, department_id: "", program_id: "" }))}
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
              value={form.department_id}
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
                    programsLoading ? "Loading…" :
                      programs.length === 0 ? "No programs found for this department" :
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
                {getAvailableSemesters().map((s) => {
                  const isLast = s === getAvailableSemesters().length;
                  return (
                    <SelectItem key={s} value={String(s)}>
                      Semester {s} {isLast ? "· Current" : "· Completed"}
                    </SelectItem>
                  );
                })}
                {getAvailableSemesters().length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    {!form.batch_start
                      ? "Select batch start year first"
                      : Number(form.batch_start) > currentYear
                        ? "Future batch — no active semesters"
                        : "No active semesters for this batch"}
                  </div>
                )}
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
            {createStudentMutation.error?.response?.data?.error ||
              createStudentMutation.error?.message ||
              "Something went wrong. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}