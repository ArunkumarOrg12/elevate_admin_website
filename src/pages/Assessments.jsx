import { useState } from 'react';
import { format } from 'date-fns';
import {
  Download, Plus, ClipboardList, CheckCircle, Clock, Users, Calendar,
  CalendarCheck, BookOpen, ChevronRight,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ASSESSMENT_CYCLES } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'MBA', 'MCA'];

const ASSESSMENT_TYPES = [
  { value: 'Comprehensive', label: 'Comprehensive' },
  { value: 'Aptitude + Verbal', label: 'Aptitude + Verbal' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Full Stack', label: 'Full Stack' },
];

const EMPTY_FORM = {
  name: '',
  date: null,   // Date object | null
  type: '',
  departments: [],
};

function ScheduleAssessmentDialog({ open, onOpenChange }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [calOpen, setCalOpen] = useState(false);

  function toggleDept(dept) {
    setForm(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept],
    }));
    if (errors.departments) setErrors(prev => ({ ...prev, departments: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Assessment name is required';
    if (!form.date) newErrors.date = 'Please pick a date';
    if (!form.type) newErrors.type = 'Please select a type';
    if (form.departments.length === 0) newErrors.departments = 'Select at least one department';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSchedule() {
    if (!validate()) return;
    // TODO: submit form.name, form.date, form.type, form.departments to API
    console.log('Scheduling assessment:', form);
    setForm(EMPTY_FORM);
    setErrors({});
    onOpenChange(false);
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setCalOpen(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] w-full">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[10px] bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="h-4.5 w-4.5 text-indigo-600" size={18} />
            </div>
            <div>
              <DialogTitle>Schedule Assessment</DialogTitle>
              <DialogDescription>Create a new assessment cycle for Batch 2025</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Assessment Name */}
          <div className="space-y-1.5">
            <Label htmlFor="assess-name">Assessment Name</Label>
            <Input
              id="assess-name"
              placeholder="e.g. Campus Readiness Evaluation"
              value={form.name}
              onChange={e => {
                setForm(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={errors.name ? 'border-red-400 focus:ring-red-400' : ''}
            />
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
          </div>

          {/* Date + Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={[
                      'flex h-9 w-full items-center gap-2 rounded-[9px] border bg-white px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      form.date ? 'text-gray-900' : 'text-gray-400',
                      errors.date ? 'border-red-400' : 'border-gray-200 hover:border-indigo-300',
                    ].join(' ')}
                  >
                    <Calendar size={14} className={form.date ? 'text-indigo-500' : 'text-gray-400'} />
                    {form.date ? format(form.date, 'dd MMM yyyy') : 'Pick a date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={form.date}
                    onSelect={date => {
                      setForm(prev => ({ ...prev, date: date ?? null }));
                      if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                      setCalOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500 mt-0.5">{errors.date}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={val => {
                  setForm(prev => ({ ...prev, type: val }));
                  if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
                }}
              >
                <SelectTrigger className={errors.type ? 'border-red-400 focus:ring-red-400' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500 mt-0.5">{errors.type}</p>}
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Departments</Label>
              {form.departments.length > 0 && (
                <span className="text-xs text-indigo-600 font-medium">
                  {form.departments.length} selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DEPARTMENTS.map(dept => {
                const selected = form.departments.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => toggleDept(dept)}
                    className={`
                      relative h-9 rounded-[9px] text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                      ${selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }
                    `}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
            {errors.departments && (
              <p className="text-xs text-red-500">{errors.departments}</p>
            )}
            {form.departments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.departments.map(d => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => toggleDept(d)}
                      className="hover:text-indigo-900 transition-colors leading-none"
                      aria-label={`Remove ${d}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSchedule}>
            <CalendarCheck size={14} />
            Schedule Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TYPE_COLORS = {
  'Comprehensive': 'bg-indigo-50 text-indigo-700',
  'Aptitude + Verbal': 'bg-blue-50 text-blue-700',
  'Technical': 'bg-purple-50 text-purple-700',
  'Full Stack': 'bg-cyan-50 text-cyan-700',
};

export default function Assessments() {
  const [showDialog, setShowDialog] = useState(false);

  const stats = {
    total: ASSESSMENT_CYCLES.length,
    completed: ASSESSMENT_CYCLES.filter(a => a.status === 'Completed').length,
    scheduled: ASSESSMENT_CYCLES.filter(a => a.status === 'Scheduled').length,
    participants: 1755,
  };

  return (
    <div className="page-enter space-y-5">
      <ScheduleAssessmentDialog open={showDialog} onOpenChange={setShowDialog} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Assessment Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {stats.total} cycles · Batch 2025 · AY 2024-25
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" onClick={() => setShowDialog(true)}>
            <Plus size={14} /> Schedule Assessment
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL CYCLES" value={stats.total} icon={ClipboardList} accentColor="indigo" />
        <StatCard label="COMPLETED" value={stats.completed} icon={CheckCircle} accentColor="emerald" />
        <StatCard label="SCHEDULED" value={stats.scheduled} icon={Clock} accentColor="blue" />
        <StatCard label="TOTAL PARTICIPANTS" value={stats.participants.toLocaleString()} icon={Users} accentColor="cyan" />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100 pb-4">
          <CardTitle className="text-base">Assessment Cycles</CardTitle>
          <CardDescription>All scheduled and completed cycles</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {['ASSESSMENT NAME', 'DATE', 'TYPE', 'PARTICIPANTS', 'AVG SCORE', 'STATUS', 'ACTION'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSESSMENT_CYCLES.map(a => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">{a.name}</div>
                  <div className="text-xs text-gray-400">{a.batch}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Calendar size={13} className="text-gray-400" />
                    {formatDate(a.date)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type] || 'bg-gray-100 text-gray-600'}`}>
                    {a.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Users size={13} className="text-gray-400" />
                    {a.participants.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  {a.avgScore ? (
                    <span className={`text-sm font-semibold ${a.avgScore >= 70 ? 'text-emerald-600' : a.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {a.avgScore}
                    </span>
                  ) : <span className="text-gray-400 text-sm">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={a.status === 'Completed' ? 'completed' : 'scheduled'}>{a.status}</Badge>
                </TableCell>
                <TableCell>
                  {a.status === 'Completed' && (
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 px-2">
                      <Download size={13} /> Report
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
