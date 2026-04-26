import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor = 'bg-blue-500' }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-foreground mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
