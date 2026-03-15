import { ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { DEPARTMENT_SUMMARY } from '../../data/mockData';
import { getEIColor } from '../../utils/helpers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';

export default function DepartmentSummary() {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Department Summary</h3>
        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 gap-1 px-2">
          View all <ArrowRight size={14} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {['DEPARTMENT', 'STUDENTS', 'AVG EI', 'CAMPUS READY', 'AT RISK', 'STATUS'].map(h => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {DEPARTMENT_SUMMARY.map(d => (
            <TableRow key={d.dept}>
              <TableCell>
                <div className="font-medium text-sm text-gray-900">{d.dept}</div>
                <div className="text-xs text-gray-400">{d.fullName}</div>
              </TableCell>
              <TableCell className="text-sm text-gray-700">{d.students}</TableCell>
              <TableCell>
                <span className={`font-semibold text-sm ${getEIColor(d.avgEI)}`}>{d.avgEI}</span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-700">{d.campusReady}</div>
                <div className="text-xs text-emerald-600">{d.campusReadyPct}%</div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-red-600">{d.atRisk}</div>
                <div className="text-xs text-red-400">{d.atRiskPct}%</div>
              </TableCell>
              <TableCell><StatusBadge status={d.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
