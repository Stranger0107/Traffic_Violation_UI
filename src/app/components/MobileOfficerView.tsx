import { useState } from 'react';
import { Upload, Check, X, Camera, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PendingChallan {
  id: string;
  plateNumber: string;
  violation: string;
  fine: number;
  snapshot: string;
  timestamp: string;
  confidence: number;
}

const mockPendingChallans: PendingChallan[] = [
  {
    id: 'AI-001',
    plateNumber: 'DL-3C-AB-1234',
    violation: 'Overspeeding (85 km/h)',
    fine: 2000,
    snapshot: 'Frame #1234',
    timestamp: '2026-04-26 14:23',
    confidence: 94.5,
  },
  {
    id: 'AI-002',
    plateNumber: 'MH-12-CD-5678',
    violation: 'Red Light Violation',
    fine: 1000,
    snapshot: 'Frame #1567',
    timestamp: '2026-04-26 14:18',
    confidence: 98.2,
  },
  {
    id: 'AI-003',
    plateNumber: 'KA-01-EF-9012',
    violation: 'No Helmet',
    fine: 500,
    snapshot: 'Frame #1890',
    timestamp: '2026-04-26 14:10',
    confidence: 87.3,
  },
];

export function MobileOfficerView() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'pending'>('pending');

  const handleUpload = async () => {
    setIsProcessing(true);
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setTimeout(() => {
      setIsProcessing(false);
      setUploadProgress(0);
      setActiveTab('pending');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <div className="bg-primary text-white p-6">
        <h1 className="text-2xl font-semibold mb-1">Traffic Officer Portal</h1>
        <p className="text-blue-100 text-sm">e-Challan System</p>
      </div>

      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'pending'
              ? 'text-primary border-b-2 border-primary bg-blue-50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending Review ({mockPendingChallans.length})
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
            activeTab === 'upload'
              ? 'text-primary border-b-2 border-primary bg-blue-50'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upload Footage
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="p-6">
          <div className="bg-card border-2 border-dashed border-border rounded-lg p-8 text-center mb-6">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Upload Traffic Footage</h3>
            <p className="text-sm text-muted-foreground mb-4">MP4 format, max 500MB</p>
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Select Video File
            </button>
          </div>

          {isProcessing && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Processing with AI</h4>
                  <p className="text-sm text-muted-foreground">Analyzing frames with YOLOv8...</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">{uploadProgress}% complete</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {mockPendingChallans.map((challan) => (
            <div key={challan.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-muted h-40 flex items-center justify-center border-b border-border">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">{challan.snapshot}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-semibold text-primary mb-1">{challan.plateNumber}</div>
                    <div className="text-sm text-foreground font-medium">{challan.violation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">₹{challan.fine}</div>
                    <div className="text-xs text-green-600 font-medium">{challan.confidence}% confidence</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {challan.timestamp}
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {mockPendingChallans.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
              <p className="text-sm text-muted-foreground">No pending challans to review</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
