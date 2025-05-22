'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

export default function BaateinEarningsPage() {
  const [selectedOption, setSelectedOption] = useState<'audio' | 'video' | null>(null); // Default to no selection
  const router = useRouter();
  
  const handleAudioSelect = () => {
    setSelectedOption('audio');
  };
  
  const handleVideoSelect = () => {
    setSelectedOption('video');
  };
  
  const handleContinue = () => {
    if (selectedOption === 'audio') {
      router.push('/avatar-upload');
    } else if (selectedOption === 'video') {
      router.push('/video-upload');
    }
  };
  
  return (
    <div className="flex flex-col bg-white h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mx-auto pt-6 py-5 mt-20 ">
        <div className="bg-white rounded-3xl shadow-lg p-6 relative z-10 w-full max-w-6xl mx-auto bottom-3 h-[600px]">
          {/* Heading */}
          <h1 className="text-center text-4xl font-bold mb-6">
            <span className="text-[#FDC62B]">Earn</span> <span className="text-gray-800">Through Multiple Features</span>
          </h1>
          
          {/* Subheading */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <span className="font-semibold">Baatein</span> offers <span className="font-semibold">multiple earning opportunities</span> — connect with users through voice, chat, or video 
            calls, and receive virtual gifts as a token of appreciation. Start earning on your terms today.
          </div>
          
          {/* Section Title */}
          <h2 className="text-center text-2xl font-bold mb-8">Enable Your Earning Options</h2>
          
          {/* Two Columns */}
          <div className="grid md:grid-cols-2 gap-0 relative">
            {/* Center Divider Line */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-[#FDC62B]"></div>
            
            {/* Left Column - Audio Calling */}
            <div 
              className={`pr-6 relative transition-all duration-300 cursor-pointer ${
                selectedOption === 'audio' 
                  ? 'bg-[#FFF8E0]' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={handleAudioSelect}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg">
                  <img src="/assets/Voice.png" alt="Audio Icon" className="h-12 w-16 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold">Audio Calling</h3>
                  <p className="text-sm text-gray-600">Earn by talking to users on voice calls</p>
                </div>
              </div>
              
              <div className="rounded-lg py-3 text-center font-bold mb-6">
                Earn <span className='text-black'>₹20,000-₹30,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-3 text-sm">Pros:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹2/min when a paid user calls you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹1/min when a free user calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>No face verification required</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Easy to start and use</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-sm">Cons:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>No virtual gift support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Lower earnings compared to video calls</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right Column - Video Calling */}
            <div 
              className={`pl-6 transition-all duration-300 cursor-pointer ${
                selectedOption === 'video' 
                  ? 'bg-[#FFF8E0]' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={handleVideoSelect}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg">
                  <img src="/assets/Video.png" alt="Video Icon" className="h-12 w-16 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold">Video Calling</h3>
                  <p className="text-sm text-gray-600">Earn more through video calls and gifts</p>
                </div>
              </div>
              
              <div className="rounded-lg py-3 text-center font-bold mb-6">
                Earn <span className='text-black'>₹60,000-₹1,00,000</span> Monthly
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-3 text-sm">Pros:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>₹9/min for every video call</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Get virtual gifts from users</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Higher engagement and visibility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Great way to earn more in less time</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-3 text-sm">Cons:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FDC62B] mr-2">•</span>
                      <span>Requires good internet and camera quality</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Proceed Button */}
          <div className="flex justify-center mt-2">
            <button 
              onClick={handleContinue}
              disabled={!selectedOption}
              className={`p-3 flex transition-all font-medium rounded-xl ${
                selectedOption ? 'bg-[#FDC62B] cursor-pointer hover:bg-[#f0b600] transform hover:scale-105' : 'bg-gray-300 cursor-not-allowed opacity-50'
              } button-animate`}
            >
              Start Earning
            </button>
          </div>
        </div>
      </div>
      
      {/* Person with money image */}
      <div className="absolute bottom-24 right-36 z-20 w-[140px]">
        <img src="/assets/user money.png" alt="Person with money" className="w-full h-auto object-contain" />
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
}