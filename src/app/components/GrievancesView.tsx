import { useEffect, useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { getAdminGrievances, resolveGrievance, type GrievanceRecord } from '../api';

export function GrievancesView() {
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadGrievances() {
      const data = await getAdminGrievances();
      if (active) {
        setGrievances(data);
      }
    }

    loadGrievances();

    return () => {
      active = false;
    };
  }, []);

  const openGrievances = grievances.filter((g) => g.status === 'open');

  const handleResolve = async (action: 'approve' | 'reject') => {
    setIsResolving(true);
    try {
      if (!selectedGrievance) {
        return;
      }

      await resolveGrievance({
        grievance_id: Number(selectedGrievance.id),
        action,
        admin_remark: adminRemarks,
      });

      const updated = await getAdminGrievances();
      setGrievances(updated);
      alert(`Grievance ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setSelectedGrievance(null);
      setAdminRemarks('');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Grievance Management</h1>
          <p className="text-muted-foreground">Review and resolve citizen disputes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-muted">
              <h2 className="font-semibold text-foreground">Open Disputes ({openGrievances.length})</h2>
            </div>
            <div className="divide-y divide-border max-h-[calc(100vh-16rem)] overflow-y-auto">
              {openGrievances.map((grievance) => (
                <button
                  key={grievance.id}
                  onClick={() => setSelectedGrievance(grievance)}
                  className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                    selectedGrievance?.id === grievance.id ? 'bg-muted border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{grievance.id}</span>
                    <span className="text-xs text-muted-foreground">{grievance.createdAt.split('T')[0]}</span>
                  </div>
                  <div className="text-sm font-semibold text-primary mb-1">{grievance.plateNumber}</div>
                  <div className="text-xs text-muted-foreground">{grievance.challan?.violation}</div>
                </button>
              ))}
              {openGrievances.length === 0 && (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No open grievances</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedGrievance ? (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Grievance Details</h2>
                      <p className="text-sm text-muted-foreground">ID: {selectedGrievance.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedGrievance(null)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Challan ID</p>
                      <p className="text-sm font-medium text-foreground">{selectedGrievance.violationId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Plate Number</p>
                      <p className="text-sm font-semibold text-primary">{selectedGrievance.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Violation</p>
                      <p className="text-sm text-foreground">{selectedGrievance.challan?.violation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Fine Amount</p>
                      <p className="text-sm font-semibold text-foreground">₹{selectedGrievance.challan?.fine ?? 0}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Citizen's Reason for Dispute</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-foreground">{selectedGrievance.reason}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Evidence</h3>
                    <div className="bg-muted rounded-lg h-64 flex items-center justify-center border border-border">
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">High-res violation snapshot</p>
                        <p className="text-xs mt-1">{selectedGrievance.challan?.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Admin Remarks</label>
                    <textarea
                      value={adminRemarks}
                      onChange={(e) => setAdminRemarks(e.target.value)}
                      placeholder="Enter your decision remarks..."
                      rows={4}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border sticky bottom-0 bg-card">
                    <button
                      onClick={() => handleResolve('approve')}
                      disabled={isResolving || !adminRemarks.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      Approve Grievance (Invalidate Challan)
                    </button>
                    <button
                      onClick={() => handleResolve('reject')}
                      disabled={isResolving || !adminRemarks.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Reject Grievance (Re-issue Challan)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Grievance Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a grievance from the list to view details and take action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
