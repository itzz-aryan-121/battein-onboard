"use client";

import { FiEye } from "react-icons/fi";
import Link from "next/link";
import { usePartners } from "@/app/hooks/usePartners";
import { usePartnerCounts } from "@/app/context/PartnerCountsContext";
import { useEffect } from "react";

const ActivePartnerRow = ({ partner }: { partner: any }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">{partner.name}</td>
    <td className="px-6 py-4 whitespace-nowrap">{partner.email}</td>
    <td className="px-6 py-4 whitespace-nowrap">{partner.phone}</td>
    <td className="px-6 py-4 whitespace-nowrap">{new Date(partner.createdAt).toLocaleString()}</td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link href={`/admin/partners/${partner._id}`} className="text-green-600 hover:text-green-900">
        <FiEye className="h-5 w-5" />
      </Link>
    </td>
  </tr>
);

export default function ActivePartnersPage() {
  const { refreshCounts } = usePartnerCounts();
  const { partners, loading, error, fetchPartners } = usePartners(refreshCounts);

  useEffect(() => {
    fetchPartners('Approved');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Active Partners</h1>
          <p className="mt-1 text-sm text-gray-500">All approved partners</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partners.map((partner) => (
                <ActivePartnerRow key={partner._id} partner={partner} />
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No active partners found
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