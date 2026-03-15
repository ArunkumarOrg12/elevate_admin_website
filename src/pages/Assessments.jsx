import { useState } from 'react';
import { Download, Plus, ClipboardList, CheckCircle, Clock, Users, Calendar } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { ASSESSMENT_CYCLES } from '../data/mockData';
import { formatDate } from '../utils/helpers';

function ScheduleModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 fade-in">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Schedule Assessment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Name</label>
            <Input placeholder="e.g. Campus Readiness Evaluation" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>Comprehensive</option>
                <option>Aptitude + Verbal</option>
                <option>Technical</option>
                <option>Full Stack</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
            <select multiple className="w-full border border-gray-200 rounded-[9px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24">
              {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'MBA', 'MCA'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Schedule</Button>
        </div>
      </Card>
    </div>
  );
}

const TYPE_COLORS = {
  'Comprehensive': 'bg-indigo-50 text-indigo-700',
  'Aptitude + Verbal': 'bg-blue-50 text-blue-700',
  'Technical': 'bg-purple-50 text-purple-700',
  'Full Stack': 'bg-cyan-50 text-cyan-700',
};

export default function Assessments() {
  const [showModal, setShowModal] = useState(false);
  const stats = {
    total: ASSESSMENT_CYCLES.length,
    completed: ASSESSMENT_CYCLES.filter(a => a.status === 'Completed').length,
    scheduled: ASSESSMENT_CYCLES.filter(a => a.status === 'Scheduled').length,
    participants: 1755,
  };

  return (
    <div className="page-enter space-y-5">
      {showModal && <ScheduleModal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Assessment Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{stats.total} cycles · Batch 2025 · AY 2024-25</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" onClick={() => setShowModal(true)}>
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
