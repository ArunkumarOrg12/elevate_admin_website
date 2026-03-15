import { QUICK_METRICS } from '../../data/mockData';
import { Card } from '@/components/ui/card';

const METRICS = [
  { key: 'campusReady', label: 'Campus Ready', color: 'emerald', suffix: '' },
  { key: 'developing', label: 'Developing', color: 'amber', suffix: '' },
  { key: 'atRisk', label: 'At Risk', color: 'red', suffix: '' },
  { key: 'placementRate', label: 'Placement Rate', color: 'indigo', suffix: '%' },
  { key: 'assessmentCycles', label: 'Assessment Cycles', color: 'slate', suffix: '' },
  { key: 'departments', label: 'Departments', color: 'cyan', suffix: '' },
];

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function QuickMetrics() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {METRICS.map((m, i) => (
        <Card key={m.key} className={`p-4 text-center border ${colorMap[m.color]} page-enter`}
          style={{ animationDelay: `${i * 80}ms` }}>
          <p className="stat-number text-xl">{QUICK_METRICS[m.key]}{m.suffix}</p>
          <p className="text-xs font-medium mt-1">{m.label}</p>
        </Card>
      ))}
    </div>
  );
}
