interface StatusBadgeProps {
  status: 'pending_review' | 'issued' | 'contested' | 'paid' | 'invalidated' | 'rejected';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = {
    pending_review: 'bg-amber-100 text-amber-800 border-amber-200',
    issued: 'bg-blue-100 text-blue-800 border-blue-200',
    contested: 'bg-purple-100 text-purple-800 border-purple-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    invalidated: 'bg-slate-100 text-slate-500 border-slate-200 line-through',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const labels = {
    pending_review: 'Pending Review',
    issued: 'Issued',
    contested: 'Contested',
    paid: 'Paid',
    invalidated: 'Invalidated',
    rejected: 'Rejected',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full border font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
