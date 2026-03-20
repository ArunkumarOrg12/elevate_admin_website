import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { useRiskDistribution } from '../../controllers/dashboardController';
import { getEICategory } from '../../utils/helpers';

const RISK_SEGMENTS = [
  { key: 'INDUSTRY_READY',  label: 'Industry Ready',  color: '#22c55e' },
  { key: 'PLACEMENT_READY', label: 'Placement Ready', color: '#3b82f6' },
  { key: 'MODERATE',        label: 'Moderate',        color: '#f59e0b' },
  { key: 'HIGH_RISK',       label: 'High Risk',       color: '#ef4444' },
];

export default function RiskDistribution() {
  const { data, isLoading, isError } = useRiskDistribution();

  if (isLoading) {
    return (
      <Card className="p-5 h-full">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-48 bg-gray-100 rounded animate-pulse" />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="p-5 h-full flex items-center justify-center text-sm text-red-600">
        Failed to load risk distribution. Please refresh.
      </Card>
    );
  }

  // API may return { INDUSTRY_READY: { count, percent }, ... }
  // or an array of student objects — handle both
  let segments;
  if (Array.isArray(data)) {
    const counts = { INDUSTRY_READY: 0, PLACEMENT_READY: 0, MODERATE: 0, HIGH_RISK: 0 };
    data.forEach((s) => {
      const ei  = s.ei_score ?? s.eiScore ?? 0;
      const cat = s.risk_category ?? getEICategory(ei);
      if (counts[cat] !== undefined) counts[cat]++;
    });
    const total = data.length || 1;
    segments = RISK_SEGMENTS.map((s) => ({
      ...s,
      value: counts[s.key],
      pct:   Math.round((counts[s.key] / total) * 100),
    }));
  } else {
    segments = RISK_SEGMENTS.map((s) => ({
      ...s,
      value: data[s.key]?.count   ?? data[s.key] ?? 0,
      pct:   data[s.key]?.percent ?? 0,
    }));
  }

  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold text-gray-900 mb-1">Risk Distribution</h3>
      <p className="text-xs text-gray-500 mb-3">Industry Ready / Placement Ready / Moderate / High Risk</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={segments}
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {segments.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip
            formatter={(v, n) => [v, n]}
            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {segments.map((d) => (
          <div key={d.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-gray-600">{d.label}</span>
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
