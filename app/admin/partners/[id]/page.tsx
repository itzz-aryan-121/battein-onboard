// app/admin/partners/[id]/page.tsx
import Image from 'next/image';
import { FiCheck, FiX, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { PartnerApprovalActions } from './PartnerApprovalActions';

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
    <div className="space-y-4">{children}</div>
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/${id}`, {
    cache: 'no-store', // Optional: Ensure fresh data
  });
  const partner: Partner = await response.json();

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
          <div><strong>Status:</strong> <StatusBadge status={partner.status || '-'} /></div>
          <div className="mt-2">
            <PartnerApprovalActions partner={partner} />
          </div>
        </Section>
      </div>
    </div>
  );
}
