// FaceErrorModal.tsx
import React from 'react';

interface FaceErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string | null;
}

const FaceErrorModal: React.FC<FaceErrorModalProps> = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  const defaultErrorMessage = "We couldn't verify your face";
  const defaultSubMessage = "Please ensure your face is clearly visible and try again.";

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
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Face Verification Failed</h2>
          
          {/* Error Message */}
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {errorMessage || defaultErrorMessage}
          </h3>
          <p className="text-gray-600 mb-6">
            {errorMessage ? 'Please follow the guidance above and try again.' : defaultSubMessage}
          </p>

          {/* Tips for better detection */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-left w-full">
            <h4 className="font-semibold text-yellow-800 mb-2">Tips for better detection:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ensure your face is well-lit and clearly visible</li>
              <li>• Look directly at the camera</li>
              <li>• Remove any objects blocking your face</li>
              <li>• Avoid shadows or bright backlighting</li>
              <li>• Make sure the camera is in focus</li>
            </ul>
          </div>
          
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