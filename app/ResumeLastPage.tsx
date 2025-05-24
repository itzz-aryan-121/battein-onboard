"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContinueOrFreshModal from './components/ContinueOrFreshModal';

export default function ResumeLastPage() {
  const router = useRouter();
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