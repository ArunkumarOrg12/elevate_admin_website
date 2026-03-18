import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft, Users, Trophy, Search, Filter, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Clock, BarChart3, Award, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useCycle, useCycleParticipants, useCycleLeaderboard } from '../../controllers/questionsController';

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 100, color = 'indigo' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const colors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-400',
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors[color] || colors.indigo}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

// ── Rank medal ─────────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-sm font-bold text-amber-500">🥇</span>;
  if (rank === 2) return <span className="text-sm font-bold text-gray-400">🥈</span>;
  if (rank === 3) return <span className="text-sm font-bold text-orange-500">🥉</span>;
  return <span className="text-xs font-semibold text-gray-400">#{rank}</span>;
}

// ── Expandable participant row ─────────────────────────────────────────────────
function ParticipantRow({ participant, rank, maxScore }) {
  const [expanded, setExpanded] = useState(false);

  const score = participant.score ?? participant.totalScore ?? participant.final_score ?? 0;
  const name = participant.studentName || participant.name || participant.student_name || `Student`;
  const email = participant.email || participant.studentEmail || '—';
  const dept = participant.department || participant.dept || '—';
  const submitted = participant.submitted_at || participant.submittedAt || participant.completedAt;
  const timeTaken = participant.time_taken ?? participant.timeTaken;
  const status = participant.status || (participant.submitted ? 'submitted' : 'pending');

  const categoryScores = participant.categoryScores || participant.category_scores || null;
  const answers = participant.answers || participant.questionAnswers || [];
  const correct = participant.correct_count ?? participant.correctCount ?? answers.filter(a => a.is_correct ?? a.isCorrect).length;
  const total = participant.total_questions ?? participant.totalQuestions ?? answers.length;

  const statusColor = {
    submitted: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    in_progress: 'bg-blue-50 text-blue-700',
    absent: 'bg-red-50 text-red-600',
  };

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

        {/* Name */}
        <TableCell>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-400">{email}</div>
        </TableCell>

        {/* Dept */}
        <TableCell className="text-xs text-gray-600">{dept}</TableCell>

        {/* Score */}
        <TableCell>
          <div className="text-sm font-semibold text-indigo-700">{score}</div>
          <ScoreBar value={score} max={maxScore} />
        </TableCell>

        {/* Correct/Total */}
        <TableCell>
          {total > 0 ? (
            <span className="text-xs text-gray-600">
              <span className="text-emerald-600 font-semibold">{correct}</span>
              <span className="text-gray-400"> / {total}</span>
            </span>
          ) : '—'}
        </TableCell>

        {/* Time */}
        <TableCell className="text-xs text-gray-500">
          {timeTaken ? `${timeTaken} min` : submitted ? format(new Date(submitted), 'dd MMM, HH:mm') : '—'}
        </TableCell>

        {/* Status */}
        <TableCell>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.replace(/_/g, ' ')}
          </span>
        </TableCell>
      </TableRow>

      {/* Expanded details */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={8} className="p-0 bg-gray-50/70">
            <div className="px-10 py-4 space-y-4">

              {/* Category score breakdown */}
              {categoryScores && Object.keys(categoryScores).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <BarChart3 size={12} /> Score by Category
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(categoryScores).map(([cat, val]) => (
                      <div key={cat} className="bg-white rounded-[8px] border border-gray-100 px-3 py-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 capitalize">{cat.replace(/_/g, ' ')}</span>
                          <span className="text-xs font-semibold text-gray-800">{val}</span>
                        </div>
                        <ScoreBar value={typeof val === 'number' ? val : val.score ?? 0} max={typeof val === 'number' ? maxScore : val.max ?? maxScore} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-question review */}
              {answers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> Question Review
                  </p>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {answers.map((ans, idx) => {
                      const isCorrect = ans.is_correct ?? ans.isCorrect;
                      const qText = ans.question_text || ans.question || ans.text || `Question ${idx + 1}`;
                      return (
                        <div
                          key={ans.id || ans.question_id || idx}
                          className={`flex items-start gap-3 rounded-[8px] px-3 py-2 border text-xs ${
                            isCorrect ? 'bg-emerald-50/60 border-emerald-100' : 'bg-red-50/40 border-red-100'
                          }`}
                        >
                          {isCorrect
                            ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            : <XCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 line-clamp-1">{qText}</p>
                            <div className="flex gap-3 mt-0.5 text-gray-500">
                              {ans.selected_answer && <span>Answered: <strong>{ans.selected_answer}</strong></span>}
                              {ans.correct_answer && <span>Correct: <strong className="text-emerald-600">{ans.correct_answer}</strong></span>}
                              {ans.score != null && <span>Score: <strong>{ans.score}</strong></span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state for detail */}
              {!categoryScores && answers.length === 0 && (
                <p className="text-xs text-gray-400 py-2">No detailed breakdown available for this participant.</p>
              )}
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

  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [sortBy, setSortBy] = useState('rank');

  const { data: cycleData } = useCycle(id);
  const { data: participantsData, isLoading, isError } = useCycleParticipants(id);
  const { data: lbData } = useCycleLeaderboard(id);

  const cycle = cycleData?.cycle ?? cycleData?.data ?? cycleData ?? null;
  const rawParticipants = participantsData?.participants ?? participantsData?.data ?? lbData?.data ?? [];
  const leaderboard = lbData?.data ?? [];

  // Build ranked participant list
  const participants = useMemo(() => {
    return rawParticipants.map((p, idx) => ({
      ...p,
      _rank: p.rank ?? idx + 1,
    }));
  }, [rawParticipants]);

  const maxScore = useMemo(() => {
    const scores = participants.map(p => p.score ?? p.totalScore ?? p.final_score ?? 0);
    return Math.max(...scores, 1);
  }, [participants]);

  const departments = useMemo(() => {
    return [...new Set(participants.map(p => p.department || p.dept).filter(Boolean))];
  }, [participants]);

  const statuses = useMemo(() => {
    return [...new Set(participants.map(p => p.status).filter(Boolean))];
  }, [participants]);

  const filtered = useMemo(() => {
    let list = [...participants];
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(p =>
        (p.studentName || p.name || '').toLowerCase().includes(q) ||
        (p.email || p.studentEmail || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') list = list.filter(p => (p.status || '') === filterStatus);
    if (filterDept !== 'all') list = list.filter(p => (p.department || p.dept) === filterDept);

    if (sortBy === 'rank') list.sort((a, b) => a._rank - b._rank);
    else if (sortBy === 'score_desc') list.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    else if (sortBy === 'score_asc') list.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    else if (sortBy === 'name') list.sort((a, b) => (a.studentName || a.name || '').localeCompare(b.studentName || b.name || ''));

    return list;
  }, [participants, searchQ, filterStatus, filterDept, sortBy]);

  const stats = useMemo(() => {
    const scores = participants.map(p => p.score ?? p.totalScore ?? 0);
    const avg = scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
    const submitted = participants.filter(p => ['submitted', 'completed'].includes(p.status)).length;
    return { total: participants.length, submitted, avg: avg.toFixed(1), topScore: Math.max(...scores, 0) };
  }, [participants]);

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
          { label: 'TOTAL PARTICIPANTS', value: stats.total, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'SUBMITTED', value: stats.submitted, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'AVG SCORE', value: stats.avg, icon: BarChart3, color: 'bg-blue-50 text-blue-600' },
          { label: 'TOP SCORE', value: stats.topScore, icon: Award, color: 'bg-amber-50 text-amber-600' },
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

      {/* Leaderboard top 3 */}
      {leaderboard.length >= 3 && (
        <Card className="overflow-hidden">
          <CardHeader className="px-5 py-3.5 border-b border-gray-100">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" /> Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="grid grid-cols-3 gap-3">
              {leaderboard.slice(0, 3).map((entry, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-center ${
                    i === 0 ? 'bg-amber-50 border-amber-200' : i === 1 ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div className="text-sm font-semibold text-gray-800 line-clamp-1">{entry.studentName || entry.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{entry.email || ''}</div>
                  <div className="text-lg font-bold text-indigo-700 mt-1">{entry.score ?? entry.totalScore}</div>
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
                  placeholder="Search by name or email..."
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
              {departments.length > 0 && (
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue placeholder="All Depts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">Sort: Rank</SelectItem>
                  <SelectItem value="score_desc">Sort: Score ↓</SelectItem>
                  <SelectItem value="score_asc">Sort: Score ↑</SelectItem>
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
                  <TableHead className="text-xs">DEPARTMENT</TableHead>
                  <TableHead className="text-xs">SCORE</TableHead>
                  <TableHead className="text-xs">CORRECT</TableHead>
                  <TableHead className="text-xs">TIME / SUBMITTED</TableHead>
                  <TableHead className="text-xs">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((participant, idx) => (
                  <ParticipantRow
                    key={participant.id || participant._id || participant.studentId || idx}
                    participant={participant}
                    rank={participant._rank ?? idx + 1}
                    maxScore={maxScore}
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
