"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumeLastPage() {
  const router = useRouter();

  useEffect(() => {
    const last = localStorage.getItem('lastVisitedPage');
    if (last && window.location.pathname === '/') {
      router.replace(last);
    }
  }, [router]);

  return null;
} 