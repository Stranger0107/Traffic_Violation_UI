import { LayoutDashboard, AlertCircle, FileText, Settings, Shield } from 'lucide-react';

export type NavView = 'dashboard' | 'violations' | 'grievances' | 'settings';

interface SidebarProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'violations', label: 'All Violations', icon: FileText },
    { id: 'grievances', label: 'Grievances', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col">
      <div className="p-6 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-[var(--sidebar-foreground)] font-semibold">e-Challan</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]'
                      : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-[var(--sidebar-accent)] rounded-full flex items-center justify-center">
            <span className="text-sm text-[var(--sidebar-foreground)]">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--sidebar-foreground)] font-medium truncate">Admin User</p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">admin@echallan.gov</p>
          </div>
        </div>
      </div>
    </div>
  );
}
