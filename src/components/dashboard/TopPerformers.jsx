import { TOP_PERFORMERS } from '../../data/mockData';
import { Card } from '@/components/ui/card';

export default function TopPerformers() {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Top Performers</h3>
      <div className="space-y-3">
        {TOP_PERFORMERS.map(p => (
          <div key={p.rank} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
              ${p.rank === 1 ? 'bg-yellow-400 text-yellow-900' : p.rank === 2 ? 'bg-gray-300 text-gray-700' : p.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {p.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              <p className="text-xs text-gray-400">{p.dept} · {p.roll}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">{p.eiScore}</p>
              <p className="text-xs text-gray-400">{p.percentile}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
