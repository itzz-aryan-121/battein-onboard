'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import WaveBackground from '../components/WaveBackground';

export default function FacialSuccessPage() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Load captured photo from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhoto = localStorage.getItem('capturedPhoto');
      if (storedPhoto) {
        setCapturedPhoto(storedPhoto);
      }
    }
  }, []);

  // Auto proceed to dashboard after a delay
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 500);

    // const redirectTimer = setTimeout(() => {
    //   router.push('/dashboard');
    // }, 3000);

    return () => {
      clearTimeout(animationTimer);
      
    };
  }, [router]);

  const handleContinue = () => {
    // Route to kyc-upload as the first step in the flow
    router.push('/kyc-upload');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className={`bg-white rounded-3xl shadow-lg p-8 relative z-10 w-full max-w-xl mx-auto ${showAnimation ? 'animate-scaleIn' : ''}`}>
          <h1 className="text-center text-5xl font-bold text-[#F5BC1C] mb-10">
            Well Done!
          </h1>
          
          {/* Success Image with Green Check */}
          <div className="relative max-w-md mx-auto mb-8">
            {/* Container with positioned green checkmark */}
            <div className="relative">
              {/* Green tick image - positioned exactly like in screenshot */}
              <div 
                className="absolute z-20" 
                style={{ 
                  left: '40px', 
                  top: '-20px', 
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
                }}
              >
                <img 
                  src="/assets/green-tick.png" 
                  alt="Success" 
                  width={44} 
                  height={44}
                />
              </div>
              
              {/* Image container */}
              <div 
                className="relative rounded-xl overflow-hidden mx-auto border border-gray-100" 
                style={{ 
                  width: '300px', 
                  height: '190px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)' 
                }}
              >
                {/* Display captured profile image if available */}
                {capturedPhoto && (
                  <img 
                    src={capturedPhoto}
                    alt="Captured profile" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-medium text-gray-800 mb-10">
            Facial authentication successful
          </h2>
          
          <button
            onClick={handleContinue}
            className="w-full bg-[#F5BC1C] text-white font-medium py-4 px-6 rounded-lg hover:bg-[#e5ac0f] transition-colors"
          >
            Continue to KYC Verification
          </button>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
} 