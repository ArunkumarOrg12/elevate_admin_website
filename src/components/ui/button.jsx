import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white rounded-[9px] hover:bg-indigo-700',
        secondary:
          'bg-white text-gray-700 rounded-[9px] border border-gray-200 hover:bg-gray-50',
        destructive:
          'bg-red-500 text-white rounded-[9px] hover:bg-red-600',
        outline:
          'border border-gray-200 bg-white text-gray-700 rounded-[9px] hover:bg-gray-50',
        ghost:
          'text-gray-600 rounded-[9px] hover:bg-gray-100 hover:text-gray-900',
        link:
          'text-indigo-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-10 px-5 py-2.5',
        icon: 'h-9 w-9 rounded-[9px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
