import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { ViolationsTable } from './components/ViolationsTable';
import { GrievancesView } from './components/GrievancesView';
import { MobileOfficerView } from './components/MobileOfficerView';
import { MobileCitizenView } from './components/MobileCitizenView';
import { Smartphone } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'violations' | 'grievances' | 'settings'>('dashboard');
  const [viewMode, setViewMode] = useState<'admin' | 'officer' | 'citizen'>('admin');

  return (
    <div className="size-full bg-background">
      {viewMode === 'admin' ? (
        <div className="flex h-screen">
          <Sidebar activeView={activeView} onNavigate={setActiveView} />
          {activeView === 'dashboard' && <AdminDashboard />}
          {activeView === 'violations' && <ViolationsTable />}
          {activeView === 'grievances' && <GrievancesView />}
          {activeView === 'settings' && (
            <div className="flex-1 overflow-auto bg-background p-8">
              <h1 className="text-3xl font-semibold text-foreground mb-6">Settings</h1>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground">Configuration settings will be available here</p>
              </div>
            </div>
          )}
        </div>
      ) : viewMode === 'officer' ? (
        <MobileOfficerView />
      ) : (
        <MobileCitizenView />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-muted-foreground mb-2 px-2">Switch View:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'admin' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setViewMode('officer')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'officer' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Officer
            </button>
            <button
              onClick={() => setViewMode('citizen')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'citizen' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Citizen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}