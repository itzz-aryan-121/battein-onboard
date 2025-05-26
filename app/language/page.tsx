// app/language/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import '../animations.css'; 
import { useLanguage } from '../context/LanguageContext';
import { LocaleKey } from '../locales';
import WaveBackground from '../components/WaveBackground';

interface Language {
  value: LocaleKey;
  label: string;
}

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState<LocaleKey | ''>('');
  const { setLanguage, t } = useLanguage();
  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' }
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as LocaleKey);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (selectedLanguage) {
        // Update context and localStorage
        setLanguage(selectedLanguage);
        router.push('/welcome');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/language');
  }, []);

  return (
    <div className="bg-white flex flex-col items-center justify-between min-h-screen overflow-hidden">
      {/* Main content - with responsive padding and spacing */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-center mb-3 sm:mb-4 lg:mb-6 animate-fadeInDown px-4">
          {selectedLanguage ? t('language', 'title') : "Begin your soulful journey with"} <span className="text-[#F5BC1C]">Baatein</span>
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-center mb-6 sm:mb-8 lg:mb-10 font-normal delay-200 px-4 max-w-2xl">
          {selectedLanguage ? t('language', 'selectLanguage') : "Select your language to proceed"}
        </p>
        
        {/* Language Dropdown - responsive width and better mobile touch */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] mb-6 sm:mb-8 relative delay-300">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="w-full py-3 sm:py-3.5 lg:py-4 px-4 sm:px-5 border-2 border-[#F5BC1C] rounded-lg bg-white appearance-none cursor-pointer text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] focus:ring-opacity-50 transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              <option value="" disabled>Select Language</option>
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4">
              <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Buttons - Only show after language selection with responsive width */}
        {selectedLanguage && (
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] bg-[#F5BC1C] text-white font-semibold py-3 sm:py-3.5 lg:py-4 px-6 rounded-lg hover:bg-amber-500 transition-all duration-200 animate-fadeInUp delay-400 text-base sm:text-lg min-h-[48px] touch-manipulation ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-sm sm:text-base">Processing...</span>
              </span>
            ) : (
              t('language', 'confirm')
            )}
          </button>
        )}
      </div>
      
      {/* Illustration and Waves - with responsive adjustments */}
      <div className="relative w-full flex-grow flex flex-col justify-end mt-4 sm:mt-6 lg:mt-8">
        {/* People illustration - responsive sizing */}
        <div className="flex justify-center relative z-50 bottom-0 px-4" style={{ pointerEvents: 'none' }}>
          <img
            src="/assets/people-group.png"
            alt="People using mobile devices"
            className="object-contain w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px] xl:max-w-[750px] h-auto"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        
        {/* Wave Background Component with responsive height */}
        <WaveBackground height={100} />
        
        {/* Decorative Ellipses - responsive positioning and sizing */}
        <div className="absolute w-full h-[100px] sm:h-[120px] lg:h-[150px] bottom-0 left-0 z-40 pointer-events-none">
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[15%] bottom-[25%] w-3 sm:w-4 lg:w-5 xl:w-6 h-3 sm:h-4 lg:h-5 xl:h-6 opacity-80 animate-floatY"
          />
          <img
            src="/assets/Ellipse 802.png"
            alt=""
            className="absolute left-[20%] bottom-[25%] w-2.5 sm:w-3 lg:w-3.5 xl:w-4 h-2.5 sm:h-3 lg:h-3.5 xl:h-4 opacity-60 animate-floatY delay-200"
          />
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[35%] bottom-[25%] w-3 sm:w-3.5 lg:w-4 xl:w-5 h-3 sm:h-3.5 lg:h-4 xl:h-5 opacity-70 animate-floatY delay-400"
          />
          <img
            src="/assets/Ellipse 802.png"
            alt=""
            className="absolute left-[40%] bottom-[25%] w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 opacity-50 animate-floatY delay-300"
          />
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[25%] bottom-[25%] w-2.5 sm:w-3 lg:w-3.5 xl:w-4 h-2.5 sm:h-3 lg:h-3.5 xl:h-4 opacity-60 animate-floatY delay-100"
          />
        </div>
      </div>
    </div>
  );
}