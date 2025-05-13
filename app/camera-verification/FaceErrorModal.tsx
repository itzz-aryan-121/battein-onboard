// FaceErrorModal.tsx
import React from 'react';

interface FaceErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaceErrorModal: React.FC<FaceErrorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 flex flex-col items-center text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          
          {/* Error Title */}
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Error</h2>
          
          {/* Error Message */}
          <h3 className="text-lg font-medium text-gray-800 mb-2">We couldn't verify your face</h3>
          <p className="text-gray-600 mb-6">Please ensure your face is clearly visible and try again.</p>
          
          {/* Try Again Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceErrorModal;