'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

export default function VideoUploadPage() {
  const router = useRouter();

  const handleOpenCamera = () => {
    // Navigate to the camera verification page
    router.push('/camera-verification');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 relative z-10 w-full max-w-5xl mx-auto">
          {/* Heading */}
          <h1 className="text-center text-4xl font-bold mb-4">
            <span className="text-[#F5BC1C]">Congratulations!</span>
          </h1>

          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
            You've unlocked the Video Call feature to elevate your career journey.
          </h2>
          
          {/* Pro Tip */}
          <p className="text-center mb-8">
            <span className="font-semibold text-[#F5BC1C]">Pro Tip:</span> Partners using video calls earn up to <span className="font-bold">₹60,000 - ₹1,00,000/month!</span>
          </p>
          
          {/* Upload Instructions */}
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <p className="text-xl mb-6">
              Upload your <span className="text-[#F5BC1C] font-medium">real photo</span> to unlock video call access
            </p>
            
            <button 
              onClick={handleOpenCamera}
              className="bg-[#4CAF50] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#3d9940] transition-colors mb-10 button-animate"
            >
              Click here for open Camera
            </button>
            
            <p className="text-gray-600 mb-10">
              Make sure your profile video, lighting, and background are set up to create<br />
              a professional and welcoming experience.
            </p>
          </div>
          
          {/* Why You Need to Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto">
            <h3 className="text-center font-bold text-xl mb-4">Why You Need to Upload a Real Picture</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real image builds trust and shows you're genuine</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified profiles attract more calls</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Used for verification tag and KYC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
} 