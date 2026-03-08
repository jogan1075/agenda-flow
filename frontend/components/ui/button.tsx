import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50',
        variant === 'default' && 'bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-800',
        variant === 'outline' && 'border border-zinc-300 bg-white hover:bg-zinc-50 focus-visible:ring-zinc-400',
        variant === 'ghost' && 'hover:bg-zinc-100 focus-visible:ring-zinc-300',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500',
        className,
      )}
      {...props}
    />
  );
}
