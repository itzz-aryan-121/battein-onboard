'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function VideoUploadPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    content: false,
    instructions: false,
    benefits: false,
    button: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, content: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, instructions: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, benefits: true })), 800),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 1000),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleOpenCamera = async () => {
    setIsLoading(true);
    try {
      // Navigate to the camera verification page
      await router.push('/camera-verification');
    } catch (error) {
      console.error('Error navigating to camera:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/video-upload');
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden py-2 sm:py-3 md:py-4 px-4">
      <Head>
        <title>Video Upload - Complete Your Profile</title>
        <meta name="description" content="Upload your verification video to complete your profile" />
      </Head>

      <main className="w-full max-w-5xl z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-auto border border-[#f5bc1c0a]">
          
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 transition-all duration-700 ${animatedElements.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <span className="text-[#F5BC1C]">{t('videoUpload', 'congratulations')} 🎉</span>
            </h1>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 transition-all duration-700 delay-200 ${animatedElements.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              {t('videoUpload', 'title')}
            </h2>
          </div>

          {/* Single Column Vertical Layout */}
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            
            {/* Pro Tip Section */}
            <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 lg:p-6 border border-amber-200 transition-all duration-700 delay-300 ${animatedElements.content ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
              <p className="text-center text-sm sm:text-base lg:text-lg">
                <span className="font-semibold text-[#F5BC1C] flex items-center justify-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  {t('videoUpload', 'proTip')}
                </span> 
                <span className="text-gray-700">{t('videoUpload', 'earningPotential')}</span>
              </p>
            </div>
            
            {/* Upload Instructions Section */}
            <div className={`text-center transition-all duration-700 delay-400 ${animatedElements.instructions ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <p className="text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {t('videoUpload', 'uploadInstruction')}
              </p>
              
              <button 
                onClick={handleOpenCamera}
                disabled={isLoading}
                className={`bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white font-bold px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg lg:text-xl
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:from-[#45a049] hover:to-[#3d8b40]'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Opening Camera...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    {t('videoUpload', 'openCamera')}
                  </span>
                )}
              </button>
              
              <p className="text-gray-500 text-sm mt-4 px-2 max-w-2xl mx-auto">
                {t('videoUpload', 'setupNote')}
              </p>
            </div>

            {/* Benefits Section */}
            <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-200 transition-all duration-700 delay-500 ${animatedElements.benefits ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-center font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-green-800 flex items-center justify-center gap-2">
                <span className="text-xl">🎯</span>
                {t('videoUpload', 'whyUploadTitle')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-3 animate-fadeInLeft delay-600">
                  <div className="w-5 h-5 mt-0.5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">{t('videoUpload', 'buildsTrust')}</span>
                </div>
                
                <div className="flex items-start gap-3 animate-fadeInLeft delay-700">
                  <div className="w-5 h-5 mt-0.5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">{t('videoUpload', 'attractsCalls')}</span>
                </div>
                
                <div className="flex items-start gap-3 animate-fadeInLeft delay-800 sm:col-span-2 lg:col-span-1 sm:justify-center lg:justify-start">
                  <div className="w-5 h-5 mt-0.5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">{t('videoUpload', 'verificationKyc')}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      
      {/* Wave Background Component */}
      <WaveBackground height={100} />
    </div>
  );
} 