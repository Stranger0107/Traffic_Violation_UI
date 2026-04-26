import { useEffect, useState } from 'react';
import { FileText, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminGrievances, getAdminViolations, type GrievanceRecord, type ViolationRecord } from '../api';

type ActivityItem = {
  id: string;
  plate: string;
  action: string;
  time: string;
};

export function AdminDashboard() {
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [violationData, grievanceData] = await Promise.all([getAdminViolations(), getAdminGrievances()]);
        if (!active) {
          return;
        }
        setViolations(violationData);
        setGrievances(grievanceData);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const chartData = Object.entries(
    violations.reduce<Record<string, number>>((accumulator, violation) => {
      const month = new Date(violation.timestamp).toLocaleString('en-US', { month: 'short' });
      accumulator[month] = (accumulator[month] ?? 0) + 1;
      return accumulator;
    }, {})
  ).slice(-6).map(([month, count]) => ({ month, violations: count }));

  const recentActivity: ActivityItem[] = [...violations.slice(0, 3).map((violation) => ({
    id: `violation-${violation.id}`,
    plate: violation.plateNumber,
    action: `Violation detected: ${violation.violation}`,
    time: new Date(violation.timestamp).toLocaleString(),
  })), ...grievances.slice(0, 2).map((grievance) => ({
    id: `grievance-${grievance.id}`,
    plate: grievance.plateNumber,
    action: `Grievance ${grievance.status}`,
    time: grievance.createdAt ? new Date(grievance.createdAt).toLocaleString() : 'Recently',
  }))].slice(0, 5);

  const totalViolations = violations.length;
  const openGrievances = grievances.filter((grievance) => grievance.status === 'open').length;
  const revenueCollected = violations.filter((violation) => violation.status === 'paid').reduce((total, violation) => total + violation.fine, 0);
  const processingRate = totalViolations === 0 ? 0 : Math.round((violations.filter((violation) => violation.status === 'issued').length / totalViolations) * 1000) / 10;

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor traffic violations and system performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Violations" value={loading ? '...' : totalViolations.toLocaleString()} change={12.5} icon={FileText} iconColor="bg-blue-500" />
          <StatCard title="Open Grievances" value={loading ? '...' : openGrievances.toString()} change={-8.3} icon={AlertCircle} iconColor="bg-purple-500" />
          <StatCard title="Revenue Collected" value={loading ? '...' : `₹${revenueCollected.toLocaleString()}`} change={18.7} icon={DollarSign} iconColor="bg-green-500" />
          <StatCard title="Processing Rate" value={loading ? '...' : `${processingRate}%`} change={3.1} icon={TrendingUp} iconColor="bg-amber-500" />
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
              {!loading && recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
