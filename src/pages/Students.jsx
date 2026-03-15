import { useState } from 'react';
import { Download, SlidersHorizontal, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Users, UserCheck, BookOpen, AlertTriangle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { STUDENTS_LIST } from '../data/mockData';
import { getEIColor, getEIBgColor, formatDate } from '../utils/helpers';

const DEPTS = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE', 'MBA', 'MCA'];
const STATUSES = ['All', 'Ready', 'Developing', 'At Risk'];

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronUp size={12} className="text-gray-300" />;
  return sortDir === 'asc' ? <ChevronUp size={12} className="text-indigo-600" /> : <ChevronDown size={12} className="text-indigo-600" />;
}

export default function Students() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortField, setSortField] = useState('eiScore');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const handleSort = field => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  };

  let filtered = STUDENTS_LIST.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.roll.toLowerCase().includes(q)) return false;
    if (dept !== 'All' && s.dept !== dept) return false;
    if (status !== 'All' && s.status !== status) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    let va = a[sortField], vb = b[sortField];
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    total: STUDENTS_LIST.length,
    ready: STUDENTS_LIST.filter(s => s.status === 'Ready').length,
    developing: STUDENTS_LIST.filter(s => s.status === 'Developing').length,
    atRisk: STUDENTS_LIST.filter(s => s.status === 'At Risk').length,
  };

  const COLS = [
    { key: 'name', label: 'STUDENT' },
    { key: 'eiScore', label: 'EI SCORE' },
    { key: 'percentile', label: 'PERCENTILE' },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'consistency', label: 'CONSISTENCY' },
    { key: 'velocity', label: 'VELOCITY' },
    { key: 'status', label: 'STATUS' },
    { key: 'lastAssessment', label: 'LAST ASSESSMENT' },
  ];

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Student Repository
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{counts.total} students · Batch 2025 · AY 2024-25</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm">
            <SlidersHorizontal size={14} /> Advanced Filters
          </Button>
          <Button size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL STUDENTS" value={counts.total} icon={Users} accentColor="blue" />
        <StatCard label="CAMPUS READY" value={counts.ready} description="EI ≥ 70" icon={UserCheck} accentColor="emerald" />
        <StatCard label="DEVELOPING" value={counts.developing} description="EI 50-69" icon={BookOpen} accentColor="amber" />
        <StatCard label="AT RISK" value={counts.atRisk} description="EI < 50" icon={AlertTriangle} accentColor="red" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or roll number..."
                className="pl-9"
              />
            </div>
            <select
              value={dept}
              onChange={e => { setDept(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-[9px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
            >
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <div className="flex gap-1">
              {STATUSES.map(s => (
                <Button
                  key={s}
                  variant={status === s ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => { setStatus(s); setPage(1); }}
                  className={status !== s ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLS.map(c => (
                <TableHead
                  key={c.key}
                  onClick={() => handleSort(c.key)}
                  className="cursor-pointer hover:text-gray-700 select-none"
                >
                  <span className="flex items-center gap-1">
                    {c.label}
                    <SortIcon field={c.key} sortField={sortField} sortDir={sortDir} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.roll} · {s.dept} · {s.year}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`text-sm font-semibold ${getEIColor(s.eiScore)}`}>{s.eiScore}</div>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${getEIBgColor(s.eiScore)}`} style={{ width: `${s.eiScore}%` }} />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700">{s.percentile}</TableCell>
                <TableCell className="text-sm font-medium text-gray-900">{s.cgpa}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-700">{s.consistency}%</div>
                  <div className="w-14 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400" style={{ width: `${s.consistency}%` }} />
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${s.velocity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {s.velocity >= 0 ? '+' : ''}{s.velocity}
                  </span>
                </TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(s.lastAssessment)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing {Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} of {total} students
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
      </Card>
    </div>
  );
}
