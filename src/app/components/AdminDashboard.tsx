import { FileText, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', violations: 245 },
  { month: 'Feb', violations: 312 },
  { month: 'Mar', violations: 289 },
  { month: 'Apr', violations: 401 },
  { month: 'May', violations: 378 },
  { month: 'Jun', violations: 432 },
];

const recentActivity = [
  { id: 1, type: 'violation', plate: 'DL-3C-AB-1234', action: 'New violation detected', time: '2 min ago' },
  { id: 2, type: 'payment', plate: 'MH-12-CD-5678', action: 'Fine payment received', time: '15 min ago' },
  { id: 3, type: 'grievance', plate: 'KA-01-EF-9012', action: 'Grievance submitted', time: '1 hour ago' },
  { id: 4, type: 'approval', plate: 'TN-22-GH-3456', action: 'Challan approved by officer', time: '2 hours ago' },
  { id: 5, type: 'violation', plate: 'AP-09-IJ-7890', action: 'New violation detected', time: '3 hours ago' },
];

export function AdminDashboard() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor traffic violations and system performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Violations" value="2,057" change={12.5} icon={FileText} iconColor="bg-blue-500" />
          <StatCard title="Open Grievances" value="23" change={-8.3} icon={AlertCircle} iconColor="bg-purple-500" />
          <StatCard title="Revenue Collected" value="₹4.2L" change={18.7} icon={DollarSign} iconColor="bg-green-500" />
          <StatCard title="Processing Rate" value="94.2%" change={3.1} icon={TrendingUp} iconColor="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Violations Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViolationsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} key="stop-1" />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} key="stop-2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="violations"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#colorViolationsGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{activity.plate}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
