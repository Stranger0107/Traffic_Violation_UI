import { useState } from 'react';
import { Car, AlertCircle, CheckCircle, Clock, MessageSquare, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Challan {
  id: string;
  plateNumber: string;
  violation: string;
  fine: number;
  timestamp: string;
  location: string;
  status: 'issued' | 'contested' | 'paid';
  evidenceUrl?: string;
}

interface GrievanceStatus {
  challanId: string;
  status: 'open' | 'approved' | 'rejected';
  submittedAt: string;
  adminRemarks?: string;
}

const mockChallans: Challan[] = [
  {
    id: 'CH-2024-001',
    plateNumber: 'DL-3C-AB-1234',
    violation: 'Overspeeding (85 km/h in 60 zone)',
    fine: 2000,
    timestamp: '2026-04-26 14:23',
    location: 'MG Road, Zone 3',
    status: 'issued',
    evidenceUrl: '/evidence/ch-2024-001.jpg',
  },
  {
    id: 'CH-2024-002',
    plateNumber: 'DL-3C-AB-1234',
    violation: 'Red Light Violation',
    fine: 1000,
    timestamp: '2026-04-20 10:15',
    location: 'Connaught Place',
    status: 'paid',
  },
];

const mockGrievanceStatus: GrievanceStatus = {
  challanId: 'CH-2024-001',
  status: 'open',
  submittedAt: '2026-04-26 15:00',
};

export function MobileCitizenView() {
  const [activeTab, setActiveTab] = useState<'challans' | 'grievance'>('challans');
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceReason, setGrievanceReason] = useState('');

  const pendingChallans = mockChallans.filter((c) => c.status !== 'paid');

  const handleSubmitGrievance = () => {
    alert('Grievance submitted successfully');
    setShowGrievanceForm(false);
    setGrievanceReason('');
    setSelectedChallan(null);
    setActiveTab('grievance');
  };

  if (selectedChallan && !showGrievanceForm) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <div className="bg-primary text-white p-6">
          <button onClick={() => setSelectedChallan(null)} className="text-blue-100 mb-2 text-sm hover:text-white">
            ← Back to My Challans
          </button>
          <h1 className="text-2xl font-semibold">Challan Details</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary mb-2">{selectedChallan.plateNumber}</div>
              <StatusBadge status={selectedChallan.status} />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Challan ID</p>
                <p className="text-sm font-medium text-foreground">{selectedChallan.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Violation Type</p>
                <p className="text-sm font-medium text-foreground">{selectedChallan.violation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fine Amount</p>
                <p className="text-xl font-bold text-foreground">₹{selectedChallan.fine.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <p className="text-sm text-foreground">{selectedChallan.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm text-foreground">{selectedChallan.location}</p>
              </div>
            </div>
          </div>

          {selectedChallan.evidenceUrl && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Evidence</h3>
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Violation snapshot</p>
              </div>
            </div>
          )}

          {selectedChallan.status === 'issued' && (
            <div className="space-y-3">
              <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Pay Fine (₹{selectedChallan.fine})
              </button>
              <button
                onClick={() => setShowGrievanceForm(true)}
                className="w-full py-3 bg-card border-2 border-primary text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Raise Grievance
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showGrievanceForm) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <div className="bg-primary text-white p-6">
          <button onClick={() => setShowGrievanceForm(false)} className="text-blue-100 mb-2 text-sm hover:text-white">
            ← Back
          </button>
          <h1 className="text-2xl font-semibold">Raise Grievance</h1>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Before submitting a grievance</p>
                <p>Please ensure you have valid documentation or evidence to support your claim. False grievances may result in additional penalties.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Challan ID</p>
            <p className="text-sm font-medium text-foreground mb-3">{selectedChallan?.id}</p>
            <p className="text-xs text-muted-foreground mb-1">Violation</p>
            <p className="text-sm font-medium text-foreground">{selectedChallan?.violation}</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Reason for Dispute</label>
            <textarea
              value={grievanceReason}
              onChange={(e) => setGrievanceReason(e.target.value)}
              placeholder="Please explain why you believe this challan is incorrect..."
              rows={6}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <button
            onClick={handleSubmitGrievance}
            disabled={!grievanceReason.trim()}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Grievance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <div className="bg-primary text-white p-6">
        <h1 className="text-2xl font-semibold mb-1">My e-Challans</h1>
        <p className="text-blue-100 text-sm">DL-3C-AB-1234</p>
      </div>

      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab('challans')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'challans'
              ? 'text-primary border-b-2 border-primary bg-blue-50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Challans ({mockChallans.length})
        </button>
        <button
          onClick={() => setActiveTab('grievance')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'grievance'
              ? 'text-primary border-b-2 border-primary bg-blue-50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Grievance Tracker
        </button>
      </div>

      {activeTab === 'challans' ? (
        <div className="p-4 space-y-4">
          {mockChallans.length > 0 ? (
            mockChallans.map((challan) => (
              <button
                key={challan.id}
                onClick={() => setSelectedChallan(challan)}
                className="w-full bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-semibold text-primary mb-1">{challan.plateNumber}</div>
                    <div className="text-sm text-foreground">{challan.violation}</div>
                  </div>
                  <StatusBadge status={challan.status} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{challan.timestamp}</div>
                  <div className="text-lg font-semibold text-foreground">₹{challan.fine}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No pending challans!</h3>
              <p className="text-sm text-muted-foreground">Drive safe and follow traffic rules</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6">
          {mockGrievanceStatus ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted border-b border-border">
                <h3 className="font-semibold text-foreground">Active Grievance</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Challan ID</p>
                  <p className="text-sm font-medium text-foreground">{mockGrievanceStatus.challanId}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-3">Status Timeline</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-green-500" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-foreground">Submitted</p>
                        <p className="text-xs text-muted-foreground">{mockGrievanceStatus.submittedAt}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-border" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-foreground">Under Review</p>
                        <p className="text-xs text-muted-foreground">Pending admin decision</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-muted border border-border rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm text-muted-foreground">Final Decision</p>
                        <p className="text-xs text-muted-foreground">Awaiting review</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Your grievance is being reviewed</p>
                      <p className="mt-1">You will be notified once the admin makes a decision. This typically takes 2-3 business days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No Active Grievances</h3>
              <p className="text-sm text-muted-foreground">You haven't submitted any disputes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
