import { CheckCircle, AlertTriangle, ClipboardList, TrendingUp } from 'lucide-react';
import { RECENT_ACTIVITY } from '../../data/mockData';
import { Card } from '@/components/ui/card';

const ICON_MAP = {
  check: { Icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  alert: { Icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  clipboard: { Icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
  trending: { Icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
};

export default function RecentActivity() {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {RECENT_ACTIVITY.map(a => {
          const { Icon, color, bg } = ICON_MAP[a.icon] || ICON_MAP.check;
          return (
            <div key={a.id} className="flex gap-3 items-start">
              <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-tight">{a.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
