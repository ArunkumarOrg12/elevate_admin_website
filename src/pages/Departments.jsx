import { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '../controllers/departmentsController';

export default function Departments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: departments = [], isLoading, refetch } = useDepartments(
  user?.college_id ? { college_id: user.college_id } : undefined
);

  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [isDialogOpen, setIsDialogOpen]   = useState(false);
  const [isEditMode, setIsEditMode]       = useState(false);
  const [formData, setFormData]           = useState({ name: '', code: '', hod_name: '', contact_email: '' });
  const [formErrors, setFormErrors]       = useState({});
  const [deleteTarget, setDeleteTarget]   = useState(null);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.code.trim()) e.code = 'Required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      ...formData,
      college_id: user?.college_id,
    };
    try {
      if (isEditMode) {
        await updateDepartment.mutateAsync({ id: formData.id, ...payload });
      } else {
        await createDepartment.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save department:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteDepartment.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openAdd = () => {
    setFormData({ name: '', code: '', hod_name: '', contact_email: '' });
    setFormErrors({});
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEdit = (d) => {
    setFormData({ id: d.id, name: d.name || '', code: d.code || '', hod_name: d.hod_name || '', contact_email: d.contact_email || '' });
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

  return (
    <div className="page-enter space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Departments
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{departments.length} departments</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} /> Add Department
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">Loading departments…</div>
          ) : departments.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <BookOpen size={20} className="text-indigo-400" />
              </div>
              <p className="text-gray-500 text-sm">No departments found.</p>
              <Button onClick={openAdd} variant="outline" size="sm">Add your first department</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CODE</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>HOD</TableHead>
                  <TableHead>CONTACT EMAIL</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>PROGRAMS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.id} className="hover:bg-gray-50">
                    <TableCell>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {d.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{d.name}</TableCell>
                    <TableCell className="text-gray-600">{d.hod_name || '—'}</TableCell>
                    <TableCell className="text-gray-500">{d.contact_email || '—'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        d.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {d.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/programs?department_id=${d.id}&department_name=${encodeURIComponent(d.name)}&college_id=${user?.college_id}`)}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Programs <ArrowRight size={12} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(d)} className="p-1.5 hover:text-amber-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(d)} className="p-1.5 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Department' : 'Add Department'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the department details below.' : 'Fill in the details to create a new department.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="mb-2">Department Name *</Label>
                <Input placeholder="e.g. Computer Science" {...field('name')} />
                {err('name')}
              </div>
              <div>
                <Label className="mb-2">Code *</Label>
                <Input placeholder="e.g. CS" {...field('code')} />
                {err('code')}
              </div>
              <div>
                <Label className="mb-2">HOD Name</Label>
                <Input placeholder="e.g. Dr. John Smith" {...field('hod_name')} />
              </div>
              <div className="col-span-2">
                <Label className="mb-2">Contact Email</Label>
                <Input type="email" placeholder="cs@college.edu" {...field('contact_email')} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createDepartment.isPending || updateDepartment.isPending}>
              {isEditMode ? 'Update' : 'Add Department'}
            </Button>
          </DialogFooter>
          {(createDepartment.isError || updateDepartment.isError) && (
            <p className="text-xs text-red-500 text-center mt-1">
              {createDepartment.error?.response?.data?.message || updateDepartment.error?.response?.data?.message || 'Something went wrong'}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteDepartment.isPending}>
              {deleteDepartment.isPending ? 'Deleting…' : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}