'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import WaveBackground from '../components/WaveBackground';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function FacialSuccessPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { userData } = useUserData();
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    title: false,
    image: false,
    successText: false,
    button: false
  });

  // Auto proceed to dashboard after a delay
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, [router]);
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, title: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, image: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, successText: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 800),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleContinue = () => {
    // Route to kyc-upload as the first step in the flow
    router.push('/profile-pic');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden animate-pageEnter">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto animate-cardEntrance">
          <h1 className={`text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-golden-shine mb-8 sm:mb-10 lg:mb-12 transition-all duration-500 ${animatedElements.title ? 'animate-scaleIn' : 'animate-on-load'}`}>
            {t('facialSuccess', 'title')}
          </h1>
          
          {/* Success Image with Green Check */}
          <div className={`relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto mb-8 sm:mb-10 lg:mb-12 transition-all duration-500 ${animatedElements.image ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {/* Container with positioned green checkmark */}
            <div className="relative">
              {/* Green tick image - responsive positioning */}
              <div 
                className="absolute z-20 animate-scaleIn" 
                style={{ 
                  left: 'clamp(-10px, -4%, 10px)', 
                  top: 'clamp(-25px, -15%, -20px)', 
                  filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'
                }}
              >
                <img 
                  src="/assets/green-tick.png" 
                  alt="Success" 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                />
              </div>
              
              {/* Image container - responsive dimensions */}
              <div 
                className="relative rounded-xl sm:rounded-2xl overflow-hidden mx-auto border-2 border-gray-200 w-auto h-auto shadow-md"
                style={{ 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
                }}
              >
                {/* Display captured profile image if available */}
                {userData.capturedPhoto ? (
                  <img 
                    src={userData.capturedPhoto}
                    alt="Captured profile" 
                    className="w-full h-auto object-contain bg-gray-50"
                    style={{ 
                      objectFit: 'contain', 
                      objectPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm sm:text-base lg:text-lg">Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <h2 className={`text-center text-xl sm:text-2xl lg:text-3xl font-medium text-gray-800 mb-8 sm:mb-10 lg:mb-12 px-4 transition-all duration-500 ${animatedElements.successText ? 'animate-contentReveal' : 'animate-on-load'}`}>
            {t('facialSuccess', 'message')}
          </h2>
          
          <button
            onClick={handleContinue}
            className={`w-full bg-[#F5BC1C] text-white font-medium py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 rounded-xl hover:bg-[#e5ac0f] transition-all duration-200 hover-glow text-base sm:text-lg lg:text-xl ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
          >
            {t('facialSuccess', 'continue')}
          </button>
        </div>
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
} 