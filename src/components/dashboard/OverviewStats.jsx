import { Users, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useDashboardStats } from '../../controllers/dashboardController';

export default function OverviewStats() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load dashboard stats. Please refresh.
      </div>
    );
  }

  // Map API response — support both flat and nested shapes
  const totalStudents  = data.total_students        ?? data.totalStudents        ?? 0;
  const avgEI          = data.avg_ei_score           ?? data.avgEI               ?? 0;
  const avgEIChange    = data.avg_ei_change           ?? data.avgEIChange          ?? 0;
  const growthVelocity = data.growth_velocity         ?? data.growthVelocity       ?? 0;
  const growthTarget   = data.growth_target           ?? data.growthTarget         ?? 0;
  const totalChange    = data.total_students_change   ?? data.totalStudentsChange  ?? 0;

  // High-risk = EI < 40 (HIGH_RISK tier)
  const dist          = data.risk_distribution ?? {};
  const highRiskCount = dist.HIGH_RISK?.count  ?? data.high_risk_count  ?? data.highRisk        ?? 0;
  const highRiskPct   = dist.HIGH_RISK?.percent ?? data.high_risk_percent ?? data.highRiskPercent ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="page-enter animate-delay-100">
        <StatCard
          label="TOTAL STUDENTS"
          value={totalStudents.toLocaleString()}
          description="Active in AY 2024-25"
          trend={totalChange ? `↑ ${totalChange} from last year` : undefined}
          trendPositive
          icon={Users}
          accentColor="blue"
        />
      </div>
      <div className="page-enter animate-delay-200">
        <StatCard
          label="AVG EMPLOYABILITY INDEX"
          value={avgEI}
          description="Out of 100 · All departments"
          trend={avgEIChange ? `↑ +${avgEIChange}% vs last cycle` : undefined}
          trendPositive
          icon={TrendingUp}
          accentColor="indigo"
        />
      </div>
      <div className="page-enter animate-delay-300">
        <StatCard
          label="HIGH RISK STUDENTS"
          value={highRiskCount.toLocaleString()}
          description="EI score below 40"
          trend={highRiskPct ? `${highRiskPct}% of total cohort` : undefined}
          trendPositive={false}
          icon={AlertTriangle}
          accentColor="red"
        />
      </div>
      <div className="page-enter animate-delay-400">
        <StatCard
          label="GROWTH VELOCITY"
          value={`+${growthVelocity}%`}
          description="EI growth this academic year"
          trend={growthTarget ? `Above target (${growthTarget}%)` : undefined}
          trendPositive
          icon={Zap}
          accentColor="cyan"
        />
      </div>
    </div>
  );
}
