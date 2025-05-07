'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BaateinEarningsPage() {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const router = useRouter();
  
  const handleAudioSelect = () => {
    if (!videoEnabled) {
      router.push('/avatar-upload');
    }
  };
  
  const handleVideoSelect = () => {
    if (videoEnabled) {
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Audio Calling */}
            <div className="border-r border-[#FDC62B] pr-6 relative">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg">
                  <img src="/assets/Voice.png" alt="Audio Icon" className="h-12 w-16 object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold">Audio Calling</h3>
                  <p className="text-sm text-gray-600">Earn by talking to users on voice calls</p>
                </div>
              </div>
              
              <div 
                className={`rounded-lg py-3 text-center font-bold mb-6 transition-colors bg-[#FDC62B] cursor-pointer hover:bg-[#f0b600]`}
                onClick={handleAudioSelect}
              >
                Earn ₹20,000-₹30,000 Monthly
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
            <div className="pl-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg">
                    <img src="/assets/Video.png" alt="Video Icon" className="h-12 w-16 object-contain" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold">Video Calling</h3>
                    <p className="text-sm text-gray-600">Earn more through video calls and gifts</p>
                  </div>
                </div>
                <div>
                  <label 
                    className="inline-flex relative items-center cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={videoEnabled}
                      onChange={() => setVideoEnabled(!videoEnabled)}
                    />
                    <div className={`w-14 h-7 rounded-full transition ${videoEnabled ? 'bg-[#F5BC1B]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform transform ${videoEnabled ? 'translate-x-7' : ''}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div 
                className={`rounded-lg py-3 text-center font-bold mb-6 transition-colors ${
                  videoEnabled 
                    ? 'bg-[#FDC62B] cursor-pointer hover:bg-[#f0b600]' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={videoEnabled ? handleVideoSelect : undefined}
                style={{ pointerEvents: videoEnabled ? 'auto' : 'none' }}
              >
                Earn ₹60,000-₹1,00,000 Monthly
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
        </div>
      </div>
      
      {/* Bottom Waves and User Money Image */}
      <div className="w-full absolute bottom-0 left-0 right-0">
        {/* Person with money image */}
        <div className="absolute bottom-5 right-36 z-20 w-[140px]">
          <img src="/assets/user money.png" alt="Person with money" className="w-full h-auto object-contain" />
        </div>
        
        {/* Waves - stacked in layers */}
        <div className="relative w-full">
          {/* Top wave - lightest */}
          <img 
            src="/assets/wave-top.png" 
            alt="Top Wave" 
            className="w-full object-cover h-40 absolute bottom-20"
          />
          
          {/* Middle wave */}
          <img 
            src="/assets/wave-middle.png" 
            alt="Middle Wave" 
            className="w-full object-cover h-40 absolute bottom-10"
          />
          
          {/* Bottom wave - darkest */}
          <img 
            src="/assets/wave-bottom.png" 
            alt="Bottom Wave" 
            className="w-full object-cover h-40 absolute bottom-0"
          />
        </div>
      </div>
    </div>
  );
}
