import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ status }) {
  const variantMap = {
    'Ready': 'ready',
    'Developing': 'developing',
    'At Risk': 'at-risk',
  };
  return <Badge variant={variantMap[status] || 'secondary'}>{status}</Badge>;
}
