import { useEffect, useState } from 'react';
import { User, Shield, Trash2, Plus, AlertCircle } from 'lucide-react';
import { getOfficers, createOfficer, deleteOfficer } from '../api';

export function OfficersView() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const loadOfficers = async () => {
    setLoading(true);
    try {
      const data = await getOfficers();
      setOfficers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load officers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createOfficer(newUsername, newPassword);
      setShowAddForm(false);
      setNewUsername('');
      setNewPassword('');
      loadOfficers();
    } catch (err: any) {
      setError(err.message || 'Failed to create officer');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this officer?')) return;
    try {
      await deleteOfficer(id);
      loadOfficers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete officer');
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Manage Officers</h1>
          <p className="text-muted-foreground">Add or remove traffic officer accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          {showAddForm ? 'Cancel' : 'Add New Officer'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create Officer Account</h2>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1">Username</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="officer_name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Secure password"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium h-[42px]"
            >
              Create Account
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="p-4 text-sm font-medium text-muted-foreground w-16 text-center">ID</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Username</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Loading officers...</td>
              </tr>
            ) : officers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No officers found.</td>
              </tr>
            ) : (
              officers.map((officer) => (
                <tr key={officer.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm text-foreground text-center font-medium">#{officer.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{officer.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-500">
                      <Shield className="w-3 h-3" />
                      {officer.role}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(officer.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete Officer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
