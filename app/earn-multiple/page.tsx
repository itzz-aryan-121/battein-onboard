'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import Image from 'next/image';

export default function BaateinEarningsPage() {
  const [selectedOption, setSelectedOption] = useState<'audio' | 'video' | null>(null);
  const [showMoneyImage, setShowMoneyImage] = useState(false);
  const videoColumnRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle scroll to show/hide money image
  useEffect(() => {
    const handleScroll = () => {
      if (videoColumnRef.current) {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 100) { // Show after scrolling a bit
          setShowMoneyImage(true);
        } else {
          setShowMoneyImage(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const partnerId = localStorage.getItem('partnerId');
    if (!partnerId) {
      router.push('/profile-pic'); // Redirect to start of flow if missing
    }
  }, [router]);
  
  const handleAudioSelect = () => {
    setSelectedOption('audio');
  };
  
  const handleVideoSelect = () => {
    setSelectedOption('video');
  };
  
  const handleContinue = async () => {
    if (!selectedOption) return;

    try {
      setIsLoading(true);
      const partnerId = localStorage.getItem('partnerId');
      if (!partnerId) {
        throw new Error('Partner ID not found');
      }

      // Save to local storage
      const partnerDetails = JSON.parse(localStorage.getItem('partnerDetails') || '{}');
      partnerDetails.earningPreference = selectedOption;
      localStorage.setItem('partnerDetails', JSON.stringify(partnerDetails));

      // Update partner in DB
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ earningPreference: selectedOption })
      });

      if (!response.ok) {
        throw new Error('Failed to save selection');
      }

      // Navigate based on selection
      if (selectedOption === 'audio') {
        router.push('/profile-pic');
      } else {
        router.push('/video-upload');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to save selection');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mx-auto pt-6 py-5 mt-10 md:mt-20">
        <div className="bg-white rounded-xl md:rounded-3xl shadow-lg p-4 sm:p-6 relative z-10 w-full max-w-6xl mx-auto h-auto md:h-[600px] overflow-y-auto">
          {/* Heading */}
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            <span className="text-[#FDC62B]">Earn</span> <span className="text-gray-800">Through Multiple Features</span>
          </h1>
          
          {/* Subheading */}
          <div className="text-center mb-6 md:mb-8 max-w-3xl mx-auto text-sm sm:text-base">
            <span className="font-semibold">Baatein</span> offers <span className="font-semibold">multiple earning opportunities</span> — connect with users through voice, chat, or video 
            calls, and receive virtual gifts as a token of appreciation. Start earning on your terms today.
          </div>
          
          {/* Section Title */}
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 md:mb-8">Enable Your Earning Options</h2>
          
          {/* Two Columns - Stack on mobile, side by side on tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 relative">
            {/* Center Divider Line - Only visible on md and up */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-[#FDC62B]"></div>
            
            {/* Left Column - Audio Calling */}
            <div 
              className={`md:pr-6 p-4 rounded-lg relative transition-all duration-300 cursor-pointer border md:border-0 ${
                selectedOption === 'audio' 
                  ? 'bg-[#FFF8E0] border-[#FDC62B]' 
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={handleAudioSelect}
            >
              <div className="flex items-center mb-4 md:mb-6">
                <div className="p-2 md:p-3 rounded-lg">
                  <Image src="/assets/Voice.png" alt="Audio Icon" width={64} height={48} className="h-10 w-14 md:h-12 md:w-16 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg md:text-xl font-bold">Audio Calling</h3>
                  <p className="text-xs md:text-sm text-gray-600">Earn by talking to users on voice calls</p>
                </div>
              </div>
              
              <div className="rounded-lg py-2 md:py-3 text-center font-bold mb-4 md:mb-6 text-sm md:text-base">
                Earn <span className='text-black'>₹20,000-₹30,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Pros:</h4>
                  <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹2/min when a paid user calls you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹1/min when a free user calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>No face verification required</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Easy to start and use</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Cons:</h4>
                  <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>No virtual gift support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Lower earnings compared to video calls</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right Column - Video Calling */}
            <div 
              ref={videoColumnRef}
              className={`md:pl-6 p-4 rounded-lg transition-all duration-300 cursor-pointer mt-4 md:mt-0 border md:border-0 relative ${
                selectedOption === 'video' 
                  ? 'bg-[#FFF8E0] border-[#FDC62B]' 
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={handleVideoSelect}
            >
              <div className="flex items-center mb-4 md:mb-6">
                <div className="p-2 md:p-3 rounded-lg">
                  <Image src="/assets/Video.png" alt="Video Icon" width={64} height={48} className="h-10 w-14 md:h-12 md:w-16 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg md:text-xl font-bold">Video Calling</h3>
                  <p className="text-xs md:text-sm text-gray-600">Earn more through video calls and gifts</p>
                </div>
              </div>
              
              <div className="rounded-lg py-2 md:py-3 text-center font-bold mb-4 md:mb-6 text-sm md:text-base">
                Earn <span className='text-black'>₹60,000-₹1,00,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Pros:</h4>
                  <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹9/min for every video call</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Get virtual gifts from users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Higher engagement and visibility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Great way to earn more in less time</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Cons:</h4>
                  <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Requires good internet and camera quality</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Person with money image - Position fixed to bottom right of video column */}
              <div className={`md:block absolute -bottom-14 right-0 z-20 w-[110px] md:w-[140px] transition-opacity duration-300 ${showMoneyImage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Image src="/assets/user money.png" alt="Person with money" width={140} height={140} className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
          
          {/* Proceed Button */}
          <div className="flex justify-center mt-6 md:mt-8">
            <button 
              onClick={handleContinue}
              disabled={!selectedOption || isLoading}
              className={`p-2 md:p-3 px-4 md:px-6 flex transition-all font-medium rounded-lg md:rounded-xl text-sm md:text-base ${
                selectedOption && !isLoading ? 'bg-[#FDC62B] cursor-pointer hover:bg-[#f0b600] transform hover:scale-105' : 'bg-gray-300 cursor-not-allowed opacity-50'
              } button-animate`}
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
                'Start Earning'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
}