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

const GENDERS    = ["Male", "Female", "Other"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

const EMPTY_FORM = {
  first_name: "", last_name: "", email: "",
  department_id: "", enrollment_number: "",
  batch_year: "", current_semester: "",
  date_of_birth: "", gender: "", category: "",
  admission_score: "",
};

export default function AddStudentDialog({ open, onOpenChange, onAddStudent, collegeId }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const createStudentMutation = useCreateStudent();
  const { data: departments = [], isLoading: deptsLoading } = useGetDepartments(collegeId);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim())          e.first_name        = "Required";
    if (!form.last_name.trim())           e.last_name         = "Required";
    if (!form.email.trim())               e.email             = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email             = "Enter a valid email";
    if (!form.department_id)              e.department_id     = "Select a department";
    if (!form.enrollment_number.trim())   e.enrollment_number = "Required";
    if (!form.batch_year.trim())          e.batch_year        = "Required";
    if (!form.current_semester)           e.current_semester  = "Required";
    if (!form.date_of_birth)              e.date_of_birth     = "Required";
    if (!form.gender)                     e.gender            = "Required";
    if (!form.category)                   e.category          = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!collegeId) {
      alert("College context missing. Please refresh and try again.");
      return;
    }

    createStudentMutation.mutate({
      first_name:        form.first_name,
      last_name:         form.last_name,
      email:             form.email,
      college_id:        collegeId,
      department_id:     form.department_id,
      enrollment_number: form.enrollment_number,
      batch_year:        form.batch_year,
      current_semester:  Number(form.current_semester),
      date_of_birth:     form.date_of_birth,
      gender:            form.gender,
      category:          form.category,
      admission_score:   form.admission_score ? Number(form.admission_score) : null,
    }, {
      onSuccess: (data) => {
        onAddStudent?.(data);
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-10 w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            A login account is created automatically. Default password = enrollment number.
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Department</Label>
              <Select
                value={form.department_id}
                onValueChange={(v) => setForm((p) => ({ ...p, department_id: v }))}
                disabled={deptsLoading || !collegeId}
              >
                <SelectTrigger className={errors.department_id ? "border-red-400" : ""}>
                  <SelectValue placeholder={
                    !collegeId       ? "No college context" :
                    deptsLoading     ? "Loading…" :
                    departments.length === 0 ? "No departments found" :
                    "Select department"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("department_id")}
            </div>
            <div>
              <Label className="mb-2">Enrollment Number</Label>
              <Input placeholder="e.g. 22CSE001" {...field("enrollment_number")} />
              {err("enrollment_number")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Batch Year</Label>
              <Input placeholder="e.g. 2022-2026" {...field("batch_year")} />
              {err("batch_year")}
            </div>
            <div>
              <Label className="mb-2">Current Semester</Label>
              <Input type="number" min={1} max={8} placeholder="1 – 8" {...field("current_semester")} />
              {err("current_semester")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className={errors.category ? "border-red-400" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {err("category")}
            </div>
            <div>
              <Label className="mb-2">
                Admission Score <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input type="number" placeholder="e.g. 95.4" {...field("admission_score")} />
            </div>
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