import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetPrograms, useCreateProgram, useUpdateProgram, useDeleteProgram } from '../controllers/programController';
import { useDepartments } from '../controllers/departmentsController';

const DURATIONS = [1, 2, 3, 4, 5];

export default function Programs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read filters from URL (set when navigating from Departments page)
  const urlDepartmentId   = searchParams.get('department_id');
  const urlDepartmentName = searchParams.get('department_name');
const collegeId = searchParams.get('college_id') || user?.college_id;

  const [filterDeptId, setFilterDeptId] = useState(urlDepartmentId || '');

  const { data: programs = [], isLoading }    = useGetPrograms(collegeId, filterDeptId || undefined);
  const { data: departments = [] }            = useDepartments(collegeId ? { college_id: collegeId } : undefined);
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const deleteProgram = useDeleteProgram();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode]     = useState(false);
  const [formData, setFormData]         = useState({ name: '', code: '', duration_years: '3', department_id: urlDepartmentId || '' });
  const [formErrors, setFormErrors]     = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 8;

  const validate = () => {
    const e = {};
    if (!formData.name.trim())       e.name          = 'Required';
    if (!formData.department_id)     e.department_id = 'Select a department';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      name:           formData.name,
      code:           formData.code || undefined,
      duration_years: Number(formData.duration_years),
      department_id:  formData.department_id,
      college_id:     collegeId,
    };
    try {
      if (isEditMode) {
        await updateProgram.mutateAsync({ id: formData.id, ...payload });
      } else {
        await createProgram.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save program:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProgram.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openAdd = () => {
    setFormData({ name: '', code: '', duration_years: '3', department_id: filterDeptId || '' });
    setFormErrors({});
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEdit = (p) => {
    setFormData({
      id:             p.id,
      name:           p.name || '',
      code:           p.code || '',
      duration_years: String(p.duration_years || 3),
      department_id:  String(p.department_id),
    });
    setFormErrors({});
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData((p) => ({ ...p, [key]: e.target.value })),
    className: formErrors[key] ? 'border-red-400' : '',
  });

  const err = (key) => formErrors[key] && <p className="text-xs text-red-500 mt-0.5">{formErrors[key]}</p>;

  const activeDeptName = filterDeptId
    ? departments.find(d => String(d.id) === String(filterDeptId))?.name
    : null;

  const total = programs.length;
  const pages = Math.ceil(total / PER_PAGE);
  const paged = programs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="page-enter space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate('/departments')} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Programs
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            {activeDeptName ? (
              <span>Filtered by: <span className="text-indigo-600 font-medium">{activeDeptName}</span></span>
            ) : (
              `${programs.length} programs across all departments`
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {/* Department filter */}
         <Select value={filterDeptId || "all"} onValueChange={(v) => { setFilterDeptId(v === "all" ? "" : v); setPage(1); }}>
  <SelectTrigger className="w-48 text-sm">
    <SelectValue placeholder="All Departments" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Departments</SelectItem>   {/* ← was value="" */}
    {departments.map((d) => (
      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
          <Button size="sm" onClick={openAdd} disabled={departments.length === 0}>
            <Plus size={14} /> Add Program
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">Loading programs…</div>
          ) : departments.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Layers size={20} className="text-amber-400" />
              </div>
              <p className="text-gray-500 text-sm">No departments found.</p>
              <Button onClick={() => navigate('/departments')} variant="outline" size="sm">
                Add a Department first
              </Button>
            </div>
          ) : programs.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <Layers size={20} className="text-indigo-400" />
              </div>
              <p className="text-gray-500 text-sm">No programs found.</p>
              <Button onClick={openAdd} variant="outline" size="sm">Add your first program</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>CODE</TableHead>
                  <TableHead>DEPARTMENT</TableHead>
                  <TableHead>HOD</TableHead>
                  <TableHead>DURATION</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell>
                      {p.code ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {p.code}
                        </span>
                      ) : '—'}
                    </TableCell>
                    <TableCell className="text-gray-600">{p.department?.name || '—'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{p.department?.hod_name || '—'}</TableCell>
                    <TableCell className="text-gray-600">
                      {p.duration_years ? `${p.duration_years} yr${p.duration_years > 1 ? 's' : ''}` : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:text-amber-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Showing {total === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} of {total} programs
              </p>
              <div className="flex gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'ghost'}
                    size="icon"
                    className={`w-7 h-7 text-xs ${page !== p ? 'text-gray-600 hover:bg-gray-200' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-4">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Program' : 'Add Program'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the program details.' : 'Add a new program to a department.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">

            <div>
              <Label className="mb-2">Department *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(v) => setFormData((p) => ({ ...p, department_id: v }))}
              >
                <SelectTrigger className={formErrors.department_id ? 'border-red-400' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err('department_id')}
            </div>

            <div>
              <Label className="mb-2">Program Name *</Label>
              <Input placeholder="e.g. Bachelor of Computer Applications" {...field('name')} />
              {err('name')}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Code</Label>
                <Input placeholder="e.g. BCA" {...field('code')} />
              </div>
              <div>
                <Label className="mb-2">Duration (years)</Label>
                <Select
                  value={formData.duration_years}
                  onValueChange={(v) => setFormData((p) => ({ ...p, duration_years: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>{d} {d === 1 ? 'year' : 'years'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createProgram.isPending || updateProgram.isPending}>
              {isEditMode ? 'Update' : 'Add Program'}
            </Button>
          </DialogFooter>
          {(createProgram.isError || updateProgram.isError) && (
            <p className="text-xs text-red-500 text-center mt-1">
              {createProgram.error?.response?.data?.message || updateProgram.error?.response?.data?.message || 'Something went wrong'}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteProgram.isPending}>
              {deleteProgram.isPending ? 'Deleting…' : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}