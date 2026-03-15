import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { RISK_DISTRIBUTION } from '../../data/mockData';
import { Card } from '@/components/ui/card';

const DATA = [
  { name: 'Ready ≥70', value: RISK_DISTRIBUTION.ready.count, color: '#10B981', pct: RISK_DISTRIBUTION.ready.percent },
  { name: 'Developing', value: RISK_DISTRIBUTION.developing.count, color: '#F59E0B', pct: RISK_DISTRIBUTION.developing.percent },
  { name: 'At Risk <50', value: RISK_DISTRIBUTION.atRisk.count, color: '#EF4444', pct: RISK_DISTRIBUTION.atRisk.percent },
];

export default function RiskDistribution() {
  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold text-gray-900 mb-1">Risk Distribution</h3>
      <p className="text-xs text-gray-500 mb-3">Ready / Developing / At Risk</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={85}
            paddingAngle={3} dataKey="value">
            {DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {DATA.map(d => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-gray-600">{d.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">{d.value.toLocaleString()}</span>
              <span className="text-gray-400 text-xs w-10 text-right">{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
