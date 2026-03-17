import { useState } from 'react';
import { format } from 'date-fns';
import {
  RefreshCw, Plus, Calendar, Users, Trophy, ChevronRight, Loader2,
} from 'lucide-react';
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
import StatCard from '../../components/common/StatCard';
import {
  useCycles, useCycle, useCreateCycle, useChangeCycleStatus,
  useCycleResults, useCycleLeaderboard,
} from '../../controllers/questionsController';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

function CreateCycleDialog({ open, onOpenChange }) {
  const createMutation = useCreateCycle();
  const [form, setForm] = useState({ name: '', startDate: null, endDate: null, description: '' });
  const [calOpen, setCalOpen] = useState({ start: false, end: false });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createMutation.mutate(
      { name: form.name, startDate: form.startDate, endDate: form.endDate, description: form.description },
      { onSuccess: () => { setForm({ name: '', startDate: null, endDate: null, description: '' }); onOpenChange(false); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Cycle</DialogTitle>
          <DialogDescription>Create a new assessment cycle</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Cycle Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Campus Readiness Q1 2025"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date */}
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Popover open={calOpen.start} onOpenChange={v => setCalOpen(p => ({ ...p, start: v }))}>
                <PopoverTrigger asChild>
                  <button className={`flex h-9 w-full items-center gap-2 rounded-[9px] border border-gray-200 bg-white px-3 py-1.5 text-sm ${form.startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                    <Calendar size={14} className="text-gray-400" />
                    {form.startDate ? format(form.startDate, 'dd MMM yyyy') : 'Pick date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={form.startDate}
                    onSelect={d => { setForm(p => ({ ...p, startDate: d ?? null })); setCalOpen(p => ({ ...p, start: false })); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* End Date */}
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Popover open={calOpen.end} onOpenChange={v => setCalOpen(p => ({ ...p, end: v }))}>
                <PopoverTrigger asChild>
                  <button className={`flex h-9 w-full items-center gap-2 rounded-[9px] border border-gray-200 bg-white px-3 py-1.5 text-sm ${form.endDate ? 'text-gray-900' : 'text-gray-400'}`}>
                    <Calendar size={14} className="text-gray-400" />
                    {form.endDate ? format(form.endDate, 'dd MMM yyyy') : 'Pick date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={form.endDate}
                    onSelect={d => { setForm(p => ({ ...p, endDate: d ?? null })); setCalOpen(p => ({ ...p, end: false })); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending || !form.name.trim()}>
            {createMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Cycle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CycleResultsDialog({ cycleId, cycleName, open, onOpenChange }) {
  const { data: resultsData, isLoading: rLoading } = useCycleResults(open ? cycleId : null);
  const { data: lbData, isLoading: lbLoading } = useCycleLeaderboard(open ? cycleId : null);

  const results = resultsData?.data ?? [];
  const leaderboard = lbData?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cycleName} — Results</DialogTitle>
          <DialogDescription>Cycle results and leaderboard</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4 space-y-5">
          {/* Results summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Results Summary</h3>
            {rLoading ? (
              <p className="text-sm text-gray-400">Loading results...</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-gray-400">No results available.</p>
            ) : (
              <div className="space-y-1.5">
                {results.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-[8px]">
                    <span className="text-gray-700">{r.studentName || r.name || `Student ${i + 1}`}</span>
                    <span className="font-semibold text-indigo-700">{r.score ?? r.totalScore ?? '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" /> Leaderboard
            </h3>
            {lbLoading ? (
              <p className="text-sm text-gray-400">Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-sm text-gray-400">No leaderboard data available.</p>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.slice(0, 10).map((entry, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-[8px] border ${
                    i === 0 ? 'bg-amber-50 border-amber-200' : i === 1 ? 'bg-gray-50 border-gray-200' : i === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'
                  }`}>
                    <span className={`text-xs font-bold w-5 text-center ${
                      i === 0 ? 'text-amber-600' : i === 1 ? 'text-gray-500' : i === 2 ? 'text-orange-600' : 'text-gray-400'
                    }`}>{i + 1}</span>
                    <span className="text-sm text-gray-800 flex-1">{entry.studentName || entry.name}</span>
                    <span className="text-sm font-semibold text-indigo-700">{entry.score ?? entry.totalScore}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Cycles() {
  const [showCreate, setShowCreate] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(null);

  const { data, isLoading, isError } = useCycles();
  const changeStatusMutation = useChangeCycleStatus();

  const cycles = data?.data ?? [];
  const stats = {
    total: cycles.length,
    active: cycles.filter(c => c.status === 'active').length,
    completed: cycles.filter(c => c.status === 'completed').length,
    draft: cycles.filter(c => c.status === 'draft').length,
  };

  return (
    <div className="page-enter space-y-5">
      <CreateCycleDialog open={showCreate} onOpenChange={setShowCreate} />
      {resultsDialog && (
        <CycleResultsDialog
          cycleId={resultsDialog.id}
          cycleName={resultsDialog.name}
          open={!!resultsDialog}
          onOpenChange={(open) => !open && setResultsDialog(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Assessment Cycles
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage assessment cycles and view results</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> Create Cycle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL CYCLES" value={stats.total} icon={RefreshCw} accentColor="indigo" />
        <StatCard label="ACTIVE" value={stats.active} icon={RefreshCw} accentColor="blue" />
        <StatCard label="COMPLETED" value={stats.completed} icon={RefreshCw} accentColor="emerald" />
        <StatCard label="DRAFT" value={stats.draft} icon={RefreshCw} accentColor="amber" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <CardTitle className="text-base">All Cycles</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${cycles.length} cycle${cycles.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">Failed to load cycles.</div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Loading...</div>
        ) : cycles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <RefreshCw size={32} strokeWidth={1.5} />
            <p className="text-sm">No cycles yet. <button className="text-indigo-600 hover:underline" onClick={() => setShowCreate(true)}>Create one</button></p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {['CYCLE NAME', 'DATES', 'PARTICIPANTS', 'STATUS', 'CHANGE STATUS', 'RESULTS'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cycles.map(cycle => {
                const cId = cycle.id || cycle._id;
                return (
                  <TableRow key={cId}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{cycle.name}</div>
                      {cycle.description && <div className="text-xs text-gray-400 mt-0.5">{cycle.description}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar size={13} className="text-gray-400" />
                        <span>
                          {cycle.startDate ? format(new Date(cycle.startDate), 'dd MMM yyyy') : '—'}
                          {cycle.endDate ? ` → ${format(new Date(cycle.endDate), 'dd MMM yyyy')}` : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users size={13} className="text-gray-400" />
                        {cycle.participantCount ?? cycle.participants ?? '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[cycle.status] || 'bg-gray-100 text-gray-600'}`}>
                        {cycle.status || 'draft'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={cycle.status || 'draft'}
                        onValueChange={(val) => changeStatusMutation.mutate({ id: cId, status: val })}
                        disabled={changeStatusMutation.isPending}
                      >
                        <SelectTrigger className="h-7 text-xs w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {cycle.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-indigo-600 hover:text-indigo-700 px-2"
                          onClick={() => setResultsDialog({ id: cId, name: cycle.name })}
                        >
                          <Trophy size={13} /> Results
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
