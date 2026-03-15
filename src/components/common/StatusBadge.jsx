export default function StatusBadge({ status }) {
  const cls = status === 'Ready' ? 'badge-ready' : status === 'Developing' ? 'badge-developing' : 'badge-at-risk';
  return <span className={cls}>{status}</span>;
}
