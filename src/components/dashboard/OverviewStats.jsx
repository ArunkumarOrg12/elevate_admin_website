import { Users, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import StatCard from '../common/StatCard';
import { DASHBOARD_STATS } from '../../data/mockData';

export default function OverviewStats() {
  const s = DASHBOARD_STATS;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="page-enter animate-delay-100">
        <StatCard label="TOTAL STUDENTS" value={s.totalStudents.toLocaleString()}
          description="Active in AY 2024-25"
          trend={`↑ ${s.totalStudentsChange} from last year`} trendPositive
          icon={Users} accentColor="blue" />
      </div>
      <div className="page-enter animate-delay-200">
        <StatCard label="AVG EMPLOYABILITY INDEX" value={s.avgEI}
          description="Out of 100 · All departments"
          trend={`↑ +${s.avgEIChange}% vs last cycle`} trendPositive
          icon={TrendingUp} accentColor="indigo" />
      </div>
      <div className="page-enter animate-delay-300">
        <StatCard label="HIGH RISK STUDENTS" value={s.highRisk.toLocaleString()}
          description="EI score below 50"
          trend={`${s.highRiskPercent}% of total cohort`} trendPositive={false}
          icon={AlertTriangle} accentColor="red" />
      </div>
      <div className="page-enter animate-delay-400">
        <StatCard label="GROWTH VELOCITY" value={`+${s.growthVelocity}%`}
          description="EI growth this academic year"
          trend={`Above target (${s.growthTarget}%)`} trendPositive
          icon={Zap} accentColor="cyan" />
      </div>
    </div>
  );
}
