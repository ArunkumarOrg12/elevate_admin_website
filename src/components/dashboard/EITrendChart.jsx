import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EI_TREND_DATA } from '../../data/mockData';

const LINES = [
  { key: 'CSE', color: '#3B82F6' },
  { key: 'ECE', color: '#8B5CF6' },
  { key: 'MECH', color: '#F59E0B' },
  { key: 'IT', color: '#10B981' },
  { key: 'MBA', color: '#06B6D4' },
];

export default function EITrendChart() {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Employability Index Trend</h3>
          <p className="text-xs text-gray-500 mt-0.5">6-month trajectory by department</p>
        </div>
        <select className="text-xs border border-gray-200 rounded-[7px] px-2 py-1 text-gray-600 focus:outline-none">
          <option>All Departments</option>
          {LINES.map(l => <option key={l.key}>{l.key}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={EI_TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <YAxis domain={[50, 85]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
          <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {LINES.map(l => (
            <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color}
              strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
