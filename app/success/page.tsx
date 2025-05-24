'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingParticles from '../components/FloatingParticles';
import WaveBackground from '../components/WaveBackground';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Clear all user-related state
    localStorage.clear();
    sessionStorage.clear();
  }, []);
  
  const handleGoHome = async () => {
    setIsLoading(true);
    try {
      await router.push('/');
    } catch (error) {
      console.error('Error navigating to home:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white relative overflow-hidden min-h-screen">
      {/* Floating particles background */}
      <FloatingParticles color="#F5BC1C" count={8} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 relative z-10 w-full max-w-3xl mx-auto text-center">
          {/* Logo and title */}
          <div className="flex justify-center items-center mb-8">
            <div className="bg-[#F5BC1C] rounded-xl w-14 h-14 flex items-center justify-center mr-3">
              <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-10 h-10" />
            </div>
            <div className="text-[#F5BC1C] text-4xl font-bold">Baatein</div>
          </div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 relative">
              <Image 
                src="/assets/green-tick.png"
                alt="Success"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
          </div>
          
          {/* Thank you message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Thanks for joining the <span className="text-[#F5BC1C]">Baatein</span> app
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            we're excited to have you on this journey!
          </p>
          
          {/* App download section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Download the Baatein app on the Play Store today!
            </h2>
            
            <div className="flex mx-auto justify-center space-x-4 ">
              <a href="#" className="inline-block">
                <img src="/assets/Google Play.png" 
                     alt="Get it on Google Play" 
                     className="h-11 w-[157px]" />
              </a>
              <a href="#" className="inline-block">
                <img src="/assets/App Store.png" 
                     alt="Download on the App Store" 
                     className="h-11 w-[157px]" />
              </a>
            </div>
          </div>

          {/* Go to Home button */}
          <button
            onClick={handleGoHome}
            disabled={isLoading}
            className={`mt-4 px-8 py-3 bg-[#F5BC1C] text-white rounded-lg font-semibold text-lg hover:bg-[#e5ac0f] transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Go to Home'
            )}
          </button>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={150} />
    </div>
  );
} 