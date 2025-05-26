'use client';

import { useUserData } from '../context/UserDataContext';

interface RegistrationProgressProps {
  currentStep?: string;
  showPercentage?: boolean;
}

export default function RegistrationProgress({ 
  currentStep, 
  showPercentage = true 
}: RegistrationProgressProps) {
  const { userData, isDataComplete } = useUserData();

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const steps = [
      { key: 'basic', completed: !!(userData.name && userData.phoneNumber && userData.gender) },
      { key: 'details', completed: !!(userData.spokenLanguages.length > 0 && userData.hobbies.length > 0 && userData.bio) },
      { key: 'earning', completed: !!userData.earningPreference },
      { key: 'profile', completed: !!userData.profilePicture },
      { key: 'kyc', completed: !!(userData.kyc.panNumber && userData.kyc.panCardFile) },
      { key: 'bank', completed: !!(userData.bankDetails.bankAccountNumber && userData.bankDetails.cancelCheque) },
    ];

    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const percentage = getCompletionPercentage();

  if (!showPercentage && percentage === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-sm sm:text-base font-medium text-gray-700">Registration Progress</span>
        {showPercentage && (
          <span className="text-sm sm:text-base font-semibold text-[#F5BC1C] bg-[#F5BC1C]/10 px-2 py-1 rounded-full">
            {percentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#F5BC1C] to-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {currentStep && (
        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
          <span className="font-medium">Current:</span> {currentStep}
        </p>
      )}
      {percentage === 100 && (
        <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 font-medium flex items-center">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Ready to submit!
        </p>
      )}
    </div>
  );
} 