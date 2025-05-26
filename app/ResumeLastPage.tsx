"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContinueOrFreshModal from './components/ContinueOrFreshModal';
import { useUserData } from './context/UserDataContext';

export default function ResumeLastPage() {
  const router = useRouter();
  const { clearUserData } = useUserData();
  const [showModal, setShowModal] = useState(false);
  const [lastPage, setLastPage] = useState<string | null>(null);

  useEffect(() => {
    const last = localStorage.getItem('lastVisitedPage');
    if (last && window.location.pathname === '/') {
      setLastPage(last);
      setShowModal(true);
    }
  }, []);

  const handleContinue = () => {
    if (lastPage) {
      setShowModal(false);
      router.replace(lastPage);
    }
  };

  const handleStartFresh = () => {
    // Clear all data using the context
    clearUserData();
    // Also clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    setShowModal(false);
    router.replace('/');
  };

  return (
    <ContinueOrFreshModal
      open={showModal}
      onContinue={handleContinue}
      onStartFresh={handleStartFresh}
    />
  );
} 