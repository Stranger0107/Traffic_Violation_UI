import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Violation {
  id: string;
  plateNumber: string;
  violation: string;
  fine: number;
  timestamp: string;
  status: 'pending_review' | 'issued' | 'contested' | 'paid' | 'invalidated';
  location: string;
}

const mockViolations: Violation[] = [
  { id: 'CH-2024-001', plateNumber: 'DL-3C-AB-1234', violation: 'Overspeeding (85 km/h in 60 zone)', fine: 2000, timestamp: '2026-04-26 14:23', status: 'pending_review', location: 'MG Road, Zone 3' },
  { id: 'CH-2024-002', plateNumber: 'MH-12-CD-5678', violation: 'Red Light Violation', fine: 1000, timestamp: '2026-04-26 13:45', status: 'paid', location: 'Connaught Place' },
  { id: 'CH-2024-003', plateNumber: 'KA-01-EF-9012', violation: 'No Helmet', fine: 500, timestamp: '2026-04-26 12:30', status: 'contested', location: 'Indiranagar Signal' },
  { id: 'CH-2024-004', plateNumber: 'TN-22-GH-3456', violation: 'Wrong Lane Driving', fine: 1500, timestamp: '2026-04-26 11:15', status: 'issued', location: 'Anna Salai' },
  { id: 'CH-2024-005', plateNumber: 'AP-09-IJ-7890', violation: 'Parking Violation', fine: 200, timestamp: '2026-04-26 10:00', status: 'paid', location: 'Commercial Street' },
  { id: 'CH-2024-006', plateNumber: 'RJ-14-KL-2345', violation: 'Mobile Phone Usage', fine: 1000, timestamp: '2026-04-26 09:20', status: 'issued', location: 'Jaipur Highway' },
  { id: 'CH-2024-007', plateNumber: 'GJ-01-MN-6789', violation: 'Overspeeding (95 km/h in 70 zone)', fine: 2500, timestamp: '2026-04-25 18:45', status: 'invalidated', location: 'SG Highway' },
  { id: 'CH-2024-008', plateNumber: 'UP-32-OP-3456', violation: 'Triple Riding', fine: 1000, timestamp: '2026-04-25 17:30', status: 'pending_review', location: 'Gomti Nagar' },
];

export function ViolationsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const filteredViolations = mockViolations.filter((v) =>
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.violation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedViolations = filteredViolations.slice(startIndex, startIndex + itemsPerPage);

  const SkeletonRow = () => (
    <tr className="border-b border-border">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-2">All Violations</h1>
          <p className="text-muted-foreground">View and manage all traffic violation records</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by plate number, ID, or violation type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Challan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Violation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Fine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : paginatedViolations.length > 0 ? (
                  paginatedViolations.map((violation) => (
                    <tr key={violation.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {violation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {violation.plateNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs">
                        <div>{violation.violation}</div>
                        <div className="text-xs text-muted-foreground mt-1">{violation.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                        ₹{violation.fine.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {violation.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={violation.status} size="sm" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-muted-foreground">No violations found matching your search</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredViolations.length)} of{' '}
              {filteredViolations.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
