'use client'

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AvatarUploadPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const avatars = [
    '/assets/avatars/image 3.png',
    '/assets/avatars/image.png',
    '/assets/avatars/image (1).png',
    '/assets/avatars/image (2).png',
    '/assets/avatars/image (3).png',
    '/assets/avatars/image (4).png',
    '/assets/avatars/image (5).png',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      setCustomAvatar(imageUrl);
      setSelectedAvatar(null); // Clear any selected predefined avatar
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSwitchToVideo = () => {
    router.push('/video-upload');
  };

  const handleContinue = () => {
    // Here you would typically save the avatar selection
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 relative z-10 w-full max-w-5xl mx-auto">
          {/* Heading */}
          <h1 className="text-center text-4xl font-bold mb-8">
            <span className="text-[#F5BC1C]">Congratulations!</span> You've Chosen the Audio Call<br />
            Option to Grow Your Career!
          </h1>
          
          {/* Avatar Selection */}
          <div className="bg-gray-50 rounded-2xl p-8 mx-auto max-w-3xl mb-8">
            <p className="text-center text-xl text-gray-700 mb-6">Just upload your favourite Avtar</p>
            
            {/* Upload Box */}
            <div className="flex justify-center mb-8">
              <div 
                className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden"
                onClick={handleAvatarClick}
              >
                {customAvatar ? (
                  <img src={customAvatar} alt="Custom Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
            
            {/* Avatar Options */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {avatars.map((avatar, index) => (
                <div 
                  key={index}
                  className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${selectedAvatar === index ? 'border-[#F5BC1C]' : 'border-transparent'}`}
                  onClick={() => {
                    setSelectedAvatar(index);
                    setCustomAvatar(null); // Clear custom avatar when selecting predefined
                  }}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Upload Own Avatar Button */}
            <div className="flex justify-center">
              <button 
                className="text-[#4CAF50] font-medium flex items-center"
                onClick={handleAvatarClick}
              >
                Upload your own Avtar 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Verification Notes */}
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-lg mb-4">Are you okey with this</p>
            
            <div className="flex justify-center mb-4">
              <button 
                className="bg-[#F5BC1C] text-white px-4 py-2 rounded-full flex items-center hover:bg-[#e5ac0f] transition-colors"
                onClick={handleSwitchToVideo}
              >
                Switch to <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg> call
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No <span className="text-[#F5BC1C]">face verification</span> = No verified badge</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No <span className="text-[#F5BC1C]">face verification</span> = Fewer earning opportunities</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No <span className="text-[#F5BC1C]">face verification</span> = No virtual gifts</span>
              </div>
            </div>
            
            {/* Continue Button */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleContinue}
                className={`bg-[#4CAF50] text-white px-6 py-2 rounded-lg font-medium transition-colors ${(selectedAvatar !== null || customAvatar !== null) ? 'hover:bg-[#3d9940]' : 'opacity-50 cursor-not-allowed'}`}
                disabled={selectedAvatar === null && customAvatar === null}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="w-full absolute bottom-0 left-0 right-0">
        <img 
          src="/assets/wave-bottom.png" 
          alt="Wave" 
          className="w-full object-cover h-32"
        />
      </div>
    </div>
  );
} 