'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiCheck, FiX, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Partner {
  _id: string;
  spokenLanguage?: string;
  hobbies?: string[];
  bio?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  createdAt?: string;
  status?: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(status !== 'all' && { status }),
        ...(search && { search })
      });

      const response = await fetch(`/api/partners?${params}`);
      const data = await response.json();

      setPartners(data.partners);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page, status, search]);

  const handleStatusChange = async (partnerId: string, newStatus: string) => {
    try {
      console.log('Attempting to update status...');
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus === 'Approved' ? 'Approved' : newStatus === 'Rejected' ? 'Rejected' : status);
        fetchPartners();
        console.log('Status updated, showing toast...');
        toast.success(
          newStatus === 'Approved' ? 'Partner approved!' : 'Partner rejected!'
        );
      } else {
        toast.error('Failed to update partner status.');
      }
    } catch (error) {
      toast.error('Error updating partner status.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
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
    <div className="space-y-6">
      <button onClick={() => toast.success('Test toast!')} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded button-animate">Show Toast</button>
      {/* Tab Bar for Partner Status */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setStatus('all')}
          className={`px-4 py-2 rounded ${status === 'all' ? 'bg-[#F5BC1C] text-white font-bold' : 'bg-gray-100 text-gray-700'} button-animate`}
        >
          All
        </button>
        <button
          onClick={() => setStatus('Approved')}
          className={`px-4 py-2 rounded ${status === 'Approved' ? 'bg-[#F5BC1C] text-white font-bold' : 'bg-gray-100 text-gray-700'} button-animate`}
        >
          Active
        </button>
        <button
          onClick={() => setStatus('Rejected')}
          className={`px-4 py-2 rounded ${status === 'Rejected' ? 'bg-[#F5BC1C] text-white font-bold' : 'bg-gray-100 text-gray-700'} button-animate`}
        >
          Rejected
        </button>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Partner Applications</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search partners..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] focus:border-transparent button-animate"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] focus:border-transparent button-animate"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spoken Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hobbies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAN Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No partners found</td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.spokenLanguage || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.hobbies?.join(', ') || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.bio || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.panNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.bankAccountNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{partner.status || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/partners/${partner._id}`} className="text-[#F5BC1C] hover:text-[#F5BC1C]/80 button-animate">
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleStatusChange(partner._id, 'Approved')}
                        className="ml-2 text-green-600 hover:text-green-700 button-animate"
                        disabled={partner.status === 'Approved'}
                        title="Approve"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(partner._id, 'Rejected')}
                        className="ml-2 text-red-600 hover:text-red-700 button-animate"
                        disabled={partner.status === 'Rejected'}
                        title="Reject"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed button-animate"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed button-animate"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed button-animate"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed button-animate"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 