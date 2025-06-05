'use client';

import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import FloatingParticles from '../components/FloatingParticles';
import WaveBackground from '../components/WaveBackground';
import { useEffect, useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function SuccessPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { clearUserData } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    logo: false,
    icon: false,
    title: false,
    subtitle: false,
    download: false,
    button: false
  });
  
  // Progressive animation timing for celebration effect
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, logo: true })), 300),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, icon: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, title: true })), 900),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, subtitle: true })), 1200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, download: true })), 1500),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 1800),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);
  
  useEffect(() => {
    // Clear all user-related state after successful submission
    clearUserData();
    // Also clear any remaining localStorage items
    localStorage.clear();
    sessionStorage.clear();
  }, [clearUserData]);
  
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
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden py-4 sm:py-6 md:py-8 px-4">
      <Head>
        <title>Success - Registration Complete!</title>
        <meta name="description" content="Congratulations! Your registration has been completed successfully." />
      </Head>

      {/* Floating particles background */}
      <FloatingParticles color="#F5BC1C" count={8} />
      
      <main className="w-full max-w-4xl z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto border border-[#f5bc1c0a]">
          
          {/* Single Column Vertical Layout */}
          <div className="max-w-3xl mx-auto text-center space-y-6 lg:space-y-8">
            
            {/* Logo and Brand */}
            <div className={`flex justify-center items-center mb-6 sm:mb-8 transition-all duration-700 ${animatedElements.logo ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-[#F5BC1C] rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mr-3 shadow-lg">
                <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="text-[#F5BC1C] text-2xl sm:text-3xl lg:text-4xl font-bold">Baatein</div>
            </div>
            
            {/* Success Icon */}
            <div className={`flex justify-center mb-6 transition-all duration-700 delay-300 ${animatedElements.icon ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                <Image 
                  src="/assets/green-tick.png"
                  alt="Success"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse"
                />
              </div>
            </div>
            
            {/* Thanks message */}
            <div className={`transition-all duration-700 delay-500 ${animatedElements.title ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">
                Thanks for joining the <span className="text-[#F5BC1C]">Baatein</span> app
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                we're excited to have you on this journey!
              </p>
            </div>
            
            {/* App Download Section */}
            <div className={`transition-all duration-700 delay-700 ${animatedElements.download ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8">
                Download the Baatein app on the Play Store today!
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <a href="https://play.google.com/store/apps/details?id=com.software.baatein&hl=en_IN" className="inline-block transition-all duration-300 hover:scale-105">
                  <img src="/assets/Google Play.png" 
                       alt="Get it on Google Play" 
                      className="h-11 w-[155px]" />
                </a>
                <a href="#" className="inline-block transition-all duration-300 hover:scale-105">
                  <img src="/assets/App Store.png" 
                       alt="Download on the App Store" 
                      className="h-11 w-[155px]" />
                </a>
              </div>
            </div>
            
            {/* Go to Home button */}
            <div className={`flex justify-center transition-all duration-700 delay-900 ${animatedElements.button ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={handleGoHome}
                disabled={isLoading}
                className={`px-8 py-3 bg-[#F5BC1C] text-white rounded-lg font-semibold text-lg hover:bg-[#e5ac0f] transition-all duration-300 flex justify-center items-center ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105'
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
          
        </div>
      </main>
      
      {/* Wave Background Component */}
      <WaveBackground height={120} />
    </div>
  );
} 