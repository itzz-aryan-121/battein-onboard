'use client';

import { FiCheck, FiX, FiEye, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { usePartners } from "@/app/hooks/usePartners";
import { usePartnerCounts } from "@/app/context/PartnerCountsContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const StatusBadge = ({ step, isCompleted }: { step: string; isCompleted: boolean }) => (
  <span className={`px-2 py-1 text-xs rounded-full ${
    isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {step}
  </span>
);

const PendingPartnerRow = ({ partner, onApprove, onReject, onDelete }: { 
  partner: any; 
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-medium">{partner?.name?.charAt?.(0) || ''}</span>
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{partner.name}</div>
          <div className="text-sm text-gray-500">{partner.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {partner.phone}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(partner.createdAt).toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex flex-wrap gap-2">
        <StatusBadge step="Phone" isCompleted={partner.isPhoneVerified} />
        <StatusBadge step="KYC" isCompleted={partner.kyc?.verificationStatus === 'Approved'} />
        <StatusBadge step="Bank" isCompleted={partner.bankDetails?.verificationStatus === 'Approved'} />
        <StatusBadge step="Video" isCompleted={partner.media?.verificationStatus === 'Approved'} />
        <StatusBadge step="Face" isCompleted={partner.isFaceVerified} />
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end space-x-3">
        <Link
          href={`/admin/partners/${partner._id}`}
          className="text-purple-600 hover:text-purple-900"
        >
          <FiEye className="h-5 w-5" />
        </Link>
        <button
          onClick={() => onApprove(partner._id)}
          className="text-green-600 hover:text-green-900"
        >
          <FiCheck className="h-5 w-5" />
        </button>
        <button
          onClick={() => onReject(partner._id)}
          className="text-red-600 hover:text-red-900"
        >
          <FiX className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(partner._id)}
          className="text-gray-400 hover:text-red-700"
          title="Delete permanently"
        >
          <FiTrash2 className="h-5 w-5" />
        </button>
      </div>
    </td>
  </tr>
);

export default function PendingPartnersPage() {
  const { refreshCounts } = usePartnerCounts();
  const { partners: initialPartners, loading, error, fetchPartners, updatePartnerStatus } = usePartners(refreshCounts);
  const [partners, setPartners] = useState<any[]>([]);
  useEffect(() => { setPartners(initialPartners); }, [initialPartners]);

  useEffect(() => {
    fetchPartners('Pending');
  }, []);

  const handleApprove = async (partnerId: string) => {
    await updatePartnerStatus(partnerId, 'Approved', undefined, 'Partner application approved');
    setPartners((prev) => prev.filter((p) => p._id !== partnerId));
  };

  const handleReject = async (partnerId: string) => {
    await updatePartnerStatus(partnerId, 'Rejected', undefined, 'Partner application rejected');
    setPartners((prev) => prev.filter((p) => p._id !== partnerId));
  };

  const handleDelete = async (partnerId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this partner? This cannot be undone.')) return;
    const res = await fetch(`/api/partners/${partnerId}`, { method: 'DELETE' });
    if (res.ok) {
      setPartners((prev) => prev.filter((p) => p._id !== partnerId));
      await refreshCounts();
      toast.success('Partner deleted permanently');
    } else {
      toast.error('Failed to delete partner');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">Review and approve partner applications</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Steps
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partners.map((partner) => (
                <PendingPartnerRow 
                  key={partner._id} 
                  partner={partner} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No pending partners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 