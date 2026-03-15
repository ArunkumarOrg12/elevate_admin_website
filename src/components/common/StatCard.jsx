export default function StatCard({ label, value, description, trend, trendPositive, icon: Icon, accentColor = 'indigo' }) {
  const accentMap = {
    blue: 'border-blue-500 bg-blue-50 text-blue-600',
    indigo: 'border-indigo-600 bg-indigo-50 text-indigo-600',
    red: 'border-red-500 bg-red-50 text-red-600',
    cyan: 'border-cyan-500 bg-cyan-50 text-cyan-600',
    emerald: 'border-emerald-500 bg-emerald-50 text-emerald-600',
    amber: 'border-amber-500 bg-amber-50 text-amber-600',
  };
  const [borderColor, iconBg, iconColor] = accentMap[accentColor]?.split(' ') || accentMap.indigo.split(' ');

  return (
    <div className={`card p-5 hover-lift border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="table-header text-xs mb-1">{label}</p>
          <p className={`stat-number text-2xl md:text-3xl mt-1`}>{value}</p>
          {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
