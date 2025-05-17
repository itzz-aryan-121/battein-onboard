import { useState, useEffect } from 'react';
import { PartnerType } from '../models/Partner';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsePartnersReturn {
  partners: PartnerType[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData;
  fetchPartners: (status?: string, page?: number) => Promise<void>;
  updatePartnerStatus: (
    partnerId: string,
    status: string,
    section?: string,
    note?: string
  ) => Promise<void>;
}

export function usePartners(refreshCounts?: () => Promise<void>): UsePartnersReturn {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchPartners = async (status = 'all', page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/partners?status=${status}&page=${page}&limit=${pagination.limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data.partners);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerStatus = async (
    partnerId: string,
    status: string,
    section?: string,
    note?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          section,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update partner status');
      }

      // Refresh the partners list
      await fetchPartners();
      // Refresh badge counts if provided
      if (refreshCounts) await refreshCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    error,
    pagination,
    fetchPartners,
    updatePartnerStatus,
  };
} 