// app/welcome/page.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../animations.css'; // Import animations

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    gender: 'Female',
    referralCode: ''
  });
  const [animatedFields, setAnimatedFields] = useState({
    name: false,
    phoneNumber: false,
    gender: false,
    referralCode: false
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prevState => ({
      ...prevState,
      gender
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for validation errors (in a real app this would be more comprehensive)
    if (formData.name.length < 3 || formData.phoneNumber.length < 10) {
      setShowErrorModal(true);
      return;
    }
    
    // Add submission animation effect
    const button = document.querySelector('button[type="submit"]');
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => button.classList.remove('animate-pulse'), 1000);
    }
    
    router.push('/earn-multiple');
  };

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-sm" 
            onClick={() => setShowErrorModal(false)}
          ></div>
          
          {/* Error Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-6">
              <div className="flex">
                <div className="w-1/2">
                  <h2 className="text-gray-400 text-[42px] font-bold mb-1">Error 901</h2>
                  <h3 className="text-[#E75A34] text-lg font-medium mb-2">Something went wrong</h3>
                  <p className="text-[#464646] text-sm mb-4">
                    Please check your details and try again. Make sure all fields are filled in correctly.
                  </p>
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-[#E75A34] text-white font-medium py-3 rounded-md transition-colors mt-4"
                  >
                    Try again
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
      
      {/* Main content container */}
      <div className="flex h-full">
        {/* Left side - Form */}
        <div className=" md:w-1/2 px-10 pt-6 pb-0 flex flex-col">
          {/* Logo */}
          <div className="flex items-center mb-4 animate-fadeInDown">
            <div className="bg-[#F5BC1C] w-12 h-12 rounded-xl flex items-center justify-center mr-3 animate-pulse" style={{animationDuration: '3s'}}>
              <Image src="/assets/Baaten Logo 6.png" alt="Baatein Logo" width={32} height={32} />
            </div>
            <span className="text-2xl font-bold text-[#F5BC1C]">Baatein</span>
          </div>
          
          {/* Header */}
          <h1 className="text-2xl font-bold text-[#F5BC1C] mb-1 animate-fadeInUp delay-200">
            Welcome to Baatein Family
          </h1>
          <p className="text-[#2D2D2D] text-sm mb-4 animate-fadeInUp delay-300">Turn your time into income. Start your journey as a Partner.</p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 flex-1 max-w-lg">
            <div className={animatedFields.name ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                Your Name <span className="text-[#F5BC1C]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Riya Sharma"
                className="w-full border border-[#F5BC1C] rounded-lg px-3 py-2"
                required
              />
              <p className="text-xs text-[#AFAFAF] mt-0.5">
                Note: Please enter your name exactly as it appears on your government ID.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <div className={`${animatedFields.phoneNumber ? 'animate-fadeInUp' : 'opacity-0'} w-full md:w-1/2`}>
                <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                  Phone Number <span className="text-[#F5BC1C]">*</span>
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
                    placeholder="Enter your phone Number"
                    className="flex-1 border border-[#F5BC1C] rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              
              <div className={`${animatedFields.gender ? 'animate-fadeInUp' : 'opacity-0'} w-full md:w-1/2`}>
                <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                  Gender <span className="text-[#F5BC1C]">*</span>
                </label>
                <div className="flex gap-2">
                  {['Female', 'Male', 'LGBTQIA'].map((g, index) => (
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
              </div>
            </div>
            
            <div className={animatedFields.referralCode ? 'animate-fadeInUp' : 'opacity-0'}>
              <label className="block text-[#2D2D2D] font-medium text-sm mb-1">
                Referral Code <span className="text-xs text-gray-400 font-normal">(Agency Code)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Abx1232yaf"
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
                  <p className="font-medium text-sm">Baatein App Demo Video</p>
                  <p className="text-xs text-gray-500">
                    See how Baatein works — from profile setup to live calls.
                  </p>
                </div>
              </div>
              
              {/* Privacy Notice */}
              <div className="flex items-center mb-4">
                <Image src="/assets/Cloud Security.png" alt="privacy" width={20} height={20} className="mr-2 animate-pulse" style={{animationDuration: '4s'}} />
                <span className="text-xs text-gray-500">
                  Your data is highly encrypted and never shared with anyone.
                </span>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#F5BC1C] text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Join as a Partner
              </button>
            </div>
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0">
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
      
      {/* Bottom wave */}
      <div className="relative w-full h-36 -mt-12">
        <Image
          src="/assets/wave-bottom.png"
          alt="Wave Bottom"
          fill
          className="object-cover"
          priority
        />
        
        {/* Decorative Circles */}
        <div className="absolute top-[30%] right-[30%] w-2 h-2 rounded-full bg-[#F5BC1C] opacity-80 z-10 animate-floatY" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-[40%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#F5BC1C] opacity-60 z-10 animate-floatY delay-500" style={{animationDuration: '3.5s'}}></div>
        <div className="absolute top-[20%] right-[50%] w-3 h-3 rounded-full bg-[#F5BC1C] opacity-70 z-10 animate-floatY delay-300" style={{animationDuration: '5s'}}></div>
      </div>
    </div>
  );
};

export default RegistrationForm;