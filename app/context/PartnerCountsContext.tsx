import React, { createContext, useContext, useState, useCallback } from 'react';

interface PartnerCounts {
  pending: number;
  approved: number;
  rejected: number;
}

interface PartnerCountsContextType {
  counts: PartnerCounts;
  refreshCounts: () => Promise<void>;
}

const PartnerCountsContext = createContext<PartnerCountsContextType | undefined>(undefined);

export const PartnerCountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [counts, setCounts] = useState<PartnerCounts>({ pending: 0, approved: 0, rejected: 0 });

  const refreshCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/partners/counts');
      if (res.ok) {
        const data = await res.json();
        setCounts(data);
      }
    } catch (err) {
      // Optionally handle error
    }
  }, []);

  React.useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  return (
    <PartnerCountsContext.Provider value={{ counts, refreshCounts }}>
      {children}
    </PartnerCountsContext.Provider>
  );
};

export const usePartnerCounts = () => {
  const ctx = useContext(PartnerCountsContext);
  if (!ctx) throw new Error('usePartnerCounts must be used within a PartnerCountsProvider');
  return ctx;
}; 