import { Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '../lib/util';

export const AIInsightBadge = ({ message, variant = 'default', className }:
    {message:string, variant:'default'|'success'|'warning'|'info', className?:string}) => {
  const variants = {
    default: 'bg-primary/5 border-primary text-primary',
    success: 'bg-success/5 border-success text-success',
    warning: 'bg-warning/5 border-warning text-warning',
    info: 'bg-secondary/5 border-secondary text-secondary',
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'text-xs font-normal',
        variants[variant],
        className
      )}
    >
      <Sparkles className="w-3 h-3 mr-1" />
      <span>{message}</span>
    </Badge>
  );
};