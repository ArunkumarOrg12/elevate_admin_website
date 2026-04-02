import { useState } from "react";
import {
  Download, SlidersHorizontal, Search,
  ChevronUp, ChevronDown, Plus, Eye, Pencil, Trash2,
} from "lucide-react";
import { Users, UserCheck, BookOpen, AlertTriangle } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/components/ui/table";

import { useAuth } from "../hooks/useAuth";
import { useDeleteAdmin, useGetAllAdmins } from "../controllers/adminController";
import AddAdminDialog from "../components/AddAdminPopUp";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";

const ROLES = ["All", "superadmin", "college_admin"];


function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronUp size={12} className="text-gray-300" />;
  return sortDir === "asc"
    ? <ChevronUp  size={12} className="text-indigo-600" />
    : <ChevronDown size={12} className="text-indigo-600" />;
}

export default function Admins() {
  const [search, setSearch]         = useState("");
  const [role, setRole] = useState("All"); 
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir]       = useState("desc");
  const [page, setPage]             = useState(1);
  const [showAddDialog, setShowAddDialog]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // admin to delete
  const [selectedAdmin, setSelectedAdmin] = useState(null); // for detail popup
  const PER_PAGE = 8;

  const { user } = useAuth();
 const { data: responseData, isLoading, isError,error } = useGetAllAdmins();
const deleteAdminMutation = useDeleteAdmin();




const rawUsers = responseData?.admins || [];

const admins = rawUsers
  .filter((u) => u.id !== user?.id)  // ← exclude currently logged-in admin
  .map((u) => ({
    id: u.id,
    name: `${u.first_name} ${u.last_name}`,
    email: u.email,
    role: u.role,
    college: u.college?.name || "N/A",
    lastLogin: u.last_login ? new Date(u.last_login) : null,
    createdAt: new Date(u.createdAt),
  }));

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  };

  // ✅ Opens detail popup instead of navigating
//  const handleView = (admin) => setSelectedAdmin(admin);

// const handleEdit = (admin) => {
//   console.log("Edit admin:", admin.id);
// };

const handleDelete = () => {
  deleteAdminMutation.mutate(deleteTarget.id, {
    onSuccess: () => setDeleteTarget(null),
  });
};

 let filtered = admins.filter((a) => {
  const q = search.toLowerCase();

  if (
    q &&
    !a.name.toLowerCase().includes(q) &&
    !a.email.toLowerCase().includes(q)
  ) return false;

  if (role !== "All" && a.role !== role) return false;

  return true;
});

 filtered = [...filtered].sort((a, b) => {
  let va = a[sortField];
  let vb = b[sortField];

  if (va == null) return 1;
  if (vb == null) return -1;

  if (va instanceof Date && vb instanceof Date) {
    return sortDir === "asc"
      ? va.getTime() - vb.getTime()
      : vb.getTime() - va.getTime();
  }

  if (typeof va === "string") {
    return sortDir === "asc"
      ? va.localeCompare(vb)
      : vb.localeCompare(va);
  }

  return sortDir === "asc" ? va - vb : vb - va;
});

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

 const counts = {
  total: admins.length,
  superadmin: admins.filter(a => a.role === "superadmin").length,
  collegeAdmin: admins.filter(a => a.role === "college_admin").length,
};

 const COLS = [
  { key: "name", label: "NAME" },
  { key: "email", label: "EMAIL" },
  { key: "role", label: "ROLE" },
  { key: "college", label: "COLLEGE" },
  { key: "lastLogin", label: "LAST LOGIN" },
  { key: "createdAt", label: "CREATED AT" },
  { key: "actions", label: "ACTIONS" },
];
if (isError) return <div className="p-8 text-red-500">Error: {error?.message} | {JSON.stringify(error?.response?.data)}</div>;
 if (isLoading) return <div className="p-8 text-gray-500">Loading admins…</div>;
// if (isError) return <div className="p-8 text-red-500">Error loading admins.</div>;
if (!responseData) return null;

function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(date);
}

const exportToCSV = () => {
  // Choose what data to export (filtered or all)
  const dataToExport = filtered; // or admins

  if (!dataToExport.length) return;

  const headers = [
    "Name",
    "Email",
    "Role",
    "College",
    "Last Login",
    "Created At",
  ];

  const rows = dataToExport.map((a) => [
    a.name,
    a.email,
    a.role.replace("_", " "),
    a.college,
    a.lastLogin ? formatDate(a.lastLogin) : "Never",
    formatDate(a.createdAt),
  ]);

  // Convert to CSV string
  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

  // Create blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const fileName = `admins_${new Date().toISOString().slice(0,10)}.csv`;


  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

  return (
    <div className="page-enter space-y-5">

      {/* Add Admin dialog */}
     <AddAdminDialog
  open={showAddDialog}
  onOpenChange={setShowAddDialog}
  onAddAdmin={() => setShowAddDialog(false)}  // ← was passing collegeId which dialog doesn't use
/>

      {/* ✅ Student detail popup */}
      {/* <StudentDetailDialog
        open={!!selectedStudent}
        onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}
        student={selectedStudent}
      /> */}


      {/* Delete Confirmation Dialog */}

  {/* Delete Confirmation Dialog */}
<Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
  <DialogContent className="max-w-sm p-4">
    <DialogHeader>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Trash2 size={18} className="text-red-600" />
        </div>
        <div>
          <DialogTitle className="text-sm font-semibold text-gray-900">
            Delete Admin
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            This action cannot be undone
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    <p className="text-sm text-gray-700">
      Are you sure you want to delete{" "}
      <span className="font-semibold">{deleteTarget?.name}</span>?
    </p>

    <DialogFooter className="flex gap-2 pt-2">
      <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={deleteAdminMutation.isPending}
      >
        {deleteAdminMutation.isPending ? "Deleting…" : "Yes, Delete"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


   

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Admins
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {counts.total} admins
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus size={14} /> Add Admins
          </Button>
          <Button variant="secondary" size="sm">
            <SlidersHorizontal size={14} /> Advanced Filters
          </Button>
          <Button size="sm" onClick={exportToCSV}>
  <Download size={14} /> Export
</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL ADMINS" value={counts.total}      icon={Users}         accentColor="blue"    />
        {/* <StatCard label="CAMPUS READY"   value={counts.ready}      icon={UserCheck}     accentColor="emerald" description="EI ≥ 70"  />
        <StatCard label="DEVELOPING"     value={counts.developing} icon={BookOpen}      accentColor="amber"   description="EI 50-69" />
        <StatCard label="AT RISK"        value={counts.atRisk}     icon={AlertTriangle} accentColor="red"     description="EI < 50"  /> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or email"
                className="pl-9"
              />
            </div>
          <select
  value={role}
  onChange={(e) => {
    setRole(e.target.value);
    setPage(1);
  }}
  className="text-sm border border-gray-200 rounded px-3 py-2"
>
  {ROLES.map((r) => (
    <option key={r}>{r}</option>
  ))}
</select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLS.map((c) => (
                <TableHead
                  key={c.key}
                  onClick={() => c.key !== "actions" && handleSort(c.key)}
                  className={c.key !== "actions" ? "cursor-pointer hover:text-gray-700 select-none" : ""}
                >
                  <span className="flex items-center gap-1">
                    {c.label}
                    {c.key !== "actions" && (
                      <SortIcon field={c.key} sortField={sortField} sortDir={sortDir} />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLS.length} className="text-center py-10 text-gray-400">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (paged.map((a) => (
  <TableRow key={a.id} className="hover:bg-gray-50">

    {/* Name */}
    <TableCell>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
          {a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{a.name}</div>
          <div className="text-xs text-gray-400">{a.email}</div>
        </div>
      </div>
    </TableCell>

    {/* Email */}
    <TableCell className="text-sm text-gray-700">{a.email}</TableCell>

    {/* Role */}
    <TableCell>
     <span className={`text-xs px-2 py-1 rounded capitalize
  ${a.role === "superadmin"
    ? "bg-red-50 text-red-600"
    : "bg-blue-50 text-blue-600"
  }`}>
  {a.role.replace("_", " ")}
</span>
    </TableCell>

    {/* College */}
    <TableCell className="text-sm text-gray-700">{a.college}</TableCell>

    {/* Last Login */}
    <TableCell className="text-sm text-gray-500">
      {a.lastLogin ? formatDate(a.lastLogin) : "Never"}
    </TableCell>

    {/* Created */}
    <TableCell className="text-sm text-gray-500">
      {formatDate(a.createdAt)}
    </TableCell>

    {/* Actions */}
    <TableCell>
      <div className="flex items-center gap-1">
        {/* <button
          onClick={() => handleView(a)}
          className="p-1.5 hover:text-indigo-600"
        >
          <Eye size={15} />
        </button>

        <button
          onClick={() => handleEdit(a)}
          className="p-1.5 hover:text-amber-600"
        >
          <Pencil size={15} />
        </button> */}

     {a.role !== "superadmin" && (
  <button
    onClick={() => setDeleteTarget(a)}
    className="p-1.5 hover:text-red-600"
  >
    <Trash2 size={15} />
  </button>
)}
      </div>
    </TableCell>
  </TableRow>
)))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing {total === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, total)}–
            {Math.min(page * PER_PAGE, total)} of {total} admins
          </p>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "ghost"}
                size="icon"
                className={`w-7 h-7 text-xs ${page !== p ? "text-gray-600 hover:bg-gray-200" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}