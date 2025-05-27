'use client';

import Image from 'next/image';
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
    <div className="flex flex-col bg-white relative overflow-hidden min-h-screen animate-pageEnter">
      {/* Floating particles background */}
      <FloatingParticles color="#F5BC1C" count={8} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 relative z-10 w-full max-w-3xl mx-auto text-center animate-cardEntrance hover-lift">
          {/* Logo and title */}
          <div className={`flex justify-center items-center mb-8 transition-all duration-500 ${animatedElements.logo ? 'animate-headerSlide' : 'animate-on-load'}`}>
            <div className="bg-[#F5BC1C] rounded-xl w-14 h-14 flex items-center justify-center mr-3 hover-scale">
              <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-10 h-10" />
            </div>
            <div className="text-[#F5BC1C] text-4xl font-bold">Baatein</div>
          </div>
          
          {/* Success Icon */}
          <div className={`flex justify-center mb-10 transition-all duration-500 ${animatedElements.icon ? 'animate-scaleIn' : 'animate-on-load'}`}>
            <div className="w-20 h-20 relative hover-scale">
              <Image 
                src="/assets/green-tick.png"
                alt="Success"
                width={80}
                height={80}
                className="w-20 h-20 animate-pulse"
              />
            </div>
          </div>
          
          {/* Thank you message */}
          <h1 className={`text-4xl font-bold text-golden-shine mb-4 transition-all duration-500 ${animatedElements.title ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {t('success', 'title')}
          </h1>

          <p className={`text-gray-600 mb-8 transition-all duration-500 ${animatedElements.subtitle ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {t('success', 'message')}
          </p>
          
          {/* App download section */}
          <div className={`mb-8 transition-all duration-500 ${animatedElements.download ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            <h2 className="text-xl font-semibold text-golden-shine mb-6">
              Download the Baatein app on the Play Store today!
            </h2>
            
            <div className="flex mx-auto justify-center space-x-4 stagger-fast">
              <a href="#" className="inline-block  animate-fadeInLeft">
                <img src="/assets/Google Play.png" 
                     alt="Get it on Google Play" 
                     className="h-11 w-[157px]" />
              </a>
              <a href="#" className="inline-block  animate-fadeInRight">
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
            className={`mt-4 px-8 py-3 bg-[#F5BC1C] text-white rounded-lg font-semibold text-lg hover:bg-[#e5ac0f] transition-all duration-300 button-animate ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105'
            } ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
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