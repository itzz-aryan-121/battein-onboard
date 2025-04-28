// components/PageTransition.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // When the path changes, start animation
    setIsAnimating(true);
    
    // After animation completes, update the children
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, 300); // Duration should match the CSS animation

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className={`page-transition ${isAnimating ? 'page-exit' : 'page-enter'}`}>
      {displayChildren}
      <style jsx>{`
        .page-transition {
          width: 100%;
          min-height: 100vh;
        }
        .page-enter {
          animation: fadeIn 0.5s ease forwards;
        }
        .page-exit {
          animation: fadeOut 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}