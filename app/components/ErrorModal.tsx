'use client';

import React from 'react';
import Image from 'next/image';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  errors: Record<string, string>;
  fieldLabels?: Record<string, string>;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Please fix the following issues:",
  errors,
  fieldLabels = {}
}) => {
  if (!isOpen) return null;

  const errorEntries = Object.entries(errors).filter(([_, message]) => message.trim() !== '');
  
  if (errorEntries.length === 0) return null;

  const getFieldLabel = (fieldName: string): string => {
    return fieldLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Error Modal Content */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-3/4">
              <h2 className="text-gray-400 text-xl sm:text-2xl font-bold mb-1">Error</h2>
              <h3 className="text-[#E75A34] text-base sm:text-lg font-medium mb-3 sm:mb-4">{title}</h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {errorEntries.map(([fieldName, message]) => (
                  <div key={fieldName} className="flex items-start">
                    <span className="text-[#E75A34] mr-2 mt-0.5">•</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{getFieldLabel(fieldName)}:</p>
                      <p className="text-sm text-gray-600">{message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={onClose}
                className="w-full bg-[#E75A34] text-white font-medium py-2 sm:py-3 rounded-md transition-colors mt-4 sm:mt-6 hover:bg-[#d14928]"
              >
                Fix Errors
              </button>
            </div>
            <div className="hidden sm:flex sm:w-1/4 items-center justify-center">
              <Image 
                src="/assets/error.png" 
                alt="Error" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 