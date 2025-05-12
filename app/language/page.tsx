// app/language/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import '../animations.css'; 
import { useLanguage } from '../context/LanguageContext';
import { LocaleKey } from '../locales';

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as LocaleKey);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      // Update context and localStorage
      setLanguage(selectedLanguage);
      router.push('/welcome');
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-between h-screen overflow-hidden">
      {/* Main content - reduced vertical space */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center pt-16 pb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 animate-fadeInDown">
          {selectedLanguage ? t('language', 'title') : "Begin your soulful journey with"} <span className="text-[#F5BC1C]">Baatein</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-center mb-4 font-normal delay-200">
          {selectedLanguage ? t('language', 'selectLanguage') : "Select your language to proceed"}
        </p>
        
        {/* Language Dropdown - using native select */}
        <div className="w-[400px] mb-4 relative delay-300">
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
        
        {/* Buttons - Only show after language selection */}
        {selectedLanguage && (
          <button 
            onClick={handleConfirm}
            className="w-[300px] bg-[#F5BC1C] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-amber-500 transition-colors animate-fadeInUp delay-400"
          >
            {t('language', 'confirm')}
          </button>
        )}
      </div>
      
      {/* Illustration and Waves - positioned closer to content */}
      <div className="relative w-full flex-grow flex flex-col justify-end">
        {/* People illustration - higher z-index and larger */}
        <div className="flex justify-center relative z-50 bottom-0" style={{ pointerEvents: 'none' }}>
          <img
            src="/assets/people-group.png"
            alt="People using mobile devices"
            className="object-contain w-full max-w-[800px] h-auto"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        {/* Waves - lower z-index */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-10 pointer-events-none">
          <div className="relative w-full h-[180px]">
            <img src="/assets/wave-bottom.png" className="absolute w-full h-full left-0 bottom-0 object-cover z-10" />
            <img src="/assets/wave-middle.png" className="absolute w-full h-full left-0 bottom-0 object-cover z-20" />
            <img src="/assets/wave-top.png" className="absolute w-full h-full left-0 bottom-0 object-cover z-30" />
            {/* Decorative Ellipses */}
            <div className="absolute w-full h-full">
              <img
                src="/assets/Ellipse 799.png"
                alt=""
                className="absolute right-[15%] bottom-[30%] w-6 h-6 opacity-80 animate-floatY"
              />
              <img
                src="/assets/Ellipse 802.png"
                alt=""
                className="absolute left-[20%] bottom-[30%] w-4 h-4 opacity-60 animate-floatY delay-200"
              />
              <img
                src="/assets/Ellipse 799.png"
                alt=""
                className="absolute right-[35%] bottom-[30%] w-5 h-5 opacity-70 animate-floatY delay-400"
              />
              <img
                src="/assets/Ellipse 802.png"
                alt=""
                className="absolute left-[40%] bottom-[30%] w-3 h-3 opacity-50 animate-floatY delay-300"
              />
              <img
                src="/assets/Ellipse 799.png"
                alt=""
                className="absolute right-[25%] bottom-[30%] w-4 h-4 opacity-60 animate-floatY delay-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}