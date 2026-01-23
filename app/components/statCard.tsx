// import { cn } from '@/lib/utils';

import React from "react";
import { cn } from "../lib/util";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  icon?: React.ElementType<{ className?: string }>;
  label: React.ReactNode;
  value: React.ReactNode;
  change?: React.ReactNode;
  trend?: Trend;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend = "neutral",
  className,
}: Readonly<StatCardProps>) {

    let trendClass =  'text-muted-foreground';
    if (trend === 'up') {
      trendClass = 'text-success';
    } else if (trend === 'down') {
      trendClass = 'text-destructive';
    }

  return (
    <div className={cn('compact-card card-hover', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="label-secondary mb-1">{label}</p>
          <p className="kpi-value text-foreground">{value}</p>
          {change && (
            <p className={cn(
              'badge-text font-medium mt-1.5',
              trendClass
            )}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="icon-standard text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};