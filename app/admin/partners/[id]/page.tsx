'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiCheck, FiX, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { usePartnerCounts } from '@/app/context/PartnerCountsContext';

interface Partner {
  _id: string;
  spokenLanguage?: string;
  hobbies?: string[];
  bio?: string;
  audioIntro?: string;
  panNumber?: string;
  panCardFile?: string;
  bankAccountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
  cancelCheque?: string;
  capturedPhoto?: string;
  createdAt?: string;
  status?: string;
  kyc?: {
    panNumber?: string;
    panCardFile?: string;
  };
  bankDetails?: {
    bankAccountNumber?: string;
    accountHolderName?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
    cancelCheque?: string;
  };
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { refreshCounts } = usePartnerCounts();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState<'Approved' | 'Rejected' | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await fetch(`/api/partners/${params.id}`);
        const data = await response.json();
        setPartner(data);
      } catch (error) {
        console.error('Error fetching partner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/partners?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationStatus: newStatus,
          ...(newStatus === 'Rejected' && { rejectionReason }),
          ...(newStatus === 'Approved' && { approvedAt: new Date() }),
        }),
      });

      if (response.ok) {
        router.refresh();
        if (newStatus === 'Rejected') {
          setShowRejectionModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating partner status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5BC1C]"></div>
          <p className="mt-4 text-gray-500">Loading partner details...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Partner not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Partner Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Personal Details">
          <div className="space-y-2">
            <div><strong>Spoken Language:</strong> {partner.spokenLanguage || '-'}</div>
            <div><strong>Hobbies:</strong> {partner.hobbies?.join(', ') || '-'}</div>
            <div><strong>Bio:</strong> {partner.bio || '-'}</div>
            {partner.audioIntro && (
              <div>
                <strong>Audio Intro:</strong>
                <audio controls src={partner.audioIntro} className="mt-2" />
              </div>
            )}
          </div>
        </Section>
        <Section title="KYC Details">
          <div className="space-y-2">
            <div><strong>PAN Number:</strong> {partner.kyc?.panNumber || '-'}</div>
            {partner.kyc?.panCardFile && (
              <div>
                <strong>PAN Card:</strong>
                <a href={partner.kyc.panCardFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">View</a>
              </div>
            )}
          </div>
        </Section>
        <Section title="Bank Details">
          <div className="space-y-2">
            <div><strong>Account Number:</strong> {partner.bankDetails?.bankAccountNumber || '-'}</div>
            <div><strong>Account Holder Name:</strong> {partner.bankDetails?.accountHolderName || '-'}</div>
            <div><strong>IFSC Code:</strong> {partner.bankDetails?.ifscCode || '-'}</div>
            <div><strong>Branch Name:</strong> {partner.bankDetails?.branchName || '-'}</div>
            <div><strong>UPI ID:</strong> {partner.bankDetails?.upiId || '-'}</div>
            {partner.bankDetails?.cancelCheque && (
              <div>
                <strong>Cancel Cheque:</strong>
                <a href={partner.bankDetails.cancelCheque} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">View</a>
              </div>
            )}
          </div>
        </Section>
        <Section title="Camera Verification">
          <div className="space-y-2">
            {partner.capturedPhoto ? (
              <img src={partner.capturedPhoto} alt="Captured Photo" className="w-48 h-48 object-cover rounded-lg" />
            ) : (
              <div>No photo captured</div>
            )}
          </div>
        </Section>
        <Section title="Approval Status">
          <div><strong>Status:</strong> {partner.status || '-'}</div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={async () => {
                setStatusLoading('Approved');
                const res = await fetch(`/api/partners/${partner._id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'Approved' })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setPartner(updated);
                  toast.success('Partner approved!');
                  await refreshCounts();
                  router.push('/admin/partners/active');
                }
                setStatusLoading(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={partner.status === 'Approved' || statusLoading === 'Approved'}
            >
              {statusLoading === 'Approved' ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={async () => {
                setStatusLoading('Rejected');
                const res = await fetch(`/api/partners/${partner._id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'Rejected' })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setPartner(updated);
                  toast.success('Partner rejected!');
                  await refreshCounts();
                  router.push('/admin/partners/rejected');
                }
                setStatusLoading(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={partner.status === 'Rejected' || statusLoading === 'Rejected'}
            >
              {statusLoading === 'Rejected' ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
} 