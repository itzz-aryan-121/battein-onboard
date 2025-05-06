'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
            onClick={() => router.push('/kyc-upload')}
            className="w-full bg-[#F5BC1C] text-white font-medium py-4 px-6 rounded-lg hover:bg-[#e5ac0f] transition-colors"
          >
            Proceeding to the next step
          </button>
        </div>
      </div>
      
      {/* Bottom Waves - Layered for complete effect */}
      <div className="w-full absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '180px' }}>
        {/* Background layer - main wave */}
        <img 
          src="/assets/wave-bottom-yellow.png" 
          alt="Wave" 
          className="w-full absolute bottom-0 left-0 right-0 object-cover"
          style={{ height: '180px' }}
        />
        
        {/* Middle layer wave for depth */}
        <div className="absolute bottom-0 left-0 right-0" style={{ opacity: 0.4, transform: 'translateY(-40px)' }}>
          <img 
            src="/assets/wave-middle.png" 
            alt="Wave Middle" 
            className="w-full object-cover"
            style={{ height: '100px' }}
          />
        </div>
        
        {/* Top layer - decorative elements */}
        <div className="absolute bottom-0 w-full">
          <div className="absolute left-[10%] bottom-[40px]">
            <div className="bg-[#F5BC1C] opacity-20 rounded-full" style={{ width: '30px', height: '30px' }}></div>
          </div>
          <div className="absolute right-[15%] bottom-[80px]">
            <div className="bg-[#F5BC1C] opacity-30 rounded-full" style={{ width: '20px', height: '20px' }}></div>
          </div>
          <div className="absolute left-[30%] bottom-[60px]">
            <div className="bg-[#F5BC1C] opacity-25 rounded-full" style={{ width: '15px', height: '15px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 