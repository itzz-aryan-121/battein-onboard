'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useUserData } from '../context/UserDataContext';
import WaveBackground from '../components/WaveBackground';

const PersonalDetailsForm = () => {
  const { t } = useLanguage();
  const { userData, updateUserData } = useUserData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: userData.name || '',
    city: userData.city || '',
    occupation: userData.occupation || '',
    degree: userData.degree || '',
    phoneNumber: userData.phoneNumber || ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    city: '',
    occupation: '',
    degree: '',
    phoneNumber: ''
  });
  
  const [animatedFields, setAnimatedFields] = useState({
    name: false,
    city: false,
    occupation: false,
    degree: false,
    phoneNumber: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<{ name: string }[]>([]);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Progressive form field appearance
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, name: true })), 300),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, city: true })), 500),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, occupation: true })), 700),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, degree: true })), 900),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, phoneNumber: true })), 1100),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  // Load cities.json on mount
  useEffect(() => {
    fetch('/cities.json')
      .then(res => res.json())
      .then(data => setAllCities(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // City autocomplete logic
  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const value = e.target.value;
    if (value.length >= 2) {
      const matches = allCities
        .filter(cityObj => cityObj.name.toLowerCase().startsWith(value.toLowerCase()))
        .map(cityObj => cityObj.name)
        .slice(0, 8);
      setCitySuggestions(matches);
      setShowCityDropdown(matches.length > 0);
    } else {
      setCitySuggestions([]);
      setShowCityDropdown(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setCitySuggestions([]);
    setShowCityDropdown(false);
    setErrors(prev => ({ ...prev, city: '' }));
    cityInputRef.current?.blur();
  };

  const validateField = (fieldName: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
        if (value.trim() === '') {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          newErrors.name = '';
        }
        break;
        
      case 'city':
        if (value.trim() === '') {
          newErrors.city = 'City is required';
        } else {
          newErrors.city = '';
        }
        break;
        
      case 'occupation':
        if (value.trim() === '') {
          newErrors.occupation = 'Occupation is required';
        } else {
          newErrors.occupation = '';
        }
        break;
        
      case 'degree':
        if (value.trim() === '') {
          newErrors.degree = 'Degree is required';
        } else {
          newErrors.degree = '';
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
    return !newErrors[fieldName as keyof typeof newErrors];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all fields
      const isNameValid = validateField('name', formData.name);
      const isCityValid = validateField('city', formData.city);
      const isOccupationValid = validateField('occupation', formData.occupation);
      const isDegreeValid = validateField('degree', formData.degree);
      const isPhoneValid = validateField('phoneNumber', formData.phoneNumber);

      if (!isNameValid || !isCityValid || !isOccupationValid || !isDegreeValid || !isPhoneValid) {
        setIsLoading(false);
        return;
      }

      // Store partner data in context
      updateUserData({
        name: formData.name,
        city: formData.city,
        occupation: formData.occupation,
        degree: formData.degree,
        phoneNumber: formData.phoneNumber
      });

      // Navigate to welcome page
      router.push('/welcome');
    } catch (error) {
      console.error('Error saving personal details:', error);
      setIsLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '') && 
                     Object.values(errors).every(error => error === '');

  return (
    <div className="bg-white min-h-screen w-full flex flex-col relative">
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5BC1C] mb-1 animate-fadeInUp delay-200">
            Personal Details
          </h1>
          <p className="text-[#2D2D2D] text-sm mb-4 sm:mb-6 animate-fadeInUp delay-300">
            Please fill in your personal details to continue
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1 max-w-full lg:max-w-lg">
            {/* Name Field */}
            <div className={animatedFields.name ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                 Name <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your profile name"
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base`}
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* City Field */}
            <div className={animatedFields.city ? 'animate-fadeInUp' : 'opacity-0'} style={{ position: 'relative', zIndex: 30 }}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                City <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleCityInput}
                placeholder="Enter your city"
                className={`w-full border ${errors.city ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base`}
                required
                autoComplete="off"
                ref={cityInputRef}
                onFocus={() => formData.city.length >= 2 && setShowCityDropdown(citySuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 120)}
              />
              {showCityDropdown && citySuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-yellow-300 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                  {citySuggestions.map((city, idx) => (
                    <li
                      key={city}
                      className="px-4 py-2 cursor-pointer hover:bg-yellow-50 text-sm text-gray-800 transition-colors"
                      onMouseDown={() => handleCitySelect(city)}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            {/* Occupation Field */}
            <div className={animatedFields.occupation ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                Occupation <span className="text-[#F5BC1C]">*</span>
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`w-full border ${errors.occupation ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base bg-white`}
                required
              >
                <option value="">Select your occupation</option>
                <option value="Student">Student</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Professional">Professional</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </select>
              {errors.occupation && (
                <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>
              )}
            </div>

            {/* Degree Field */}
            <div className={animatedFields.degree ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                Education Level <span className="text-[#F5BC1C]">*</span>
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className={`w-full border ${errors.degree ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base bg-white`}
                required
              >
                <option value="">Select your education level</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
              {errors.degree && (
                <p className="text-xs text-red-500 mt-1">{errors.degree}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className={animatedFields.phoneNumber ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-2">
                Phone Number <span className="text-[#F5BC1C]">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-16 sm:w-20">
                  <input
                    type="text"
                    value="+91"
                    className="w-full border border-[#F5BC1C] rounded-lg px-2 py-3 bg-gray-50 text-center text-base"
                    disabled
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`flex-1 border ${errors.phoneNumber ? 'border-red-500' : 'border-[#F5BC1C]'} rounded-lg px-3 py-3 text-base`}
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="animate-fadeInUp delay-600">
              {/* Info Section */}
              <div className="flex mb-4 items-start">
                <div className="bg-[#F5BC1C] w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 animate-pulse" style={{animationDuration: '3s'}}>
                  <Image src="/assets/Cloud Security.png" alt="Security Icon" width={20} height={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Secure & Private</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Your details are encrypted and stored securely
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#F5BC1C] text-white font-medium py-3 sm:py-4 rounded-lg transition-colors text-base ${!isFormValid || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={!isFormValid || isLoading}
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
                  'Continue to Profile Setup'
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
      
      {/* Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-0" style={{ transform: 'translateY(60px)' }}>
        <WaveBackground height={120} />
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
