'use client'

import { useState } from 'react';

export default function BaateinEarningsPage() {
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  return (
    <div className="flex flex-col  bg-white mx-auto pt-20">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mx-auto ">
      <div className="bg-white rounded-3xl shadow-lg p-10 relative z-10 w-[1159px] mx-auto h-[852px] translate-y-20">

          {/* Heading */}
          <h1 className="text-center text-4xl font-bold mb-6">
            <span className="text-[#FDC62B]">Earn</span> <span className="text-gray-800">Through Multiple Features</span>
          </h1>
          
          {/* Subheading */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="font-semibold">Baatein</span> offers <span className="font-semibold">multiple earning opportunities</span> — connect with users through voice, chat, or video 
            calls, and receive virtual gifts as a token of appreciation. Start earning on your terms today.
          </div>
          
          {/* Section Title */}
          <h2 className="text-center text-2xl font-bold mb-10">Enable Your Earning Options</h2>
          
          {/* Two Columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Audio Calling */}
            <div className="border-r border-[#FDC62B] pr-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg">
                  <img src="/assets/Voice.png" alt="Audio Icon" className="h-[47.32px] w-[61.86px] object-contain" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold">Audio Calling</h3>
                  <p className="text-sm text-gray-600">Earn by talking to users on voice calls</p>
                </div>
              </div>
              
              <div className="bg-[#FDC62B] rounded-lg py-3 text-center font-bold mb-6">
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
                    <img src="/assets/Video.png" alt="Video Icon" className="h-[47.32px] w-[61.86px] object-contain" />
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
              
              <div className="bg-[#FDC62B] rounded-lg py-3 text-center font-bold mb-6">
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
      
      {/* Bottom Wave */}
      <div className="w-full relative mt-8">
        <div className="absolute bottom-0 right-30 w-[276px] h-[288px] top-[-100px] pointer-events-none z-10">
          <img src="/assets/user money.png" alt="Person with money" className="object-contain" />
        </div>
        <svg viewBox="0 0 1440 320" className="w-full transform translate-y-1" preserveAspectRatio="none">
          <path fill="#F6BE05" fillOpacity="0.6" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,144C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#F6BE05" fillOpacity="0.8" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,213.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}