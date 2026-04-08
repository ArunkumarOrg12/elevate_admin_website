import { useState, useMemo } from 'react';
import { Download, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { AlertOctagon, TrendingDown, Clock } from 'lucide-react';
import { useStudentsAtRisk, useRiskAlerts, useAcknowledgeAlert } from '../controllers/riskMonitorController';

const URGENCY_VARIANTS = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
};

const URGENCY_LABEL = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
};

const PIE_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

const PER_PAGE = 8;

export default function RiskMonitor() {
  const [page, setPage] = useState(1);

  // ── Data fetching ────────────────────────────────────────────────────────
  const {
    data: studentsRes,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useStudentsAtRisk({ page, limit: PER_PAGE });

  const {
    data: alertsRes,
    isLoading: alertsLoading,
  } = useRiskAlerts({ limit: 200 });

  const acknowledgeAlert = useAcknowledgeAlert();

  // ── Derived data ─────────────────────────────────────────────────────────
  const students = studentsRes?.data ?? [];
  const pagination = studentsRes?.pagination ?? {};
  const alerts = alertsRes?.data ?? [];

  // Stat cards — computed from current page + alerts for critical count
  const stats = useMemo(() => {
    const totalAtRisk = pagination.total ?? 0;
    const criticalRisk = alerts.filter(a => a.risk_level === 'critical').length;
    const decliningTrend = students.filter(s => {
      const factors = Array.isArray(s.contributing_factors) ? s.contributing_factors : (typeof s.contributing_factors === 'string' ? s.contributing_factors.split(',').map(f => f.trim()) : []);
      return factors.includes('declining_trend');
    }).length;
    const interventionPending = alerts.filter(a => !a.acknowledged_at).length;
    return { totalAtRisk, criticalRisk, decliningTrend, interventionPending };
  }, [students, alerts, pagination.total]);

  // At-risk by department bar chart
  const riskByDept = useMemo(() => {
    const map = {};
    students.forEach(s => {
      const dept = s.student?.department?.code ?? 'N/A';
      map[dept] = (map[dept] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // Intervention categories pie chart — based on contributing_factors
  const interventionCategories = useMemo(() => {
    const map = {};
    alerts.forEach(a => {
      const factors = Array.isArray(a.contributing_factors) ? a.contributing_factors : (typeof a.contributing_factors === 'string' ? a.contributing_factors.split(',').map(f => f.trim()) : ['Unclassified']);
      factors.forEach(f => {
        const label = f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        map[label] = (map[label] ?? 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [alerts]);

  // Weak sections — group by dept, show % below threshold (risk_score < 50)
  const weakSections = useMemo(() => {
    const map = {};
    students.forEach(s => {
      const dept = s.student?.department?.name ?? 'Unknown';
      if (!map[dept]) map[dept] = { count: 0, total: 0 };
      map[dept].total += 1;
      if ((s.risk_score ?? 0) < 50) map[dept].count += 1;
    });
    return Object.entries(map)
      .map(([section, { count, total }]) => ({ section, count, total }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [students]);

  // Critical alert for the banner
  const criticalAlerts = alerts.filter(a => a.risk_level === 'critical');
  const criticalDepts = [...new Set(
    criticalAlerts.map(a => a.student?.department?.code).filter(Boolean)
  )].join(' and ');

  const pages = pagination.totalPages ?? 1;

  console.log('studentsRes:', studentsRes);
console.log('alertsRes:', alertsRes);
console.log('studentsLoading:', studentsLoading);
console.log('studentsError:', studentsError);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Risk Monitor
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {studentsLoading ? 'Loading…' : `${stats.totalAtRisk} students require intervention · AY 2024-25`}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="destructive" size="sm">Send Alert</Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      {!alertsLoading && criticalAlerts.length > 0 && (
        <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Critical Attention Required</h3>
            <p className="text-sm text-red-700 mt-0.5">
              {stats.totalAtRisk} students are below the employability threshold. Immediate intervention
              recommended for {criticalAlerts.length} critical-risk students
              {criticalDepts ? ` in ${criticalDepts}` : ''}.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-100 mt-1 px-0 gap-1"
              onClick={() => criticalAlerts[0] && acknowledgeAlert.mutate(criticalAlerts[0].id)}
              disabled={acknowledgeAlert.isPending}
            >
              {acknowledgeAlert.isPending ? 'Acknowledging…' : 'Acknowledge & View Action Plan'}
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL AT RISK" value={stats.totalAtRisk} description="EI < 50" icon={AlertTriangle} accentColor="red" />
        <StatCard label="CRITICAL RISK" value={stats.criticalRisk} description="EI < 40 · Urgent" icon={AlertOctagon} accentColor="red" />
        <StatCard label="DECLINING TREND" value={stats.decliningTrend} description="Negative velocity" icon={TrendingDown} accentColor="amber" />
        <StatCard label="INTERVENTION PENDING" value={stats.interventionPending} description="No action taken" icon={Clock} accentColor="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* By department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">At-Risk by Department</CardTitle>
            <CardDescription>Student count at risk per dept</CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="h-[250px] flex items-center justify-center text-sm text-gray-400">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskByDept} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={40} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                  <Bar dataKey="count" name="At Risk" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Intervention categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intervention Categories</CardTitle>
            <CardDescription>Distribution by intervention type</CardDescription>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">Loading…</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={interventionCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                      paddingAngle={3} dataKey="value">
                      {interventionCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {interventionCategories.map(c => (
                    <div key={c.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-gray-600 text-xs">{c.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Weak sections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weak Sections Analysis</CardTitle>
            <CardDescription>Students scoring below 50</CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">Loading…</div>
            ) : (
              <div className="space-y-4">
                {weakSections.map(s => {
                  const pct = Math.round((s.count / s.total) * 100);
                  return (
                    <div key={s.section}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{s.section}</span>
                        <span className="font-semibold text-red-600">{s.count}</span>
                      </div>
                      <div className="h-2 bg-red-50 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* At-risk table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100 pb-4">
          <CardTitle className="text-base">At-Risk Students</CardTitle>
          <CardDescription>Students requiring immediate intervention</CardDescription>
        </CardHeader>

        {studentsError ? (
          <div className="px-5 py-8 text-center text-sm text-red-500">Failed to load students. Please try again.</div>
        ) : studentsLoading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Loading students…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {['STUDENT', 'DEPT', 'RISK SCORE', 'BATCH', 'RISK TYPE', 'FACTORS', 'URGENCY'].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => {
                const name = s.student?.user
                  ? `${s.student.user.first_name} ${s.student.user.last_name}`
                  : '—';
                const roll = s.student?.enrollment_number ?? '—';
                const dept = s.student?.department?.code ?? '—';
                const batch = s.student?.batch_year ?? '—';
                const riskScore = s.risk_score ?? '—';
                const riskType = s.risk_type ?? '—';
                const factors = (Array.isArray(s.contributing_factors) ? s.contributing_factors : (typeof s.contributing_factors === 'string' ? s.contributing_factors.split(',').map(f => f.trim()) : [])).slice(0, 2).join(', ') || '—';
                const urgency = s.risk_level ?? 'medium';

                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{name}</div>
                      <div className="text-xs text-gray-400">{roll}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{dept}</TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-red-600">{riskScore}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{batch}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {riskType}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 max-w-[140px] truncate">{factors}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCY_VARIANTS[urgency] ?? URGENCY_VARIANTS.medium}`}>
                        {URGENCY_LABEL[urgency] ?? 'Medium'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {pagination.total === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, pagination.total)}–
              {Math.min(page * PER_PAGE, pagination.total)} of {pagination.total} students
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
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
      </Card>
    </div>
  );
}