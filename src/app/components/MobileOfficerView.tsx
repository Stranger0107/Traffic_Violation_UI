import { useEffect, useState } from 'react';
import { Upload, Check, X, Camera, Clock } from 'lucide-react';
import { getPendingChallans, reviewChallan, uploadTrafficVideo, type ViolationRecord } from '../api';

export function MobileOfficerView() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'pending'>('pending');
  const [pendingChallans, setPendingChallans] = useState<ViolationRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPending() {
      const data = await getPendingChallans();
      if (active) {
        setPendingChallans(data);
      }
    }

    loadPending();

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsProcessing(true);
    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      await uploadTrafficVideo(selectedFile);
      const refreshed = await getPendingChallans();
      setPendingChallans(refreshed);
      setActiveTab('pending');
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleReview = async (challanId: string, action: 'approve' | 'reject') => {
    await reviewChallan(Number(challanId), action);
    setPendingChallans(await getPendingChallans());
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
          Pending Review ({pendingChallans.length})
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
            <input
              type="file"
              accept="video/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              className="mb-4 block w-full text-sm text-muted-foreground"
            />
            <button
              onClick={handleUpload}
              disabled={isProcessing || !selectedFile}
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
          {pendingChallans.map((challan) => (
            <div key={challan.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-muted h-40 flex items-center justify-center border-b border-border">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Pending review from backend DB</p>
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
                    <div className="text-xs text-green-600 font-medium">{challan.status}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {challan.timestamp}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleReview(challan.id, 'approve')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(challan.id, 'reject')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingChallans.length === 0 && (
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
