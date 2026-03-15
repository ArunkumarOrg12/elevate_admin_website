import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PLACEMENT_PROGRESS } from '../../data/mockData';
import { Card } from '@/components/ui/card';

export default function PlacementProgress() {
  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold text-gray-900 mb-1">Placement Progress</h3>
      <p className="text-xs text-gray-500 mb-4">Monthly offers vs target</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={PLACEMENT_PROGRESS} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="offers" name="Offers" fill="#3B82F6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
