'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../animations.css'; // Import animations
import { useLanguage } from '../context/LanguageContext';
import { useUserData } from '../context/UserDataContext';
import WaveBackground from '../components/WaveBackground';

const RegistrationForm = () => {
  const { t } = useLanguage();
  const { userData, updateUserData } = useUserData();
  const [formData, setFormData] = useState<{
    profileName: string;
    gender: 'Female' | 'Male' | 'LGBTQ';
    referralCode: string;
  }>({
    profileName: userData.profileName || '',
    gender: userData.gender || 'Female',
    referralCode: userData.referralCode || ''
  });
  
  // Validation errors for each field
  const [errors, setErrors] = useState({
    name: '',
    gender: ''
  });
  
  const [animatedFields, setAnimatedFields] = useState({
    name: false,
    gender: false,
    referralCode: false
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLGBTQErrorModal, setShowLGBTQErrorModal] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoWatchedOnce, setVideoWatchedOnce] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check localStorage for video watch status on component mount
  useEffect(() => {
    const hasWatchedWelcomeVideo = localStorage.getItem('hasWatchedWelcomeVideo');
    if (hasWatchedWelcomeVideo === 'true') {
      setShowVideoModal(false);
      setVideoWatchedOnce(true);
      setHasWatchedVideo(true);
    }
  }, []);

  // Progressive form field appearance for better UX
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, name: true })), 300),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, gender: true })), 500),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, referralCode: true })), 700),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  useEffect(() => {
    setShowVideoModal(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert referral code to uppercase
    const processedValue = name === 'referralCode' ? value.toUpperCase() : value;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: processedValue
    }));
    
    validateField(name, processedValue);
  };

  const handleGenderSelect = (gender: 'Female' | 'Male' | 'LGBTQ') => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
    
    
    setErrors(prev => ({
      ...prev,
      gender: ''
    }));
    
    
    if (gender === 'LGBTQ' && formData.profileName.trim() !== '') {
      validateField('profileName', formData.profileName);
    }
  };
  
  
  const validateField = (fieldName: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (fieldName) {
      case 'profileName':
        if (value.trim() === '') {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
        } else if (formData.gender === 'LGBTQ' && !isFeminineName(value)) {
          newErrors.name = 'For LGBTQ selection, please use a feminine name style';
        } else {
          newErrors.name = '';
        }
        break;
    }
    
    setErrors(newErrors);
  };
  
  
  const isFeminineName = (name: string) => {
    // Enhanced list of feminine name patterns
    const feminineEndings = ['a', 'i', 'e', 'ah', 'ya', 'ia', 'ina', 'ita', 'elle', 'elly', 'ly', 'ey','ora','ine','lyn','is','na'];
    const feminineNames = ['mary', 'sarah', 'emma', 'olivia', 'sophia', 'mia', 'isabella', 'charlotte', 'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'elizabeth', 'mila', 'ella', 'avery', 'sofia', 'camila', 'aria', 'scarlett'];
    
    const lowercaseName = name.toLowerCase().trim();
    
    // Check if the name is in our list of common feminine names
    if (feminineNames.includes(lowercaseName)) {
      return true;
    }
    
    // Check if name ends with feminine endings
    return feminineEndings.some(ending => lowercaseName.endsWith(ending));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate all fields before submission
      validateField('profileName', formData.profileName);
      
      // Check if we have any errors
      if (errors.name || formData.profileName.trim() === '') {
        setErrorMessage("Please fix the errors in the form before submitting.");
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Special check for LGBTQ with non-feminine name
      if (formData.gender === 'LGBTQ' && !isFeminineName(formData.profileName)) {
        setErrorMessage("For LGBTQ selection, please use a feminine name style.");
        setShowLGBTQErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Store user data in context instead of localStorage
      updateUserData({
        profileName: formData.profileName,
        gender: formData.gender as 'Female' | 'Male' | 'LGBTQ',
        referralCode: formData.referralCode
      });

      // If gender is Male, show success modal without redirection
      if (formData.gender === 'Male') {
        setShowSuccessModal(true);
        setIsLoading(false);
      } else {
        // For female and LGBTQ gender, proceed to OTP verification
        router.push(`/otp-verification?phoneNumber=${userData.phoneNumber}`);
      }
    } catch (error) {
      console.error('Error processing form:', error);
      setErrorMessage("Failed to process the form. Please try again.");
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  // Toggle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setHasWatchedVideo(true);
    setVideoWatchedOnce(true);
    // Save to localStorage that user has watched the video
    localStorage.setItem('hasWatchedWelcomeVideo', 'true');
  };

  const handleReplay = () => {
    setHasWatchedVideo(false);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleSkipVideo = () => {
    setShowVideoModal(false);
    // Save to localStorage that user has watched the video (even if skipped)
    localStorage.setItem('hasWatchedWelcomeVideo', 'true');
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col relative">
      {/* Welcome Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred dark overlay */}
          <div className="absolute inset-0 bg-opacity-70 backdrop-blur-sm transition-opacity"></div>
          {/* Popup modal */}
          <div className="relative bg-white/95 w-full max-w-md mx-auto z-10 rounded-2xl shadow-2xl border border-yellow-100 p-0 animate-scaleIn">
            {/* Close button (disabled until watched once) */}
            <button
              onClick={handleSkipVideo}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-700 shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:pointer-events-none z-20"
              disabled={!videoWatchedOnce}
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="flex flex-col items-center px-6 pt-8 pb-6">
              {/* Title & subtitle */}
              <div className="text-center mb-4">
                <h2 className="text-yellow-500 text-2xl font-bold mb-1">Welcome to Baatein</h2>
                <p className="text-gray-700 text-sm">Watch this quick video to get started with Baatein</p>
              </div>
              {/* Video in dark rounded container */}
              <div className="relative rounded-xl overflow-hidden flex justify-center items-center bg-black mb-5 w-full" style={{ height: '70vh', maxHeight: '420px' }}>
                <video
                  ref={videoRef}
                  className="h-full w-auto object-contain bg-black"
                  autoPlay
                  muted={!isSoundEnabled}
                  onEnded={handleVideoEnded}
                >
                  <source src="https://baateinvideos001.blob.core.windows.net/videos/Be%20a%20partner%20without%20music.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Volume Icon Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50">
                  <button
                    className={`relative group bg-white shadow-xl rounded-full p-4 flex items-center justify-center transition hover:bg-yellow-100 focus:outline-none border-2 border-yellow-200
                      ${isSoundEnabled ? 'text-yellow-500 ring-2 ring-yellow-300' : 'text-gray-400 animate-pulse-glow'}
                    `}
                    onClick={() => {
                      setIsSoundEnabled(!isSoundEnabled);
                      if (videoRef.current) {
                        videoRef.current.muted = isSoundEnabled; // toggle
                        videoRef.current.play();
                      }
                    }}
                    aria-label={isSoundEnabled ? 'Mute Sound' : 'Enable Sound'}
                    style={{ outline: 'none', border: 'none', fontSize: 0 }}
                  >
                    {isSoundEnabled ? (
                      // Full volume icon
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.07m2.83-9.9a9 9 0 010 12.73" />
                      </svg>
                    ) : (
                      // Muted icon with slash
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
                        <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
                      {isSoundEnabled ? 'Mute Sound' : 'Enable Sound'}
                    </span>
                  </button>
                </div>
              </div>
              {/* Modal Actions */}
              <div className="flex flex-col items-center gap-3 w-full">
                {!videoWatchedOnce ? (
                  <button
                    className="w-40 py-2 rounded-lg bg-gray-300 text-gray-600 font-semibold cursor-not-allowed opacity-60 text-base"
                    disabled
                  >
                    Watch till end to continue
                  </button>
                ) : (
                  <>
                    <button
                      className="w-40 py-2 rounded-lg bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition text-base"
                      onClick={handleSkipVideo}
                    >
                      Continue
                    </button>
                    <button
                      className="w-40 py-2 rounded-lg bg-white border border-yellow-400 text-yellow-600 font-semibold hover:bg-yellow-50 transition text-base"
                      onClick={handleReplay}
                    >
                      Replay
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generic Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm" 
            onClick={() => setShowErrorModal(false)}
          ></div>
          
          {/* Error Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <h2 className="text-gray-400 text-2xl sm:text-[42px] font-bold mb-1">{t('errors', 'errorCode')}</h2>
                  <h3 className="text-gray-800 text-lg sm:text-xl font-bold mb-2">{t('errors', 'errorTitle')}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                    {errorMessage || t('errors', 'errorMessage')}
                  </p>
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="bg-[#F5BC1C] hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                  >
                    {t('errors', 'tryAgain')}
                  </button>
                </div>
                <div className="w-full sm:w-1/2 flex items-center justify-center">
                  <Image 
                    src="/assets/error.png" 
                    alt="Error" 
                    width={120} 
                    height={120}
                    className="object-contain sm:w-[180px] sm:h-[180px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* LGBTQ-specific Error Modal */}
      {showLGBTQErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm" 
            onClick={() => setShowLGBTQErrorModal(false)}
          ></div>
          
          {/* Error Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <h2 className="text-gray-400 text-2xl sm:text-[42px] font-bold mb-1">LGBTQ</h2>
                  <h3 className="text-[#E75A34] text-base sm:text-lg font-medium mb-2">Name Validation</h3>
                  <p className="text-[#464646] text-sm mb-4">
                    For LGBTQ selection, please use a feminine name style (ending with a, i, e, etc.) or choose a different gender option.
                  </p>
                  <button 
                    onClick={() => setShowLGBTQErrorModal(false)}
                    className="w-full bg-[#E75A34] text-white font-medium py-3 rounded-md transition-colors mt-4"
                  >
                    Change Details
                  </button>
                </div>
                <div className="w-full sm:w-1/2 flex items-center justify-center">
                  <Image 
                    src="/assets/error.png" 
                    alt="Error" 
                    width={120} 
                    height={120}
                    className="object-contain sm:w-[180px] sm:h-[180px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm" 
               onClick={() => setShowSuccessModal(false)}></div>
          
          {/* Success Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto z-10 relative animate-fadeInUp" 
               style={{ boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.1)' }}>
            {/* Close button */}
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="p-6 sm:p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center animate-pulse" style={{animationDuration: '2s'}}>
                    <Image 
                      src="/assets/Baaten Logo 6.png" 
                      alt="Success" 
                      width={60} 
                      height={60}
                      className="object-contain sm:w-[80px] sm:h-[80px]"
                    />
                  </div>
                </div>
                <h2 className="text-[#F5BC1C] text-lg sm:text-2xl font-bold mb-2">Thank you for getting in touch!</h2>
                <p className="text-[#464646] text-sm sm:text-base mb-3">
                  We're already working on it and will get back to you shortly with something great.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content container */}
      <div className="flex flex-col md:flex-row h-full relative">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 px-4 md:px-10 pt-6 pb-16 flex flex-col relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-4 sm:mb-6 animate-fadeInDown">
            <div className="bg-[#F5BC1C] w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center mr-3 animate-pulse" style={{animationDuration: '3s'}}>
              <Image src="/assets/Baaten Logo 6.png" alt="Baatein Logo" width={28} height={28} className="sm:w-8 sm:h-8" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#F5BC1C]">Baatein</span>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-gray-800 transition-all duration-700 animate-fadeInUp opacity-100">
              {t('welcome', 'title')}
            </h1>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full px-4 py-1 font-semibold text-xs shadow-sm flex items-center gap-2 animate-fadeInUp ml-4">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              Details are for User Side
            </div>
          </div>
          <p className="text-[#2D2D2D] text-sm mb-4 sm:mb-6 animate-fadeInUp delay-300">{t('welcome', 'subtitle')}</p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1 max-w-full lg:max-w-lg">
            <div className={animatedFields.name ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                Profile Name <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="profileName"
                value={formData.profileName}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base`}
                required
              />
              {errors.name ? (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              ) : (
                <p className="text-xs text-[#AFAFAF] mt-1">
                  {formData.gender === 'LGBTQ' ? 'Please use a feminine-style name.' : t('welcome', 'nameNote')}
                </p>
              )}
            </div>
            
            <div className={`${animatedFields.gender ? 'animate-fadeInUp' : 'opacity-0'} w-full sm:w-1/2`}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                {t('welcome', 'genderLabel')} <span className="text-[#F5BC1C]">*</span>
              </label>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                {['Female', 'Male', 'LGBTQ'].map((g, index) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleGenderSelect(g as 'Female' | 'Male' | 'LGBTQ')}
                    className={`px-3 py-2 sm:py-3 rounded-lg border text-xs sm:text-sm transition flex-1 min-w-0 ${
                      formData.gender === g
                        ? 'bg-[#F5BC1C] text-white border-[#F5BC1C]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {formData.gender === 'LGBTQ' && (
                <p className="text-xs text-[#F5BC1C] mt-1">
                  <span className="font-bold">Note:</span> LGBTQ selection requires a feminine name
                </p>
              )}
            </div>
            
            <div className={animatedFields.referralCode ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                {t('welcome', 'referralLabel')} <span className="text-xs text-gray-400 font-normal">{t('welcome', 'referralSubtext')}</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder={t('welcome', 'referralPlaceholder')}
                className="w-full border border-[#F5BC1C] rounded-lg px-3 py-3 text-base"
              />
            </div>
            
            <div className="animate-fadeInUp delay-600">
              {/* Combined Info Section */}
              <div className="flex mb-4 items-start">
                <div className="bg-[#F5BC1C] w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 animate-pulse" style={{animationDuration: '3s'}}>
                  <img src="/assets/Group 481609.png" alt="Play Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{t('welcome', 'demoTitle')}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t('welcome', 'demoSubtitle')}
                  </p>
                </div>
              </div>
              
              {/* Privacy Notice */}
              <div className="flex items-center mb-6">
                <Image src="/assets/Cloud Security.png" alt="privacy" width={18} height={18} className="mr-2 animate-pulse sm:w-5 sm:h-5" style={{animationDuration: '4s'}} />
                <span className="text-xs sm:text-sm text-gray-500">
                  {t('welcome', 'privacyNote')}
                </span>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#F5BC1C] text-white font-medium py-3 sm:py-4 rounded-lg transition-colors text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
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
                  t('welcome', 'submitButton')
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden md:block md:w-1/2 relative z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/assets/two-girls.png"
              alt="People using Baatein"
              width={480}
              height={480}
              className="object-contain w-4/5 h-4/5"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Wave Background - Shifted even lower */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-0" style={{ transform: 'translateY(60px)' }}>
        <WaveBackground height={120} />
      </div>
    </div>
  );
};

export default RegistrationForm;