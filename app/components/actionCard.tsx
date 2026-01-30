import { ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '../lib/util';
import { MouseEventHandler } from 'react';
// import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon?: React.ElementType<{ className?: string }>;
  title: string;
  description: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function ActionCard({ icon: Icon, title, description, count, priority, onClick } : Readonly<ActionCardProps>) {
  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-muted text-muted-foreground',
  };
  
  return (
    <button
      onClick={onClick}
      className="w-full compact-card hover:border-primary hover:shadow-md transition-fast text-left group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {Icon ? <Icon className="icon-standard text-primary" /> : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="badge-text font-semibold text-foreground">{title}</h3>
              {count > 0 && (
                <Badge className={cn('badge-text h-5 px-1.5', priorityColors[priority])}>
                  {count}
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-fast flex-shrink-0" />
      </div>
    </button>
  );
};