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
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center pt-8 sm:pt-12 md:pt-16 pb-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-4 animate-fadeInDown">
          {selectedLanguage ? t('language', 'title') : "Begin your soulful journey with"} <span className="text-[#F5BC1C]">Baatein</span>
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-center mb-3 sm:mb-4 font-normal delay-200">
          {selectedLanguage ? t('language', 'selectLanguage') : "Select your language to proceed"}
        </p>
        
        {/* Language Dropdown - responsive width */}
        <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mb-4 relative delay-300">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="w-full py-2.5 px-4 border border-[#F5BC1C] rounded-lg bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Language</option>
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Buttons - Only show after language selection with responsive width */}
        {selectedLanguage && (
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] bg-[#F5BC1C] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-amber-500 transition-colors animate-fadeInUp delay-400 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
      <div className="relative w-full flex-grow flex flex-col justify-end mt-4 sm:mt-6">
        {/* People illustration - responsive sizing */}
        <div className="flex justify-center relative z-50 bottom-0" style={{ pointerEvents: 'none' }}>
          <img
            src="/assets/people-group.png"
            alt="People using mobile devices"
            className="object-contain w-full max-w-[280px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] h-auto"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        
        {/* Wave Background Component with responsive height */}
        <WaveBackground height={120} />
        
        {/* Decorative Ellipses - responsive positioning */}
        <div className="absolute w-full h-[120px] sm:h-[150px] md:h-[180px] bottom-0 left-0 z-40 pointer-events-none">
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[15%] bottom-[30%] w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 opacity-80 animate-floatY"
          />
          <img
            src="/assets/Ellipse 802.png"
            alt=""
            className="absolute left-[20%] bottom-[30%] w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 opacity-60 animate-floatY delay-200"
          />
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[35%] bottom-[30%] w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 opacity-70 animate-floatY delay-400"
          />
          <img
            src="/assets/Ellipse 802.png"
            alt=""
            className="absolute left-[40%] bottom-[30%] w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 opacity-50 animate-floatY delay-300"
          />
          <img
            src="/assets/Ellipse 799.png"
            alt=""
            className="absolute right-[25%] bottom-[30%] w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 opacity-60 animate-floatY delay-100"
          />
        </div>
      </div>
    </div>
  );
}