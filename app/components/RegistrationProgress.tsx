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
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Registration Progress</span>
        {showPercentage && (
          <span className="text-sm font-medium text-[#F5BC1C]">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#F5BC1C] h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {currentStep && (
        <p className="text-xs text-gray-500 mt-1">Current: {currentStep}</p>
      )}
      {percentage === 100 && (
        <p className="text-xs text-green-600 mt-1 font-medium">✓ Ready to submit!</p>
      )}
    </div>
  );
} 