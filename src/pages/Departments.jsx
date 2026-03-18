import { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useAuth } from '../hooks/useAuth';
import { 
  useDepartments, 
  useCreateDepartment, 
  useUpdateDepartment, 
  useDeleteDepartment 
} from '../controllers';

export default function Departments() {
  const { user } = useAuth();

  // React Query Hooks
  const { data: res, isLoading: loading, refetch: fetchDepartments } = useDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  // Extract array directly from React Query response
  const dataArray = res?.departments || res?.data?.departments || [];
  const departments = Array.isArray(dataArray) ? dataArray : [];

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', hod_name: '', contact_email: '' });
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const handleSave = async () => {
    try {
      const payload = { 
        ...formData, 
        college_id: user?.college_id || user?.college?.id || formData.college_id 
      };
      
      if (isEditMode && formData.id) {
        await updateDepartment.mutateAsync({ id: formData.id, ...payload });
      } else {
        await createDepartment.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save department:', err);
    }
  };

  const confirmDelete = (d) => {
    setDepartmentToDelete(d);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await deleteDepartment.mutateAsync(departmentToDelete.id);
      setIsDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (err) {
      console.error('Failed to delete department:', err);
    }
  };

  const openAddDialog = () => {
    setFormData({ name: '', code: '', hod_name: '', contact_email: '' });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (d) => {
    setFormData({ 
      id: d.id, 
      name: d.name || '', 
      code: d.code || '', 
      hod_name: d.hod_name || '', 
      contact_email: d.contact_email || '' 
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Departments
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage academic departments</p>
        </div>
        <div className="flex gap-2 self-start flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => fetchDepartments()}>
             <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={openAddDialog}>
            <Plus size={14} className="mr-1" /> Add Department
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading departments...</div>
          ) : departments.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center">
              <p className="text-gray-500 mb-3">No departments found.</p>
              <Button onClick={openAddDialog} variant="outline" size="sm">Add your first department</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>HOD Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map(d => (
                    <TableRow key={d.id}>
                      <TableCell className="font-semibold text-gray-900">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {d.code}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{d.name}</TableCell>
                      <TableCell>{d.hod_name || '-'}</TableCell>
                      <TableCell className="text-gray-500">{d.contact_email || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={d.is_active ? 'Active' : 'Inactive'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditDialog(d)} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 border border-gray-200" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => confirmDelete(d)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-md text-red-600 border border-red-200" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Department' : 'Add Department'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the details of the department below.' : 'Enter the details of the new department.'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label>Department Name</Label>
              <Input 
                placeholder="e.g. Computer Science" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Department Code</Label>
              <Input 
                placeholder="e.g. CS" 
                value={formData.code} 
                onChange={e => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>HOD Name</Label>
              <Input 
                placeholder="e.g. Dr. John Smith" 
                value={formData.hod_name} 
                onChange={e => setFormData({ ...formData, hod_name: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label>Contact Email</Label>
              <Input 
                placeholder="e.g. cs@harvard.edu" 
                type="email"
                value={formData.contact_email} 
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              disabled={createDepartment.isPending || updateDepartment.isPending}
            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the department <strong className="text-gray-900">{departmentToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleteDepartment.isPending}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
