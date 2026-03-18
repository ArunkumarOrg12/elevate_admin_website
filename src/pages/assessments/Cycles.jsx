import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw, Plus, Calendar, Users, Trophy, Loader2,
  Search, Filter, Eye, Globe, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  useCycles, useCreateCycle, useChangeCycleStatus,
  usePublishCycle, useUnpublishCycle,
  useCycleResults, useCycleLeaderboard, usePaperSets,
} from '../../controllers/questionsController';

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS = {
  scheduled: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

// ── Create Cycle Dialog ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '', description: '', batch: '', paper_set: '',
  start_date: null, end_date: null,
  minutes_per_question: '', topics_covered: '', instructions: '',
};

function CreateCycleDialog({ open, onOpenChange }) {
  const createMutation = useCreateCycle();
  const { data: paperSetsData, isLoading: psLoading } = usePaperSets();
  const [form, setForm] = useState(EMPTY_FORM);
  const [calOpen, setCalOpen] = useState({ start: false, end: false });

  const paperSets = Array.isArray(paperSetsData)
    ? paperSetsData
    : (paperSetsData?.paperSets ?? paperSetsData?.data ?? []);

  const parseLines = (str) => str.split('\n').map(s => s.trim()).filter(Boolean);

  const handleCreate = () => {
    if (!form.title.trim()) return;
    createMutation.mutate(
      {
        title: form.title.trim(),
        ...(form.description.trim() && { description: form.description.trim() }),
        ...(form.batch.trim() && { batch: form.batch.trim() }),
        ...(form.paper_set && { paper_set: form.paper_set }),
        ...(form.start_date && { start_date: form.start_date }),
        ...(form.end_date && { end_date: form.end_date }),
        ...(form.minutes_per_question && { minutes_per_question: Number(form.minutes_per_question) }),
        ...(form.topics_covered.trim() && { topics_covered: parseLines(form.topics_covered) }),
        ...(form.instructions.trim() && { instructions: parseLines(form.instructions) }),
      },
      { onSuccess: () => { setForm(EMPTY_FORM); onOpenChange(false); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Cycle</DialogTitle>
          <DialogDescription>Create a new assessment cycle</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Cycle Title <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Quantitative Aptitude Assessment"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              rows={2}
              placeholder="Brief description of this assessment cycle"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Batch</Label>
              <Input
                placeholder="e.g. 2024"
                value={form.batch}
                onChange={e => setForm(p => ({ ...p, batch: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Paper Set</Label>
              <Select
                value={form.paper_set || undefined}
                onValueChange={val => setForm(p => ({ ...p, paper_set: val }))}
                disabled={psLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={psLoading ? 'Loading...' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {paperSets.map((ps, i) => {
                    const id = typeof ps === 'string' ? ps : String(ps.id || ps._id || i);
                    const label = typeof ps === 'string' ? ps : (ps.name || ps.title || ps.setId || id);
                    return <SelectItem key={id} value={id}>{label}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Popover open={calOpen.start} onOpenChange={v => setCalOpen(p => ({ ...p, start: v }))}>
                <PopoverTrigger asChild>
                  <button className={`flex h-9 w-full items-center gap-2 rounded-[9px] border border-gray-200 bg-white px-3 py-1.5 text-sm ${form.start_date ? 'text-gray-900' : 'text-gray-400'}`}>
                    <Calendar size={14} className="text-gray-400" />
                    {form.start_date ? format(form.start_date, 'dd MMM yyyy') : 'Pick date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={form.start_date}
                    onSelect={d => { setForm(p => ({ ...p, start_date: d ?? null })); setCalOpen(p => ({ ...p, start: false })); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Popover open={calOpen.end} onOpenChange={v => setCalOpen(p => ({ ...p, end: v }))}>
                <PopoverTrigger asChild>
                  <button className={`flex h-9 w-full items-center gap-2 rounded-[9px] border border-gray-200 bg-white px-3 py-1.5 text-sm ${form.end_date ? 'text-gray-900' : 'text-gray-400'}`}>
                    <Calendar size={14} className="text-gray-400" />
                    {form.end_date ? format(form.end_date, 'dd MMM yyyy') : 'Pick date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={form.end_date}
                    onSelect={d => { setForm(p => ({ ...p, end_date: d ?? null })); setCalOpen(p => ({ ...p, end: false })); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Minutes per Question</Label>
            <Input
              type="number"
              min="0.5"
              step="0.5"
              placeholder="e.g. 1.5"
              value={form.minutes_per_question}
              onChange={e => setForm(p => ({ ...p, minutes_per_question: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Topics Covered
              <span className="ml-1 text-xs text-gray-400 font-normal">(one per line)</span>
            </Label>
            <textarea
              rows={3}
              placeholder={"Quantitative Reasoning\nLogical Reasoning\nData Interpretation"}
              value={form.topics_covered}
              onChange={e => setForm(p => ({ ...p, topics_covered: e.target.value }))}
              className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Instructions
              <span className="ml-1 text-xs text-gray-400 font-normal">(one per line)</span>
            </Label>
            <textarea
              rows={4}
              placeholder={"Read each question carefully before answering\nYou can flag questions to review later\nTimer will start once you begin the assessment"}
              value={form.instructions}
              onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))}
              className="w-full rounded-[9px] border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending || !form.title.trim()}>
            {createMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Cycle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Results Dialog ─────────────────────────────────────────────────────────────

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

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Cycles() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');

  const { data, isLoading, isError } = useCycles();
  const changeStatusMutation = useChangeCycleStatus();
  const publishMutation = usePublishCycle();
  const unpublishMutation = useUnpublishCycle();

  const cycles = data?.cycles ?? data?.data ?? [];

  const batches = useMemo(() => {
    const b = [...new Set(cycles.map(c => c.batch).filter(Boolean))];
    return b;
  }, [cycles]);

  const filtered = useMemo(() => {
    return cycles.filter(c => {
      const matchSearch = !searchQ || c.title?.toLowerCase().includes(searchQ.toLowerCase()) || c.batch?.toLowerCase().includes(searchQ.toLowerCase());
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchBatch = filterBatch === 'all' || c.batch === filterBatch;
      return matchSearch && matchStatus && matchBatch;
    });
  }, [cycles, searchQ, filterStatus, filterBatch]);

  const stats = {
    total: cycles.length,
    active: cycles.filter(c => c.status === 'active').length,
    completed: cycles.filter(c => c.status === 'completed').length,
    scheduled: cycles.filter(c => c.status === 'scheduled').length,
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
        <StatCard label="SCHEDULED" value={stats.scheduled} icon={RefreshCw} accentColor="amber" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">All Cycles</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${filtered.length} of ${cycles.length} cycle${cycles.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cycles..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="h-8 pl-7 pr-3 text-xs rounded-[8px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-44"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs w-32 gap-1">
                  <Filter size={11} className="text-gray-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {batches.length > 0 && (
                <Select value={filterBatch} onValueChange={setFilterBatch}>
                  <SelectTrigger className="h-8 text-xs w-32">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batches.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">Failed to load cycles.</div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <RefreshCw size={32} strokeWidth={1.5} />
            {cycles.length === 0
              ? <p className="text-sm">No cycles yet. <button className="text-indigo-600 hover:underline" onClick={() => setShowCreate(true)}>Create one</button></p>
              : <p className="text-sm">No cycles match your filters.</p>
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {['CYCLE NAME', 'DATES', 'PARTICIPANTS', 'STATUS', 'CHANGE STATUS', 'VISIBILITY', 'ACTIONS'].map(h => (
                    <TableHead key={h} className="text-xs">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cycle => {
                  const cId = cycle.id || cycle._id;
                  const isPublished = cycle.is_published ?? cycle.isPublished ?? false;
                  const isPubPending = publishMutation.isPending || unpublishMutation.isPending;
                  return (
                    <TableRow key={cId}>
                      {/* Name */}
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">{cycle.title}</div>
                        {cycle.batch && <div className="text-xs text-gray-400 mt-0.5">Batch: {cycle.batch}</div>}
                        {cycle.paper_set && <div className="text-xs text-gray-400">{cycle.paper_set}</div>}
                      </TableCell>

                      {/* Dates */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                          <span>
                            {cycle.start_date ? format(new Date(cycle.start_date), 'dd MMM yy') : '—'}
                            {cycle.end_date ? ` → ${format(new Date(cycle.end_date), 'dd MMM yy')}` : ''}
                          </span>
                        </div>
                      </TableCell>

                      {/* Participants */}
                      <TableCell>
                        {cycle.participation ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <Users size={13} className="text-gray-400" />
                              <span className="font-medium">{cycle.participation.total_started}</span>
                              <span className="text-xs text-gray-400">started</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 pl-4">
                              <span className="text-emerald-600">{cycle.participation.total_submitted} submitted</span>
                              {cycle.participation.in_progress > 0 && (
                                <span className="text-blue-500">{cycle.participation.in_progress} in progress</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Users size={13} className="text-gray-400" />—
                          </div>
                        )}
                      </TableCell>

                      {/* Status badge */}
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[cycle.status] || 'bg-gray-100 text-gray-600'}`}>
                          {cycle.status || 'scheduled'}
                        </span>
                      </TableCell>

                      {/* Change status */}
                      <TableCell>
                        <Select
                          value={cycle.status || 'scheduled'}
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

                      {/* Publish / Unpublish */}
                      <TableCell>
                        {isPublished ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2 text-emerald-600 hover:text-red-500 hover:bg-red-50 gap-1"
                            disabled={isPubPending}
                            onClick={() => unpublishMutation.mutate(cId)}
                            title="Unpublish"
                          >
                            <Globe size={12} />
                            Published
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 gap-1"
                            disabled={isPubPending}
                            onClick={() => publishMutation.mutate(cId)}
                            title="Publish"
                          >
                            <EyeOff size={12} />
                            Draft
                          </Button>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 gap-1"
                            onClick={() => navigate(`/assessments/cycles/${cId}/participants`)}
                            title="View Participants"
                          >
                            <Eye size={12} />
                            Participants
                          </Button>
                          {cycle.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2 gap-1"
                              onClick={() => setResultsDialog({ id: cId, name: cycle.title })}
                            >
                              <Trophy size={12} />
                              Results
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
