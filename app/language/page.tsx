'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface Language {
  value: string;
  label: string;
}

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
     
        const uniqueLanguages = new Set<string>();
        data.forEach((country: any) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang: any) => {
              uniqueLanguages.add(lang.toString());
            });
          }
        });

        const sortedLanguages = Array.from(uniqueLanguages)
          .sort()
          .map(lang => ({
            value: lang.toLowerCase(),
            label: lang
          }));

        setLanguages(sortedLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setLanguages([
          { value: 'english', label: 'English' },
          { value: 'hindi', label: 'Hindi' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
        ]);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (value: React.SetStateAction<string>) => {
    setSelectedLanguage(value);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    localStorage.setItem('preferredLanguage', selectedLanguage.toString());
    router.push('/welcome');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-white flex flex-col items-center justify-between min-h-screen">
      {/* Main content */}
      <div className="w-[964px] h-[36px] top-[148px] left-[130px] max-w-4xl mx-auto flex flex-col items-center justify-center flex-grow px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Begin your soulful journey with <span className="text-[#F5BC1C]">Baatein</span>
        </h1>
        
        <p className="text-3xl md:text-3xl text-center mb-6 font-normal w-[554px] h-[36px]">
          Select your language to proceed
        </p>
        
        {/* Language Dropdown */}
        <div className="w-[510px] mb-6 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-2.5 px-4 border border-[#F5BC1C] rounded-lg flex items-center justify-between bg-white"
          >
            <span>{languages.find(lang => lang.value === selectedLanguage)?.label || 'Select Language'}</span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[140px] overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.value}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => handleLanguageSelect(language.value)}
                >
                  {language.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <button 
          onClick={handleConfirm}
          className="w-[300px] bg-[#F5BC1C] text-white font-medium py-2.5 px-4 rounded-lg mb-3 hover:bg-amber-500 transition-colors"
        >
          Confirm
        </button>
        
        <button 
          onClick={handleCancel}
          className="w-[300px] bg-white text-[#2d2d2d] font-semibold py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-md"
        >
          Cancel
        </button>
      </div>
      
      {/* Illustration and Waves */}
      <div className="w-full relative">
        <div className="flex justify-center mb-0">
          <div className="relative px-4 flex top-[-50px]">
            <img
              src="/assets/people-group.png"
              alt="People using mobile devices"
              className="object-contain w-[600px] h-[280px] relative z-10"
            />
          </div>
        </div>
        
        {/* Wave Background with Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          {/* Decorative Ellipses */}
          <div className="absolute w-full h-full">
            <img
              src="/assets/Ellipse 799.png"
              alt=""
              className="absolute right-[15%] bottom-[30%] w-6 h-6 opacity-80"
            />
            <img
              src="/assets/Ellipse 802.png"
              alt=""
              className="absolute left-[20%] bottom-[30%] w-4 h-4 opacity-60"
            />
            <img
              src="/assets/Ellipse 799.png"
              alt=""
              className="absolute right-[35%] bottom-[30%] w-5 h-5 opacity-70"
            />
            <img
              src="/assets/Ellipse 802.png"
              alt=""
              className="absolute left-[40%] bottom-[30%] w-3 h-3 opacity-50"
            />
            <img
              src="/assets/Ellipse 799.png"
              alt=""
              className="absolute right-[25%] bottom-[30%] w-4 h-4 opacity-60"
            />
          </div>

          <div className="relative h-[400px]">
            {/* Wave Background - Three Layers */}
            <div className="absolute bottom-0 w-full">
              <img
                src="/assets/wave-top.png"
                alt="Top Wave"
                className="w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 w-full">
              <img
                src="/assets/wave-middle.png"
                alt="Middle Wave"
                className="w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 w-full">
              <img
                src="/assets/wave-bottom.png"
                alt="Bottom Wave"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}