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
import { useCreateAdmin, useGetColleges } from "../controllers/adminController";

const ROLES = ["superadmin", "college_admin"];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
  college_id: "",
};

export default function AddAdminDialog({ open, onOpenChange, onAddAdmin }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const createAdminMutation = useCreateAdmin();
  const { data: colleges = [], isLoading: collegesLoading } = useGetColleges();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password.trim()) e.password = "Required";
    if (!form.role) e.role = "Select a role";
    if (!form.college_id) e.college_id = "Select a college";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

 const handleSubmit = () => {
  if (!validate()) return;

  const [first_name, ...rest] = form.name.trim().split(" ");
  const last_name = rest.join(" ") || "."; // fallback if single name

  createAdminMutation.mutate(
    {
      first_name,
      last_name,
      email: form.email,
      password: form.password,
      role: form.role,
      college_id: form.college_id,
    },
    {
      onSuccess: (data) => {
        onAddAdmin?.(data);
        handleClose();
      },
    }
  );
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
      <DialogContent className="max-w-2xl p-8 w-full">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account. Password will be used for login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input placeholder="Full Name" {...field("name")} />
            {err("name")}
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input type="email" placeholder="admin@college.edu" {...field("email")} />
            {err("email")}
          </div>

          {/* Password */}
          <div>
            <Label className="mb-2">Password</Label>
            <Input type="password" placeholder="Enter password" {...field("password")} />
            {err("password")}
          </div>

          {/* Role */}
          <div>
            <Label className="mb-2">Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}>
              <SelectTrigger className={errors.role ? "border-red-400" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            {err("role")}
          </div>

          {/* College */}
          <div>
            <Label className="mb-2">College</Label>
            <Select
              value={form.college_id}
              onValueChange={(v) => setForm((p) => ({ ...p, college_id: v }))}
              disabled={collegesLoading}
            >
              <SelectTrigger className={errors.college_id ? "border-red-400" : ""}>
                <SelectValue placeholder={
                  collegesLoading ? "Loading…" :
                  colleges.length === 0 ? "No colleges found" :
                  "Select college"
                } />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("college_id")}
          </div>

        </div>

        <DialogFooter className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={createAdminMutation.isPending}>
            {createAdminMutation.isPending ? "Creating…" : "Add Admin"}
          </Button>
        </DialogFooter>

        {createAdminMutation.isError && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {createAdminMutation.error?.response?.data?.error ||
             createAdminMutation.error?.message ||
             "Something went wrong. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}