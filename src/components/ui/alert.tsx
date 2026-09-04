import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva('rounded-xl border p-4 text-sm', {
  variants: {
    variant: {
      info: 'border-teal-200 bg-teal-50 text-teal-900',
      warning: 'border-amber-200 bg-amber-50 text-amber-900',
      urgent: 'border-orange-300 bg-orange-50 text-orange-900',
      emergency: 'border-red-300 bg-red-50 text-red-900',
      neutral: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    },
  },
  defaultVariants: { variant: 'info' },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('mb-1 font-semibold', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm leading-relaxed opacity-90', className)} {...props} />;
}
