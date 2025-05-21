'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../animations.css'; // Import animations
import { useLanguage } from '../context/LanguageContext';
import WaveBackground from '../components/WaveBackground';

const RegistrationForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    gender: 'Female',
    referralCode: ''
  });
  
  // Validation errors for each field
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    gender: ''
  });
  
  const [animatedFields, setAnimatedFields] = useState({
    name: false,
    phoneNumber: false,
    gender: false,
    referralCode: false
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(true); // Show video modal by default
  const [errorMessage, setErrorMessage] = useState("");
  const [showLGBTQErrorModal, setShowLGBTQErrorModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Progressive form field appearance for better UX
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, name: true })), 300),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, phoneNumber: true })), 500),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, gender: true })), 700),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, referralCode: true })), 900),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  // Initialize video playback when modal is shown
  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      videoRef.current.play()
        .catch(e => console.log('Video autoplay prevented:', e));
      setIsVideoPlaying(true);
    }
  }, [showVideoModal]);

  // Handle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Validate each field on change
    validateField(name, value);
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
    
    // Clear gender error when a new gender is selected
    setErrors(prev => ({
      ...prev,
      gender: ''
    }));
    
    // If selecting LGBTQ, validate the name for feminine characteristics
    if (gender === 'LGBTQ' && formData.name.trim() !== '') {
      validateField('name', formData.name);
    }
  };
  
  // Validate a specific field
  const validateField = (fieldName: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
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
        
      case 'phoneNumber':
        const phoneRegex = /^[0-9]{10}$/;
        if (value.trim() === '') {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        } else {
          newErrors.phoneNumber = '';
        }
        break;
    }
    
    setErrors(newErrors);
  };
  
  // Check for LGBTQ Validation(On the basis of name)
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
      validateField('name', formData.name);
      validateField('phoneNumber', formData.phoneNumber);
      
      // Check if we have any errors
      if (errors.name || errors.phoneNumber || formData.name.trim() === '' || formData.phoneNumber.trim() === '') {
        setErrorMessage("Please fix the errors in the form before submitting.");
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Special check for LGBTQ with non-feminine name
      if (formData.gender === 'LGBTQ' && !isFeminineName(formData.name)) {
        setErrorMessage("For LGBTQ selection, please use a feminine name style.");
        setShowLGBTQErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage instead of creating a database record
      if (typeof window !== 'undefined') {
        localStorage.setItem('name', formData.name);
        localStorage.setItem('phoneNumber', formData.phoneNumber);
        localStorage.setItem('gender', formData.gender);
        localStorage.setItem('referralCode', formData.referralCode || '');
      }

      // If gender is Male, show success modal without redirection
      if (formData.gender === 'Male') {
        setShowSuccessModal(true);
        setIsLoading(false);
      } else {
        // For female and LGBTQ gender, proceed to OTP verification
        // Pass the phone number as a query parameter without creating a partner record
        router.push(`/otp-verification?phoneNumber=${formData.phoneNumber}`);
      }
    } catch (error) {
      console.error('Error processing form:', error);
      setErrorMessage("Failed to process the form. Please try again.");
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-opacity-75 backdrop-filter backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          ></div>
          
          {/* Video Modal Content */}
          <div className="relative bg-white w-11/12 max-w-2xl mx-auto z-10 animate-fadeInUp rounded-xl overflow-hidden shadow-2xl">
            {/* Close button */}
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="p-6 pb-8">
              {/* Header content */}
              <div className="text-center mb-6">
                <h2 className="text-[#F5BC1C] text-2xl font-bold mb-1">
                  Welcome to Baatein Family
                </h2>
                <p className="text-gray-700 text-sm">
                  Turn your time into income. Start your journey as a Partner.
                </p>
              </div>
              
              {/* Video container */}
              <div className="relative rounded-lg overflow-hidden w-full aspect-video group">
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                  controls={false}
                  onClick={toggleVideoPlayback}
                >
                  <source src="/assets/baattein-demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Only show pause button on hover when video is playing */}
                {isVideoPlaying && (
                  <button 
                    onClick={toggleVideoPlayback}
                    className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Pause video"
                  >
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Image 
                        src="/assets/pause-button.png" 
                        alt="Pause" 
                        width={64}
                        height={64}
                        priority
                        className="object-contain"
                      />
                    </div>
                  </button>
                )}
                
                {/* Always show play button when video is paused */}
                {!isVideoPlaying && (
                  <button 
                    onClick={toggleVideoPlayback}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    aria-label="Play video"
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generic Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm" 
            onClick={() => setShowErrorModal(false)}
          ></div>
          
          {/* Error Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-6">
              <div className="flex">
                <div className="w-1/2">
                  <h2 className="text-gray-400 text-[42px] font-bold mb-1">{t('errors', 'errorCode')}</h2>
                  <h3 className="text-[#E75A34] text-lg font-medium mb-2">{t('errors', 'errorTitle')}</h3>
                  <p className="text-[#464646] text-sm mb-4">
                    {errorMessage || t('errors', 'errorMessage')}
                  </p>
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-[#E75A34] text-white font-medium py-3 rounded-md transition-colors mt-4"
                  >
                    {t('errors', 'tryAgain')}
                  </button>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                  <Image 
                    src="/assets/error.png" 
                    alt="Error" 
                    width={180} 
                    height={180} 
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* LGBTQ-specific Error Modal */}
      {showLGBTQErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm" 
            onClick={() => setShowLGBTQErrorModal(false)}
          ></div>
          
          {/* Error Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-6">
              <div className="flex">
                <div className="w-1/2">
                  <h2 className="text-gray-400 text-[42px] font-bold mb-1">LGBTQ</h2>
                  <h3 className="text-[#E75A34] text-lg font-medium mb-2">Name Validation</h3>
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
                <div className="w-1/2 flex items-center justify-center">
                  <Image 
                    src="/assets/error.png" 
                    alt="Error" 
                    width={180} 
                    height={180} 
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-opacity-30 backdrop-filter backdrop-blur-sm" 
               onClick={() => setShowSuccessModal(false)}></div>
          
          {/* Success Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md mx-auto z-10 relative animate-fadeInUp" 
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
            
            <div className="p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse" style={{animationDuration: '2s'}}>
                    <Image 
                      src="/assets/Baaten Logo 6.png" 
                      alt="Success" 
                      width={80} 
                      height={80} 
                      className="object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-[#F5BC1C] text-2xl font-bold mb-2">Thank you for getting in touch!</h2>
                <p className="text-[#464646] text-base mb-3">
                  We're already working on it and will get back to you shortly with something great.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content container */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 px-4 md:px-10 pt-6 pb-0 flex flex-col">
          {/* Logo */}
          <div className="flex items-center mb-4 animate-fadeInDown">
            <div className="bg-[#F5BC1C] w-12 h-12 rounded-xl flex items-center justify-center mr-3 animate-pulse" style={{animationDuration: '3s'}}>
              <Image src="/assets/Baaten Logo 6.png" alt="Baatein Logo" width={32} height={32} />
            </div>
            <span className="text-2xl font-bold text-[#F5BC1C]">Baatein</span>
          </div>
          
          {/* Header */}
          <h1 className="text-2xl font-bold text-[#F5BC1C] mb-1 animate-fadeInUp delay-200">
            {t('welcome', 'title')}
          </h1>
          <p className="text-[#2D2D2D] text-sm mb-4 animate-fadeInUp delay-300">{t('welcome', 'subtitle')}</p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 flex-1 max-w-lg">
            <div className={animatedFields.name ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                {t('welcome', 'nameLabel')} <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('welcome', 'namePlaceholder')}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-2`}
                required
              />
              {errors.name ? (
                <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
              ) : (
                <p className="text-xs text-[#AFAFAF] mt-0.5">
                  {formData.gender === 'LGBTQ' ? 'Please use a feminine-style name.' : t('welcome', 'nameNote')}
                </p>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <div className={`${animatedFields.phoneNumber ? 'animate-fadeInUp' : 'opacity-0'} w-full md:w-1/2`}>
                <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                  {t('welcome', 'phoneLabel')} <span className="text-[#F5BC1C]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-16">
                    <input
                      type="text"
                      value="+91"
                      className="w-full border border-[#F5BC1C] rounded-lg px-2 py-2 bg-gray-50"
                      disabled
                    />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={t('welcome', 'phonePlaceholder')}
                    className={`flex-1 border ${errors.phoneNumber ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-2`}
                    required
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.phoneNumber}</p>
                )}
              </div>
              
              <div className={`${animatedFields.gender ? 'animate-fadeInUp' : 'opacity-0'} w-full md:w-1/2`}>
                <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                  {t('welcome', 'genderLabel')} <span className="text-[#F5BC1C]">*</span>
                </label>
                <div className="flex gap-2">
                  {['Female', 'Male', 'LGBTQ'].map((g, index) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => handleGenderSelect(g)}
                      className={`px-3 py-2 rounded-lg border text-xs transition ${
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
            </div>
            
            <div className={animatedFields.referralCode ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                {t('welcome', 'referralLabel')} <span className="text-xs text-gray-400 font-normal">{t('welcome', 'referralSubtext')}</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder={t('welcome', 'referralPlaceholder')}
                className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2"
              />
            </div>
            
            <div className="animate-fadeInUp delay-600">
              {/* Combined Info Section */}
              <div className="flex mb-3 items-start">
                <div className="bg-[#F5BC1C] w-12 h-12 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 animate-pulse" style={{animationDuration: '3s'}}>
                  <img src="/assets/Group 481609.png" alt="Play Icon" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{t('welcome', 'demoTitle')}</p>
                  <p className="text-xs text-gray-500">
                    {t('welcome', 'demoSubtitle')}
                  </p>
                </div>
              </div>
              
              {/* Privacy Notice */}
              <div className="flex items-center mb-4">
                <Image src="/assets/Cloud Security.png" alt="privacy" width={20} height={20} className="mr-2 animate-pulse" style={{animationDuration: '4s'}} />
                <span className="text-xs text-gray-500">
                  {t('welcome', 'privacyNote')}
                </span>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#F5BC1C] text-white font-medium py-2.5 rounded-lg transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/assets/two-girls.png"
              alt="People using Baatein"
              width={600}
              height={600}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
      
      {/* Wave Background */}
      <WaveBackground height={250} />
    </div>
  );
};

export default RegistrationForm;