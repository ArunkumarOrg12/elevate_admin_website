export function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n?.toString() ?? '0';
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getEICategory(ei) {
  if (ei >= 80) return 'INDUSTRY_READY';
  if (ei >= 60) return 'PLACEMENT_READY';
  if (ei >= 40) return 'MODERATE';
  return 'HIGH_RISK';
}

export function getEILabel(ei) {
  if (ei >= 80) return 'Industry Ready';
  if (ei >= 60) return 'Placement Ready';
  if (ei >= 40) return 'Moderate';
  return 'High Risk';
}

export function getEIColor(ei) {
  if (ei >= 80) return 'text-green-600';
  if (ei >= 60) return 'text-blue-600';
  if (ei >= 40) return 'text-amber-600';
  return 'text-red-600';
}

export function getEIBgColor(ei) {
  if (ei >= 80) return 'bg-green-500';
  if (ei >= 60) return 'bg-blue-500';
  if (ei >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getEIHexColor(ei) {
  if (ei >= 80) return '#22c55e';
  if (ei >= 60) return '#3b82f6';
  if (ei >= 40) return '#f59e0b';
  return '#ef4444';
}

export function getEIBgClass(ei) {
  if (ei >= 80) return 'bg-green-100 text-green-800';
  if (ei >= 60) return 'bg-blue-100 text-blue-800';
  if (ei >= 40) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

export function formatBatchYear(year) {
  if (!year || year === "N/A") return year ?? "N/A";
  return String(year);
}

export function ordinalSuffix(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}
