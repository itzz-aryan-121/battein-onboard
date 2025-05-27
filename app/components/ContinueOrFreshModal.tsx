import React from 'react';

interface ContinueOrFreshModalProps {
  open: boolean;
  onContinue: () => void;
  onStartFresh: () => void;
}

const ContinueOrFreshModal: React.FC<ContinueOrFreshModalProps> = ({ open, onContinue, onStartFresh }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 animate-overlayFadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center relative animate-modalSlideIn border border-gray-100 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5BC1C] via-[#FFD700] to-[#F5BC1C] animate-shimmer"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#F5BC1C] to-[#FFD700] rounded-full opacity-10 animate-float"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-[#F5BC1C] to-[#FFD700] rounded-full opacity-10 animate-floatReverse"></div>
        
        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F5BC1C] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg animate-iconPulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-[#F5BC1C] to-[#FFD700] rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 animate-textSlideUp">
            Resume your progress?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#F5BC1C] to-[#FFD700] mx-auto mb-6 rounded-full animate-lineExpand"></div>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed animate-textSlideUp animation-delay-200">
            We found an unfinished session. Would you like to continue where you left off, or start fresh?
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col gap-4 animate-buttonsSlideUp animation-delay-400">
            <button
              className="group relative bg-[#F5BC1C] hover:bg-[#e0a800] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              onClick={onContinue}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue
              </div>
            </button>
            
            <button
              className="group relative bg-gray-200 hover:bg-red-400 hover:text-white text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              onClick={onStartFresh}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Fresh
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-overlayFadeIn {
          animation: overlayFadeIn 0.4s ease-out;
        }
        
        .animate-modalSlideIn {
          animation: modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-floatReverse {
          animation: floatReverse 8s ease-in-out infinite;
        }
        
        .animate-iconPulse {
          animation: iconPulse 2s ease-in-out infinite;
        }
        
        .animate-textSlideUp {
          animation: textSlideUp 0.6s ease-out;
        }
        
        .animate-lineExpand {
          animation: lineExpand 0.8s ease-out;
        }
        
        .animate-buttonsSlideUp {
          animation: buttonsSlideUp 0.7s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        @keyframes overlayFadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-3deg); }
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes textSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes lineExpand {
          from { 
            width: 0; 
            opacity: 0; 
          }
          to { 
            width: 4rem; 
            opacity: 1; 
          }
        }
        
        @keyframes buttonsSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default ContinueOrFreshModal; 