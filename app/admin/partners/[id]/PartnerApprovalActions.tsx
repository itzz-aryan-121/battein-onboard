'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePartnerCounts } from '@/app/context/PartnerCountsContext';

interface Partner {
  _id: string;
  status?: string;
}

interface PartnerApprovalActionsProps {
  partner: Partner;
}

export function PartnerApprovalActions({ partner }: PartnerApprovalActionsProps) {
  const router = useRouter();
  const { refreshCounts } = usePartnerCounts();
  const [statusLoading, setStatusLoading] = useState<'Approved' | 'Rejected' | null>(null);

  const handleStatusChange = async (newStatus: 'Approved' | 'Rejected') => {
    try {
      setStatusLoading(newStatus);
      const res = await fetch(`/api/partners/${partner._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        const updated = await res.json();
        toast.success(`Partner ${newStatus.toLowerCase()}!`);
        await refreshCounts();
        router.push(`/admin/partners/${newStatus.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast.error('Failed to update partner status');
    } finally {
      setStatusLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusChange('Approved')}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={partner.status === 'Approved' || statusLoading === 'Approved'}
      >
        {statusLoading === 'Approved' ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={() => handleStatusChange('Rejected')}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={partner.status === 'Rejected' || statusLoading === 'Rejected'}
      >
        {statusLoading === 'Rejected' ? 'Rejecting...' : 'Reject'}
      </button>
    </div>
  );
} 