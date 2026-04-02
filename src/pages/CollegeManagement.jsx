// CollegeManagement.jsx
import { useState } from 'react';
import { Plus, Edit2, Trash2, Building, X, Globe, Mail, Phone, MapPin, Hash, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  useColleges, useCreateCollege,
  useUpdateCollege, useDeleteCollege,
} from '../controllers/collegesController';
import { getEIColor } from '../utils/helpers';

// ── Form shape matching CollegeAttributes ─────────────────────────────────────
const EMPTY_FORM = {
  name:          '',
  code:          '',
  domain:        '',
  address:       '',
  contact_email: '',
  contact_phone: '',
};

// ── Reusable field error ──────────────────────────────────────────────────────
function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-0.5">{msg}</p> : null;
}

// ── Add / Edit dialog ─────────────────────────────────────────────────────────
function CollegeFormDialog({ open, onOpenChange, college }) {
  const isEdit = !!college;
  const [form, setForm]     = useState(isEdit ? {
    name:          college.name          ?? '',
    code:          college.code          ?? '',
    domain:        college.domain        ?? '',
    address:       college.address       ?? '',
    contact_email: college.contact_email ?? '',
    contact_phone: college.contact_phone ?? '',
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const createMutation = useCreateCollege();
  const updateMutation = useUpdateCollege();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = 'College name is required';
    if (!form.code.trim())        e.code = 'College code is required';
    else if (!/^[A-Z0-9_]+$/i.test(form.code)) e.code = 'Code must be alphanumeric (e.g. VIT01)';
    if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email))
      e.contact_email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      name:          form.name.trim(),
      code:          form.code.trim().toUpperCase(),
      domain:        form.domain.trim()        || null,
      address:       form.address.trim()       || null,
      contact_email: form.contact_email.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
    };

    if (isEdit) {
      updateMutation.mutate({ id: college.id, ...payload }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const apiError =
    createMutation.error?.response?.data?.message ||
    updateMutation.error?.response?.data?.message;



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit College' : 'Add College'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update college details below.' : 'Fill in the details to register a new institution.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Name + Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <Building size={12} className="text-gray-400" /> College Name <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="e.g. VIT University"
                value={form.name}
                onChange={set('name')}
                className={errors.name ? 'border-red-400' : ''}
              />
              <FieldError msg={errors.name} />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <Hash size={12} className="text-gray-400" /> College Code <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="e.g. VIT01"
                value={form.code}
                onChange={set('code')}
                disabled={isEdit} // code is immutable after creation
                className={errors.code ? 'border-red-400' : isEdit ? 'bg-gray-50 text-gray-400' : ''}
              />
              {isEdit
                ? <p className="text-xs text-gray-400 mt-0.5">Code cannot be changed after creation</p>
                : <FieldError msg={errors.code} />}
            </div>
          </div>

          {/* Domain */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1.5">
              <Globe size={12} className="text-gray-400" /> Domain
            </Label>
            <Input
              placeholder="e.g. vit.ac.in"
              value={form.domain}
              onChange={set('domain')}
            />
          </div>

          {/* Address */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-400" /> Address
            </Label>
            <Input
              placeholder="e.g. Vellore, Tamil Nadu"
              value={form.address}
              onChange={set('address')}
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <Mail size={12} className="text-gray-400" /> Contact Email
              </Label>
              <Input
                type="email"
                placeholder="admin@vit.ac.in"
                value={form.contact_email}
                onChange={set('contact_email')}
                className={errors.contact_email ? 'border-red-400' : ''}
              />
              <FieldError msg={errors.contact_email} />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <Phone size={12} className="text-gray-400" /> Contact Phone
              </Label>
              <Input
                placeholder="+91 9876543210"
                value={form.contact_phone}
                onChange={set('contact_phone')}
              />
            </div>
          </div>

        </div>

        {apiError && (
          <p className="text-sm text-red-500 text-center">{apiError}</p>
        )}

        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Add College')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete confirmation dialog ────────────────────────────────────────────────
function DeleteCollegeDialog({ open, onOpenChange, college }) {
  const deleteMutation = useDeleteCollege();

  const handleDelete = () => {
    deleteMutation.mutate(college.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold text-gray-900">Delete College</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-gray-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{college?.name}</span>?
          All associated departments, programs, and students will be affected.
        </p>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CollegeManagement() {
  const [showAdd, setShowAdd]         = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useColleges();

  // Handle both response shapes: { colleges: [...] } or direct array
  const colleges = data?.colleges ?? data?.data?.colleges ?? data ?? [];

  const totalStudents = colleges.reduce((a, c) => a + (c.students ?? 0), 0);
  const avgEI = colleges.length
    ? (colleges.reduce((a, c) => a + (c.avgEI ?? 0), 0) / colleges.length).toFixed(1)
    : '—';

  if (isLoading) return <div className="p-8 text-gray-500">Loading colleges…</div>;
  if (isError)   return <div className="p-8 text-red-500">Error loading colleges. Please refresh.</div>;

      const exportCollegesToCSV = () => {
  if (!colleges.length) return;

  const headers = [
    "Name",
    "Code",
    "Domain",
    "Address",
    "Contact Email",
    "Contact Phone",
    "Status",
    "Students",
    "Avg EI",
  ];

  const rows = colleges.map((c) => [
    c.name,
    c.code,
    c.domain ?? "",
    c.address ?? "",
    c.contact_email ?? "",
    c.contact_phone ?? "",
    c.is_active ? "Active" : "Inactive",
    c.students ?? 0,
    c.avgEI ?? 0,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const fileName = `colleges_${new Date().toISOString().slice(0, 10)}.csv`;

  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

  return (
    <div className="page-enter space-y-5">

      {/* Add dialog */}
      {showAdd && (
        <CollegeFormDialog open={showAdd} onOpenChange={setShowAdd} college={null} />
      )}

      {/* Edit dialog */}
      {editTarget && (
        <CollegeFormDialog
          open={!!editTarget}
          onOpenChange={(open) => { if (!open) setEditTarget(null); }}
          college={editTarget}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteCollegeDialog
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
          college={deleteTarget}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            College Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {colleges.length} institution{colleges.length !== 1 ? 's' : ''} on the platform
          </p>
        </div>
         <div className="flex gap-2 flex-shrink-0">
        <Button size="sm" className="flex-shrink-0 self-start" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add College
        </Button>
         <Button size="sm" onClick={exportCollegesToCSV}>
  <Download size={14} /> Export
</Button>
</div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Institutions', value: colleges.length,               color: 'text-indigo-600' },
          { label: 'Total Students',     value: totalStudents.toLocaleString(), color: 'text-blue-600'   },
          { label: 'Avg Platform EI',    value: avgEI,                          color: 'text-emerald-600'},
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {['COLLEGE', 'CODE', 'DOMAIN', 'CONTACT', 'STATUS', 'ACTIONS'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {colleges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                  No colleges found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : colleges.map(c => (
              <TableRow key={c.id} className="hover:bg-gray-50">

                {/* Name */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Building size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{c.name}</div>
                      {c.address && (
                        <div className="text-xs text-gray-400">{c.address}</div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Code */}
                <TableCell>
                  <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                </TableCell>

                {/* Domain */}
                <TableCell className="text-sm text-gray-500">
                  {c.domain ?? '—'}
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="space-y-0.5">
                    {c.contact_email && (
                      <div className="text-xs text-gray-600">{c.contact_email}</div>
                    )}
                    {c.contact_phone && (
                      <div className="text-xs text-gray-400">{c.contact_phone}</div>
                    )}
                    {!c.contact_email && !c.contact_phone && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTarget(c)}
                      title="Edit college"
                      className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
                      title="Delete college"
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}