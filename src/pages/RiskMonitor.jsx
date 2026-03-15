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
import { RISK_STATS, RISK_BY_DEPARTMENT, INTERVENTION_CATEGORIES, WEAK_SECTIONS, AT_RISK_STUDENTS } from '../data/mockData';

const URGENCY_VARIANTS = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-amber-100 text-amber-700',
};

export default function RiskMonitor() {
  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Risk Monitor
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{RISK_STATS.totalAtRisk} students require intervention · AY 2024-25</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="destructive" size="sm">Send Alert</Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Critical Attention Required</h3>
          <p className="text-sm text-red-700 mt-0.5">
            {RISK_STATS.totalAtRisk} students (20.3%) are below the employability threshold. Immediate intervention recommended for {RISK_STATS.criticalRisk} critical-risk students in MECH and CIVIL departments.
          </p>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100 mt-1 px-0 gap-1">
            View Action Plan <ArrowRight size={13} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL AT RISK" value={RISK_STATS.totalAtRisk} description="EI < 50" icon={AlertTriangle} accentColor="red" />
        <StatCard label="CRITICAL RISK" value={RISK_STATS.criticalRisk} description="EI < 40 · Urgent" icon={AlertOctagon} accentColor="red" />
        <StatCard label="DECLINING TREND" value={RISK_STATS.decliningTrend} description="Negative velocity" icon={TrendingDown} accentColor="amber" />
        <StatCard label="INTERVENTION PENDING" value={RISK_STATS.interventionPending} description="No action taken" icon={Clock} accentColor="amber" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">At-Risk by Department</CardTitle>
            <CardDescription>Student count at risk per dept</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={RISK_BY_DEPARTMENT} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={40} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                <Bar dataKey="count" name="At Risk" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intervention Categories</CardTitle>
            <CardDescription>Distribution by intervention type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={INTERVENTION_CATEGORIES} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                  paddingAngle={3} dataKey="value">
                  {INTERVENTION_CATEGORIES.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {INTERVENTION_CATEGORIES.map(c => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-600 text-xs">{c.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{c.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weak Sections Analysis</CardTitle>
            <CardDescription>Students scoring below 50</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {WEAK_SECTIONS.map(s => {
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
          </CardContent>
        </Card>
      </div>

      {/* At-risk table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-gray-100 pb-4">
          <CardTitle className="text-base">At-Risk Students</CardTitle>
          <CardDescription>Students requiring immediate intervention</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              {['STUDENT', 'DEPT', 'EI SCORE', 'CGPA', 'VELOCITY', 'INTERVENTION', 'URGENCY'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {AT_RISK_STUDENTS.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.roll}</div>
                </TableCell>
                <TableCell className="text-sm text-gray-700">{s.dept}</TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-red-600">{s.eiScore}</span>
                </TableCell>
                <TableCell className="text-sm text-gray-700">{s.cgpa}</TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-red-600">{s.velocity}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.intervention}</span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCY_VARIANTS[s.urgency]}`}>
                    {s.urgency}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
