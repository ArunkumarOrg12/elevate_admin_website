import { useState } from 'react';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { COLLEGES_LIST } from '../data/mockData';
import { getEIColor } from '../utils/helpers';

export default function CollegeManagement() {
  const [colleges] = useState(COLLEGES_LIST);

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            College Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{colleges.length} institutions on the platform</p>
        </div>
        <Button size="sm" className="flex-shrink-0 self-start">
          <Plus size={14} /> Add College
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Institutions', value: colleges.length, color: 'text-indigo-600' },
          { label: 'Total Students', value: colleges.reduce((a, c) => a + c.students, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Avg Platform EI', value: (colleges.reduce((a, c) => a + c.avgEI, 0) / colleges.length).toFixed(1), color: 'text-emerald-600' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`stat-number text-2xl mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {['COLLEGE', 'CODE', 'LOCATION', 'ADMIN', 'STUDENTS', 'AVG EI', 'STATUS', 'ACTIONS'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {colleges.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Building size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{c.code}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.location}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.admin}</TableCell>
                <TableCell className="text-sm text-gray-700">{c.students.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`text-sm font-semibold ${getEIColor(c.avgEI)}`}>{c.avgEI}</span>
                </TableCell>
                <TableCell><StatusBadge status="Ready" /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
