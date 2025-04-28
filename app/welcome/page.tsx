// app/welcome/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '../animations.css'; // Import our animations
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import default styles
import { useRouter } from 'next/navigation';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    spokenLanguage: '',
    gender: 'Female',
    referralCode: ''
  });
  const [animatedFields, setAnimatedFields] = useState({
    dateOfBirth: false,
    spokenLanguage: false,
    gender: false,
    referralCode: false
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [languageSuggestions] = useState([
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Bengali', 'Russian', 'Portuguese', 'Arabic', 'Urdu', 'Japanese', 'Punjabi', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Assamese', 'Maithili', 'Santali', 'Kashmiri', 'Nepali', 'Sinhala', 'Burmese', 'Thai', 'Vietnamese', 'Korean', 'Italian', 'Turkish', 'Dutch', 'Greek', 'Polish', 'Romanian', 'Hungarian', 'Czech', 'Swedish', 'Finnish', 'Norwegian', 'Danish', 'Hebrew', 'Persian', 'Pashto', 'Malay', 'Indonesian', 'Filipino', 'Swahili', 'Zulu', 'Afrikaans'
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const languageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Progressive form field appearance for better UX
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, dateOfBirth: true })), 300),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, spokenLanguage: true })), 500),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, gender: true })), 700),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, referralCode: true })), 900),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      spokenLanguage: value
    }));
    if (value.length > 0) {
      const filtered = languageSuggestions.filter(lang =>
        lang.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prevState => ({
      ...prevState,
      spokenLanguage: suggestion
    }));
    setShowSuggestions(false);
    languageInputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    // Update formData with formatted dateOfBirth
    const formattedDOB = dateOfBirth ? `${dateOfBirth.getDate().toString().padStart(2, '0')}/${(dateOfBirth.getMonth()+1).toString().padStart(2, '0')}/${dateOfBirth.getFullYear()}` : '';
    setFormData(prev => ({ ...prev, dateOfBirth: formattedDOB }));
    // Add submission animation effect
    const button = document.querySelector('button[type="submit"]');
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => button.classList.remove('animate-pulse'), 1000);
    }
    router.push('/earn-multiple');
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
  };

  return (
    <div className="bg-white flex flex-col min-h-screen relative overflow-x-hidden pb-40">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start justify-between px-6 pt-12 pb-0 relative z-10">
        {/* Left: Form */}
        <div className="w-[964px] md:w-[54%] animate-fadeInLeft">
          {/* Logo and Heading */}
          <div className="flex items-center mb-2 animate-fadeInDown">
            <Image src="/assets/Baaten Logo 6.png" alt="Baatein Logo" width={56} height={56} className="animate-pulse" style={{animationDuration: '3s'}} />
            <span className="ml-3 text-[40px] font-bold text-[#F5BC1C]">Baatein</span>
          </div>
          <h1 className="text-[32px] font-bold text-[#F5BC1C] mb-2 relative w-fit animate-fadeInUp delay-200">
            Welcome to Baatein Family
          </h1>
          <p className="text-[#2D2D2D] text-lg mb-8 animate-fadeInUp delay-300">Turn your time into income. Start your journey as a Partner.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Date of Birth <span className="text-[#F5BC1C]">*</span>
              </label>
              <DatePicker
                selected={dateOfBirth}
                onChange={date => setDateOfBirth(date)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                placeholderText="Select your date of birth"
                className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] transition-all hover-lift"
                calendarClassName="!rounded-xl !border-[#F5BC1C] !shadow-lg !bg-white"
              />
            </div>
            <div className={animatedFields.spokenLanguage ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Spoken Language <span className="text-[#F5BC1C]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="spokenLanguage"
                  value={formData.spokenLanguage}
                  onChange={handleLanguageChange}
                  onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
                  ref={languageInputRef}
                  placeholder="Enter Your Spoken Language"
                  className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] transition-all hover-lift"
                  required
                />
                {showSuggestions && (
                  <ul className="absolute left-0 right-0 bg-white border border-[#F5BC1C] rounded-lg shadow-lg mt-1 z-50 max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, idx) => (
                      <li
                        key={suggestion}
                        className="px-4 py-2 cursor-pointer hover:bg-[#FFF7E0]"
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className={animatedFields.gender ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Gender <span className="text-[#F5BC1C]">*</span>
              </label>
              <div className="flex gap-2">
                {['Female', 'Male', 'LGBTQIA'].map((g, index) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenderSelect(g)}
                    className={`px-4 py-2 rounded-lg border text-md font-medium transition-all hover-scale ${
                      formData.gender === g
                        ? 'bg-[#F5BC1C] text-white border-[#F5BC1C]'
                        : 'bg-white text-[#F5BC1C] border-[#F5BC1C]'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className={animatedFields.referralCode ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium mb-1">
                Referral Code <span className="text-sm text-[#AFAFAF] font-normal">(Agency Code)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Abx1232yaf"
                className="w-full border border-[#F5BC1C] rounded-lg px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F5BC1C] transition-all hover-lift"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#484848] mt-2 animate-fadeInUp delay-700">
              <Image src="/assets/Cloud Security.png" alt="privacy" width={30} height={28} className="animate-pulse" style={{animationDuration: '4s'}} />
              <span className='ml-2'>
                Your data is highly encrypted and never shared with anyone. Your privacy is our top priority.
              </span>
            </div>
            <button
              type="submit"
              className="w-[373px] mx-auto flex justify-center bg-[#F5BC1C] text-white font-semibold text-lg py-3 rounded-lg mt-2 hover:bg-[#e5ac0f] transition animate-fadeInUp delay-700 button-animate"
            >
              Join as a Partner
            </button>
          </form>
        </div>
        {/* Right: Illustration and Ellipses */}
        <div className="hidden md:flex flex-1 items-end justify-end relative min-h-[600px] z-50">
          {/* Floating ellipses */}
          <Image src="/assets/Ellipse 799.png" alt="" width={18} height={18} className="absolute right-10 top-10 animate-floatY" />
          <Image src="/assets/Ellipse 802.png" alt="" width={10} height={10} className="absolute right-32 top-24 animate-floatY delay-700" />
          <Image src="/assets/Ellipse 799.png" alt="" width={14} height={14} className="absolute right-20 top-1/2 animate-floatY delay-500" />
          {/* Illustration */}
          <Image
            src="/assets/long man stand.png"
            alt="Baatein User"
            width={447}
            height={891}
            className="z-50 -mb-10 animate-fadeInRight animate-floatY"
            style={{animationDuration: '6s'}}
            priority
          />
        </div>
      </div>
      {/* Bottom Wave and Ellipses */}
      <div className="absolute left-0 right-0 bottom-0 w-full pointer-events-none z-0">
        <div className="relative w-full h-[220px]">
          {/* Layered Waves */}
          <Image
            src="/assets/wave-bottom.png"
            alt="Wave Bottom"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-10 animate-waveMove"
            style={{animationDuration: '22s'}}
            priority
          />
          <Image
            src="/assets/wave-middle.png"
            alt="Wave Middle"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-20 animate-waveMove"
            style={{animationDuration: '16s', animationDelay: '0.3s'}}
            priority
          />
          <Image
            src="/assets/wave-top.png"
            alt="Wave Top"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-30 animate-waveMove"
            style={{animationDuration: '10s', animationDelay: '0.6s'}}
            priority
          />
          <Image
            src="/assets/wave tangled.png"
            alt="Wave Tangled"
            fill
            className="object-cover w-full h-full absolute left-0 bottom-0 z-40 animate-waveMove"
            style={{animationDuration: '18s', animationDelay: '0.2s'}}
            priority
          />

          {/* Floating ellipses on wave */}
          <Image
            src="/assets/Ellipse 799.png"
            alt=""
            width={32}
            height={32}
            className="absolute left-[12%] bottom-6 z-50 animate-floatY"
            style={{animationDuration: '4s'}}
          />
          <Image
            src="/assets/Ellipse 802.png"
            alt=""
            width={18}
            height={18}
            className="absolute left-[40%] bottom-10 z-50 animate-floatY delay-500"
            style={{animationDuration: '3.5s'}}
          />
          <Image
            src="/assets/Ellipse 799.png"
            alt=""
            width={24}
            height={24}
            className="absolute right-[18%] bottom-8 z-50 animate-floatY delay-300"
            style={{animationDuration: '5s'}}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;