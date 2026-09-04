'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors',
        'placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-zinc-300',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
