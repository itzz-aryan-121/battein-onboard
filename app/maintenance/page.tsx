import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl text-center border border-white/20">
        <div className="mb-8 relative">
          {/* Animated Mechanical Wheel */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-spin-slow"></div>
            {/* Inner Ring */}
            <div className="absolute inset-4 border-4 border-yellow-400 rounded-full animate-spin-reverse"></div>
            {/* Center Gear */}
            <div className="absolute inset-8 border-4 border-yellow-300 rounded-full animate-spin-slow"></div>
            {/* Center Circle */}
            <div className="absolute inset-12 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Maintenance Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Under Maintenance
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            We're currently performing scheduled maintenance to improve our services.
            Please check back soon.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-yellow-400">
            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Expected completion: Soon</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
      </div>
    </div>
  );
} 