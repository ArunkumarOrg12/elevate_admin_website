const RISK_CONFIG = {
  INDUSTRY_READY:  { label: 'Industry Ready',  className: 'bg-green-100 text-green-800 border-green-200' },
  PLACEMENT_READY: { label: 'Placement Ready', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  MODERATE:        { label: 'Moderate',        className: 'bg-amber-100 text-amber-800 border-amber-200' },
  HIGH_RISK:       { label: 'High Risk',        className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function StatusBadge({ riskCategory }) {
  const config = RISK_CONFIG[riskCategory] ?? RISK_CONFIG['MODERATE'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
