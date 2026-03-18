import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import {
  ArrowLeft, Users, Trophy, Search, Filter, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, BarChart3, Award, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useCycle, useCycleParticipants, useCycleLeaderboard } from '../../controllers/questionsController';

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ pct }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color = clamped >= 75 ? 'bg-emerald-500' : clamped >= 40 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">{clamped.toFixed(1)}%</span>
    </div>
  );
}

// ── Rank medal ─────────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-sm">🥇</span>;
  if (rank === 2) return <span className="text-sm">🥈</span>;
  if (rank === 3) return <span className="text-sm">🥉</span>;
  return <span className="text-xs font-semibold text-gray-400">#{rank}</span>;
}

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  submitted:   'bg-emerald-50 text-emerald-700',
  completed:   'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-blue-50 text-blue-700',
  pending:     'bg-amber-50 text-amber-700',
  absent:      'bg-red-50 text-red-600',
};

// ── Expandable participant row ─────────────────────────────────────────────────
function ParticipantRow({ participant, rank }) {
  const [expanded, setExpanded] = useState(false);

  const scoreObj  = participant.score   ?? {};
  const progress  = participant.progress ?? {};
  const totalScore   = scoreObj.total_score      ?? 0;
  const maxScore     = scoreObj.max_score        ?? 0;
  const percentage   = scoreObj.percentage_score ?? 0;
  const grade        = scoreObj.grade;
  const percentile   = scoreObj.percentile_rank;

  const answered  = progress.answered ?? 0;
  const total     = progress.total    ?? 0;

  const submitted = participant.submitted_at;
  const started   = participant.started_at;
  const status    = participant.status || 'pending';

  // Duration in minutes between start and submit
  const durationMin = submitted && started
    ? Math.round((new Date(submitted) - new Date(started)) / 60000)
    : null;

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(p => !p)}
      >
        {/* Expand */}
        <TableCell className="w-8 pl-4">
          {expanded
            ? <ChevronDown size={14} className="text-gray-400" />
            : <ChevronRight size={14} className="text-gray-400" />}
        </TableCell>

        {/* Rank */}
        <TableCell className="w-12"><RankBadge rank={rank} /></TableCell>

        {/* Student */}
        <TableCell>
          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
          <div className="text-xs text-gray-400">{participant.enrollment_number} · {participant.email}</div>
        </TableCell>

        {/* Score */}
        <TableCell className="min-w-[130px]">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-sm font-semibold text-indigo-700">{totalScore}</span>
            <span className="text-xs text-gray-400">/ {maxScore}</span>
            {grade && <span className="text-xs font-medium text-gray-500 ml-1">{grade}</span>}
          </div>
          <ScoreBar pct={percentage} />
        </TableCell>

        {/* Progress */}
        <TableCell>
          <span className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800">{answered}</span>
            <span className="text-gray-400"> / {total}</span>
            <span className="text-gray-400 ml-1">answered</span>
          </span>
        </TableCell>

        {/* Duration */}
        <TableCell className="text-xs text-gray-500">
          {durationMin !== null
            ? `${durationMin} min`
            : submitted
              ? format(new Date(submitted), 'dd MMM, HH:mm')
              : '—'}
        </TableCell>

        {/* Status */}
        <TableCell>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.replace(/_/g, ' ')}
          </span>
        </TableCell>
      </TableRow>

      {/* Expanded details */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0 bg-gray-50/70">
            <div className="px-10 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Score',  value: `${totalScore} / ${maxScore}` },
                  { label: 'Percentage',   value: `${percentage.toFixed(2)}%` },
                  { label: 'Percentile',   value: percentile != null ? `${percentile}` : '—' },
                  { label: 'Grade',        value: grade ?? '—' },
                  { label: 'Answered',     value: `${answered} / ${total}` },
                  { label: 'Remaining',    value: progress.remaining ?? 0 },
                  { label: 'Started',      value: started ? format(new Date(started), 'dd MMM, HH:mm') : '—' },
                  { label: 'Submitted',    value: submitted ? format(new Date(submitted), 'dd MMM, HH:mm') : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-[8px] border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function CycleParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth();

  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score_desc');

  const { data: cycleData } = useCycle(id, { enabled: !authLoading && !!id });
  const { data: participantsData, isLoading, isError } = useCycleParticipants(id, { enabled: !authLoading && !!id });
  const { data: lbData } = useCycleLeaderboard(id, { enabled: !authLoading && !!id });

  const cycle = cycleData?.cycle ?? cycleData?.data ?? cycleData ?? null;

  const rawParticipants = participantsData?.participants ?? participantsData?.data ?? [];

  // Assign ranks based on total_score descending
  const participants = useMemo(() => {
    const sorted = [...rawParticipants].sort(
      (a, b) => (b.score?.total_score ?? 0) - (a.score?.total_score ?? 0)
    );
    return sorted.map((p, idx) => ({ ...p, _rank: idx + 1 }));
  }, [rawParticipants]);

  const leaderboard = lbData?.data ?? participants.slice(0, 3);

  const statuses = useMemo(() => (
    [...new Set(participants.map(p => p.status).filter(Boolean))]
  ), [participants]);

  const filtered = useMemo(() => {
    let list = [...participants];
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.enrollment_number?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') list = list.filter(p => p.status === filterStatus);

    if (sortBy === 'rank')       list.sort((a, b) => a._rank - b._rank);
    else if (sortBy === 'score_desc') list.sort((a, b) => (b.score?.total_score ?? 0) - (a.score?.total_score ?? 0));
    else if (sortBy === 'score_asc')  list.sort((a, b) => (a.score?.total_score ?? 0) - (b.score?.total_score ?? 0));
    else if (sortBy === 'name')       list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return list;
  }, [participants, searchQ, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const scores = participants.map(p => p.score?.total_score ?? 0);
    const pcts   = participants.map(p => p.score?.percentage_score ?? 0);
    const submitted = participants.filter(p => ['submitted', 'completed'].includes(p.status)).length;
    const avg = pcts.length > 0 ? (pcts.reduce((s, v) => s + v, 0) / pcts.length).toFixed(1) : '0.0';
    return {
      total: participantsData?.total ?? participants.length,
      submitted,
      avg,
      topScore: scores.length > 0 ? Math.max(...scores) : 0,
    };
  }, [participants, participantsData]);

  // Top 3 by score
  const topThree = useMemo(() => (
    [...participants]
      .sort((a, b) => (b.score?.total_score ?? 0) - (a.score?.total_score ?? 0))
      .slice(0, 3)
  ), [participants]);

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/assessments/cycles')} className="p-1.5">
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {cycle?.title ?? 'Cycle'} — Participants
          </h1>
          <p className="text-gray-500 text-sm">
            {cycle?.batch ? `Batch ${cycle.batch} · ` : ''}
            {cycle?.paper_set ? `${cycle.paper_set} · ` : ''}
            {cycle?.start_date ? format(new Date(cycle.start_date), 'dd MMM yyyy') : ''}
            {cycle?.end_date ? ` → ${format(new Date(cycle.end_date), 'dd MMM yyyy')}` : ''}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL PARTICIPANTS', value: stats.total,     icon: Users,        color: 'bg-indigo-50 text-indigo-600' },
          { label: 'SUBMITTED',          value: stats.submitted, icon: CheckCircle2,  color: 'bg-emerald-50 text-emerald-600' },
          { label: 'AVG PERCENTAGE',     value: `${stats.avg}%`, icon: BarChart3,     color: 'bg-blue-50 text-blue-600' },
          { label: 'TOP SCORE',          value: stats.topScore,  icon: Award,         color: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
              </div>
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top 3 performers */}
      {topThree.length >= 3 && (
        <Card className="overflow-hidden">
          <CardHeader className="px-5 py-3.5 border-b border-gray-100">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" /> Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="grid grid-cols-3 gap-3">
              {topThree.map((p, i) => (
                <div
                  key={p.attempt_id ?? i}
                  className={`rounded-xl border p-3 text-center ${
                    i === 0 ? 'bg-amber-50 border-amber-200' : i === 1 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div className="text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.enrollment_number}</div>
                  <div className="text-lg font-bold text-indigo-700 mt-1">{p.score?.total_score ?? 0}</div>
                  <div className="text-xs text-gray-400">{(p.score?.percentage_score ?? 0).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">All Participants</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${filtered.length} of ${participants.length} participant${participants.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email or enrollment..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="h-8 pl-7 pr-3 text-xs rounded-[8px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-52"
                />
              </div>
              {statuses.length > 0 && (
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-xs w-32 gap-1">
                    <Filter size={11} className="text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(s => (
                      <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score_desc">Sort: Score ↓</SelectItem>
                  <SelectItem value="score_asc">Sort: Score ↑</SelectItem>
                  <SelectItem value="rank">Sort: Rank</SelectItem>
                  <SelectItem value="name">Sort: Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {isError ? (
          <div className="px-5 py-10 text-center text-sm text-red-500">Failed to load participants.</div>
        ) : isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Loading participants...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-gray-400">
            <Users size={32} strokeWidth={1.5} />
            <p className="text-sm">{participants.length === 0 ? 'No participants yet.' : 'No participants match your filters.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="w-12 text-xs">RANK</TableHead>
                  <TableHead className="text-xs">STUDENT</TableHead>
                  <TableHead className="text-xs">SCORE</TableHead>
                  <TableHead className="text-xs">PROGRESS</TableHead>
                  <TableHead className="text-xs">DURATION</TableHead>
                  <TableHead className="text-xs">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((participant, idx) => (
                  <ParticipantRow
                    key={participant.attempt_id ?? idx}
                    participant={participant}
                    rank={participant._rank ?? idx + 1}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
