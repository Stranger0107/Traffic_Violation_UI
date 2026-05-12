import { useEffect, useState } from 'react';
import { Car, AlertCircle, CheckCircle, Clock, MessageSquare, FileText, Newspaper, Shield } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { getMyChallans, getMyGrievances, submitGrievance, type GrievanceRecord, type ViolationRecord } from '../api';
import { RoadSafetyNews } from './RoadSafetyNews';
import { SafetyAwareness } from './SafetyAwareness';

export function MobileCitizenView() {
  const [activeTab, setActiveTab] = useState<'challans' | 'grievance' | 'news' | 'awareness'>('challans');
  const [selectedChallan, setSelectedChallan] = useState<ViolationRecord | null>(null);
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceReason, setGrievanceReason] = useState('');
  const [challans, setChallans] = useState<ViolationRecord[]>([]);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [challanData, grievanceData] = await Promise.all([getMyChallans(), getMyGrievances()]);
        if (active) {
          setChallans(challanData);
          setGrievances(grievanceData);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmitGrievance = async () => {
    if (!selectedChallan) {
      return;
    }

    await submitGrievance(Number(selectedChallan.id), grievanceReason);
    const updatedGrievances = await getMyGrievances();
    setGrievances(updatedGrievances);
    setShowGrievanceForm(false);
    setGrievanceReason('');
    setSelectedChallan(null);
    setActiveTab('grievance');
  };

  if (selectedChallan && !showGrievanceForm) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <div className="bg-primary text-white p-6">
          <button onClick={() => setSelectedChallan(null)} className="text-blue-100 mb-2 text-sm hover:text-white flex items-center gap-1">
            <span>←</span> Back to My Challans
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
                <p className="text-sm text-foreground">Recorded by backend DB</p>
              </div>
            </div>
          </div>

          {selectedChallan.timestamp && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Evidence</h3>
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center border border-border overflow-hidden">
                <p className="text-sm text-muted-foreground">Timestamp: {selectedChallan.timestamp}</p>
              </div>
            </div>
          )}

          {selectedChallan.status === 'issued' && (
            <div className="space-y-3 pb-6">
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
          <button onClick={() => setShowGrievanceForm(false)} className="text-blue-100 mb-2 text-sm hover:text-white flex items-center gap-1">
            <span>←</span> Back
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

  const renderContent = () => {
    switch (activeTab) {
      case 'challans':
        return (
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground">Loading challans...</div>
            ) : challans.length > 0 ? (
              challans.map((challan) => (
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
              <div className="bg-card border border-border rounded-lg p-12 text-center mt-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No pending challans!</h3>
                <p className="text-sm text-muted-foreground">Drive safe and follow traffic rules</p>
              </div>
            )}
          </div>
        );
      case 'grievance':
        return (
          <div className="p-4">
            {isLoading ? (
              <div className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground">Loading grievances...</div>
            ) : grievances.length > 0 ? (
              <div className="bg-card border border-border rounded-lg overflow-hidden mt-2">
                <div className="p-4 bg-muted border-b border-border">
                  <h3 className="font-semibold text-foreground">Active Grievances</h3>
                </div>
                <div className="divide-y divide-border">
                  {grievances.map((grievance) => (
                    <div key={grievance.id} className="p-6 space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Challan ID</p>
                        <p className="text-sm font-medium text-foreground">{grievance.violationId}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <StatusBadge status={grievance.status === 'open' ? 'contested' : grievance.status === 'approved' ? 'invalidated' : 'issued'} size="sm" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reason</p>
                        <p className="text-sm text-foreground">{grievance.reason}</p>
                      </div>

                      {grievance.adminRemark && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          {grievance.adminRemark}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center mt-4">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Active Grievances</h3>
                <p className="text-sm text-muted-foreground">You haven't submitted any disputes</p>
              </div>
            )}
          </div>
        );
      case 'news':
        return <RoadSafetyNews />;
      case 'awareness':
        return <SafetyAwareness />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative pb-20">
      <div className="bg-primary text-white p-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Citizen Portal</h1>
        <p className="text-blue-100 text-sm">Welcome back, Rahul (MH12-AB-1234)</p>
      </div>

      <div className="min-h-full">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('challans')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            activeTab === 'challans' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Car className="w-6 h-6" />
          <span className="text-[10px] font-medium">Challans</span>
        </button>
        <button
          onClick={() => setActiveTab('grievance')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            activeTab === 'grievance' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <AlertCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Grievances</span>
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            activeTab === 'news' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Newspaper className="w-6 h-6" />
          <span className="text-[10px] font-medium">News</span>
        </button>
        <button
          onClick={() => setActiveTab('awareness')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            activeTab === 'awareness' ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Shield className="w-6 h-6" />
          <span className="text-[10px] font-medium">Safety</span>
        </button>
      </div>
    </div>
  );
}
