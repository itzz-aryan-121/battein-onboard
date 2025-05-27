'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import Image from 'next/image';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function BaateinEarningsPage() {
  const { t } = useLanguage();
  const { userData, updateUserData } = useUserData();
  const [selectedOption, setSelectedOption] = useState<'audio' | 'video' | null>(userData.earningPreference);
  const [showMoneyImage, setShowMoneyImage] = useState(false);
  const videoColumnRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    subheading: false,
    instruction: false,
    sectionTitle: false,
    audioCard: false,
    videoCard: false,
    button: false
  });
  
  // Progressive animation timing like welcome page
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, subheading: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, instruction: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, sectionTitle: true })), 800),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, audioCard: true })), 1000),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, videoCard: true })), 1200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 1400),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);
  
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
    // Check if user has completed the welcome and partner-details steps
    if (!userData.name || !userData.phoneNumber || userData.spokenLanguages.length === 0) {
      router.push('/welcome'); // Redirect to start if basic data is missing
    }
  }, [router, userData]);
  
  const handleAudioSelect = () => {
    setSelectedOption('audio');
    setError(null); // Clear any previous errors
  };
  
  const handleVideoSelect = () => {
    setSelectedOption('video');
    setError(null); // Clear any previous errors
  };
  
  const handleContinue = async () => {
    if (!selectedOption) {
      setError('Please select an earning option to continue');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Save earning preference to context
      updateUserData({ earningPreference: selectedOption });

      // Navigate based on selection
      if (selectedOption === 'audio') {
        router.push('/profile-pic');
      } else {
        router.push('/video-upload');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to save selection');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden animate-pageEnter">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mx-auto py-4">
        <div className="bg-white rounded-xl md:rounded-3xl shadow-lg p-3 sm:p-4 lg:p-6 relative z-10 w-full max-w-6xl mx-auto animate-cardEntrance">
          {/* Heading */}
          <h1 className={`text-center text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
            {t('earnMultiple', 'title')}
          </h1>
          
          {/* Subheading */}
          <div className={`text-center mb-2 md:mb-3 max-w-3xl mx-auto text-xs sm:text-sm transition-all duration-500 ${animatedElements.subheading ? 'animate-contentReveal' : 'animate-on-load'}`}>
            {t('earnMultiple', 'subtitle')}
          </div>

          {/* Clear Instruction Banner */}
          <div className={`bg-gradient-to-r from-[#FFF8E0] to-[#FFF4CC] border-2 border-[#FDC62B] rounded-xl p-3 mb-3 md:mb-4 mx-auto max-w-4xl transition-all duration-500 ${animatedElements.instruction ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            <div className="flex items-center justify-center mb-1">
              <div className="bg-[#FDC62B] rounded-full p-1.5 mr-2 animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Choose Your Earning Method</h3>
            </div>
            <p className="text-center text-gray-700 text-xs md:text-sm">
              <span className="font-semibold">👆 {t('earnMultiple', 'selectPreferences')}</span>
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-3 p-3 bg-red-100 border-2 border-red-400 text-red-700 rounded-xl animate-shakeX text-center max-w-md mx-auto">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {/* Two Columns - Stack on mobile, side by side on tablet+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative mb-4">
            {/* Center Divider Line - Only visible on lg and up */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#FDC62B] to-transparent"></div>
            
            {/* Left Column - Audio Calling */}
            <div
              onClick={() => handleAudioSelect()}
              className={`p-4 rounded-2xl relative transition-all duration-500 cursor-pointer border-3 ${
                selectedOption === 'audio'
                  ? 'border-[#F5BC1C] bg-gradient-to-br from-[#FFF9E9] to-[#FFFBF0] shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-[#F5BC1C] hover:shadow-md'
              } ${animatedElements.audioCard ? 'animate-fadeInLeft' : 'animate-on-load'}`}
            >
              {/* Selection Indicator */}
              {selectedOption === 'audio' && (
                <div className="absolute top-3 right-3 bg-[#FDC62B] rounded-full p-1.5 animate-scaleIn">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              <div className="flex items-center mb-3">
                <div className="p-2 rounded-xl bg-white shadow-md hover-scale">
                  <Image src="/assets/Voice.png" alt="Audio Icon" width={48} height={36} className="h-8 w-12 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{t('earnMultiple', 'voiceCalls')}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{t('earnMultiple', 'voiceCallsDesc')}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl py-2 text-center font-bold mb-3 text-sm md:text-base shadow-sm">
                Earn <span className='text-[#FDC62B] text-base md:text-lg'>₹20,000-₹30,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-fast">
                <div className="animate-fadeInUp">
                  <h4 className="font-bold mb-2 text-xs md:text-sm text-green-600 flex items-center">
                    <span className="mr-1">✅</span> Pros:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>₹2/min paid calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>₹1/min free calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>No face verification</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>Easy to start</span>
                    </li>
                  </ul>
                </div>
                <div className="animate-fadeInUp">
                  <h4 className="font-bold mb-2 text-xs md:text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span> Cons:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-1 font-bold">•</span>
                      <span>No virtual gifts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-1 font-bold">•</span>
                      <span>Lower earnings</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Click to Select Hint */}
              {selectedOption !== 'audio' && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    👆 Click to select
                  </span>
                </div>
              )}
            </div>
            
            {/* Right Column - Video Calling */}
            <div 
              ref={videoColumnRef}
              className={`p-4 rounded-2xl transition-all duration-500 cursor-pointer border-3 ${
                selectedOption === 'video'
                  ? 'border-[#F5BC1C] bg-gradient-to-br from-[#FFF9E9] to-[#FFFBF0] shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white hover:border-[#F5BC1C] hover:shadow-md'
              } ${animatedElements.videoCard ? 'animate-fadeInRight' : 'animate-on-load'}`}
              onClick={() => handleVideoSelect()}
            >
              {/* Selection Indicator */}
              {selectedOption === 'video' && (
                <div className="absolute top-3 right-3 bg-[#FDC62B] rounded-full p-1.5 animate-scaleIn">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              <div className="flex items-center mb-3">
                <div className="p-2 rounded-xl bg-white shadow-md hover-scale">
                  <Image src="/assets/Video.png" alt="Video Icon" width={48} height={36} className="h-8 w-12 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{t('earnMultiple', 'videoCalls')}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{t('earnMultiple', 'videoCallsDesc')}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl py-2 text-center font-bold mb-3 text-sm md:text-base shadow-sm">
                Earn <span className='text-[#FDC62B] text-base md:text-lg'>₹60,000-₹1,00,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-fast">
                <div className="animate-fadeInUp">
                  <h4 className="font-bold mb-2 text-xs md:text-sm text-green-600 flex items-center">
                    <span className="mr-1">✅</span> Pros:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>₹9/min video calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>Virtual gifts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>Higher engagement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-1 font-bold">•</span>
                      <span>Earn more faster</span>
                    </li>
                  </ul>
                </div>
                <div className="animate-fadeInUp">
                  <h4 className="font-bold mb-2 text-xs md:text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span> Cons:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-1 font-bold">•</span>
                      <span>Needs good camera</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Click to Select Hint */}
              {selectedOption !== 'video' && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    👆 Click to select
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Selection Status */}
          <div className="text-center mb-3">
            {selectedOption ? (
              <div className="inline-flex items-center bg-green-100 border border-green-300 rounded-xl px-3 py-1.5 animate-fadeInUp">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-green-700 font-medium text-sm">
                  {selectedOption === 'audio' ? t('earnMultiple', 'voiceCalls') : t('earnMultiple', 'videoCalls')} selected
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center bg-yellow-100 border border-yellow-300 rounded-xl px-3 py-1.5 animate-pulse">
                <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-yellow-700 font-medium text-sm">Please select an earning option above</span>
              </div>
            )}
          </div>
          
          {/* Proceed Button */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleContinue}
              disabled={!selectedOption || isLoading}
              className={`px-6 py-3 flex transition-all font-bold rounded-xl text-base ${
                selectedOption && !isLoading 
                  ? 'bg-[#FDC62B] text-white cursor-pointer hover:bg-[#f0b600] transform hover:scale-105 shadow-lg hover-glow' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              } button-animate ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  {t('common', 'loading')}
                </span>
              ) : selectedOption ? (
                <>
                  <span>Start Earning with {selectedOption === 'audio' ? t('earnMultiple', 'voiceCalls') : t('earnMultiple', 'videoCalls')}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </>
              ) : (
                t('earnMultiple', 'continue')
              )}
            </button>
            
            {!selectedOption && (
              <p className="text-xs text-gray-500 mt-1 animate-pulse">
                👆 Choose Audio or Video calling above to proceed
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
}