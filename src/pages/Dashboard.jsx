import { RefreshCw, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import OverviewStats from '../components/dashboard/OverviewStats';
import QuickMetrics from '../components/dashboard/QuickMetrics';
import EITrendChart from '../components/dashboard/EITrendChart';
import RiskDistribution from '../components/dashboard/RiskDistribution';
import DepartmentComparison from '../components/dashboard/DepartmentComparison';
import PlacementProgress from '../components/dashboard/PlacementProgress';
import DepartmentSummary from '../components/dashboard/DepartmentSummary';
import RecentActivity from '../components/dashboard/RecentActivity';
import TopPerformers from '../components/dashboard/TopPerformers';

export default function Dashboard() {
  const { user, isSuperAdmin } = useAuth();
  const subtitle = isSuperAdmin
    ? 'All Institutions · AY 2024-25'
    : `${user?.college?.name} · AY 2024-25 · Batch 2025`;

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline text-xs text-gray-400">Last synced: just now</span>
          <button className="btn-secondary flex items-center gap-1.5 text-sm px-3 py-1.5">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn-primary flex items-center gap-1.5 text-sm px-3 py-1.5">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <OverviewStats />

      {/* Quick metrics */}
      <QuickMetrics />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <EITrendChart />
        <RiskDistribution />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <DepartmentComparison />
        <PlacementProgress />
      </div>

      {/* Department summary table */}
      <DepartmentSummary />

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <TopPerformers />
      </div>
    </div>
  );
}
