import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DEPARTMENT_COMPARISON } from '../../data/mockData';
import { Card } from '@/components/ui/card';

export default function DepartmentComparison() {
  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold text-gray-900 mb-1">Department-wise EI Comparison</h3>
      <p className="text-xs text-gray-500 mb-4">Average EI score per department</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={DEPARTMENT_COMPARISON} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
          <ReferenceLine y={70} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Ready', position: 'right', fontSize: 10, fill: '#10B981' }} />
          <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Risk', position: 'right', fontSize: 10, fill: '#EF4444' }} />
          <Bar dataKey="avgEI" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
