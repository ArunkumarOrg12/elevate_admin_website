import { Card } from '@/components/ui/card';
import { useDashboardStats } from '../../controllers/dashboardController';

const colorMap = {
  green:  'bg-green-50 text-green-700 border-green-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  cyan:   'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function QuickMetrics() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        Failed to load metrics. Please refresh.
      </div>
    );
  }

  const dist             = data.risk_distribution ?? {};
  const industryReady    = dist.INDUSTRY_READY?.count  ?? data.industry_ready_count  ?? 0;
  const placementReady   = dist.PLACEMENT_READY?.count ?? data.placement_ready_count ?? 0;
  const moderate         = dist.MODERATE?.count        ?? data.moderate_count        ?? 0;
  const highRisk         = dist.HIGH_RISK?.count       ?? data.high_risk_count       ?? 0;
  const placementRate    = data.placement_rate          ?? data.placementRate         ?? 0;
  const departments      = data.departments_count       ?? data.departments           ?? 0;

  const METRICS = [
    { label: 'Industry Ready',  value: industryReady,        color: 'green'  },
    { label: 'Placement Ready', value: placementReady,       color: 'blue'   },
    { label: 'Moderate',        value: moderate,             color: 'amber'  },
    { label: 'High Risk',       value: highRisk,             color: 'red'    },
    { label: 'Placement Rate',  value: `${placementRate}%`,  color: 'indigo' },
    { label: 'Departments',     value: departments,          color: 'cyan'   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {METRICS.map((m, i) => (
        <Card
          key={m.label}
          className={`p-4 text-center border ${colorMap[m.color]} page-enter`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <p className="stat-number text-xl">{m.value}</p>
          <p className="text-xs font-medium mt-1">{m.label}</p>
        </Card>
      ))}
    </div>
  );
}
