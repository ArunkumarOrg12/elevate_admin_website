import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-50 text-indigo-700 border-indigo-200',
        ready:
          'bg-emerald-50 text-emerald-700 border-emerald-200',
        developing:
          'bg-amber-50 text-amber-700 border-amber-200',
        'at-risk':
          'bg-red-50 text-red-700 border-red-200',
        completed:
          'bg-emerald-50 text-emerald-700 border-emerald-200',
        scheduled:
          'bg-blue-50 text-blue-700 border-blue-200',
        secondary:
          'bg-gray-100 text-gray-700 border-gray-200',
        outline:
          'bg-transparent text-gray-700 border-gray-200',
        pdf:
          'rounded bg-red-50 text-red-600 border-transparent',
        excel:
          'rounded bg-green-50 text-green-600 border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
