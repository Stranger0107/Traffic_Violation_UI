import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { ViolationsTable } from './components/ViolationsTable';
import { GrievancesView } from './components/GrievancesView';
import { MobileOfficerView } from './components/MobileOfficerView';
import { MobileCitizenView } from './components/MobileCitizenView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { clearToken, getToken, getUserRole, UserRole } from './api';

export default function App() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'authenticated'>(() =>
    getToken() ? 'authenticated' : 'login'
  );
  const [activeView, setActiveView] = useState<'dashboard' | 'violations' | 'grievances' | 'settings'>('dashboard');
  const [viewMode, setViewMode] = useState<UserRole>(() => getUserRole() ?? 'admin');

  useEffect(() => {
    if (getToken()) {
      setAuthState('authenticated');
      setViewMode(getUserRole() ?? 'admin');
    }
  }, []);

  if (authState === 'login') {
    return (
      <LoginView
        onLogin={(role) => {
          setViewMode(role);
          setAuthState('authenticated');
        }}
        onNavigateRegister={() => setAuthState('register')}
      />
    );
  }

  if (authState === 'register') {
    return (
      <RegisterView
        onRegister={() => setAuthState('login')}
        onNavigateLogin={() => setAuthState('login')}
      />
    );
  }

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
        <button
          onClick={() => {
            clearToken();
            setActiveView('dashboard');
            setAuthState('login');
          }}
          className="px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}