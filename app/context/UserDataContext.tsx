'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the complete user data structure
export interface UserData {
  // Welcome page data
  name: string;
  phoneNumber: string;
  gender: 'Female' | 'Male' | 'LGBTQ' | '';
  referralCode: string;
  
  // Partner details data
  spokenLanguages: string[];
  hobbies: string[];
  bio: string;
  audioIntro: string; // URL after upload
  
  // Earning preference
  earningPreference: 'audio' | 'video' | null;
  
  // Avatar upload
  avatarUrl: string;
  
  // Profile picture
  profilePicture: string;
  
  // KYC data
  kyc: {
    panNumber: string;
    panCardFile: string;
  };
  
  // Bank details
  bankDetails: {
    bankAccountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    branchName: string;
    upiId: string;
    cancelCheque: string;
  };
  
  // Camera verification
  capturedPhoto: string;
  
  // Submission status
  isSubmitted: boolean;
  partnerId: string;
}

// Initial state
const initialUserData: UserData = {
  name: '',
  phoneNumber: '',
  gender: '',
  referralCode: '',
  spokenLanguages: [],
  hobbies: [],
  bio: '',
  audioIntro: '',
  earningPreference: null,
  avatarUrl: '',
  profilePicture: '',
  kyc: {
    panNumber: '',
    panCardFile: '',
  },
  bankDetails: {
    bankAccountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    branchName: '',
    upiId: '',
    cancelCheque: '',
  },
  capturedPhoto: '',
  isSubmitted: false,
  partnerId: '',
};

// Context type
interface UserDataContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  updateKycData: (kycData: Partial<UserData['kyc']>) => void;
  updateBankDetails: (bankData: Partial<UserData['bankDetails']>) => void;
  submitAllData: () => Promise<{ success: boolean; partnerId?: string; error?: string }>;
  clearUserData: () => void;
  isDataComplete: () => boolean;
}

// Create context
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Provider component
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userRegistrationData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRegistrationData', JSON.stringify(userData));
    }
  }, [userData]);

  // Update user data
  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  // Update KYC data specifically
  const updateKycData = useCallback((kycData: Partial<UserData['kyc']>) => {
    setUserData(prev => ({
      ...prev,
      kyc: { ...prev.kyc, ...kycData }
    }));
  }, []);

  // Update bank details specifically
  const updateBankDetails = useCallback((bankData: Partial<UserData['bankDetails']>) => {
    setUserData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, ...bankData }
    }));
  }, []);

  // Check if all required data is complete
  const isDataComplete = useCallback(() => {
    const required = [
      userData.name,
      userData.phoneNumber,
      userData.gender,
      userData.spokenLanguages.length > 0,
      userData.hobbies.length > 0,
      userData.bio,
      userData.earningPreference,
      userData.profilePicture,
      userData.kyc.panNumber,
      userData.kyc.panCardFile,
      userData.bankDetails.bankAccountNumber,
      userData.bankDetails.accountHolderName,
      userData.bankDetails.ifscCode,
      userData.bankDetails.branchName,
      userData.bankDetails.cancelCheque,
    ];

    return required.every(field => {
      if (typeof field === 'boolean') return field;
      if (typeof field === 'string') return field.trim() !== '';
      return false;
    });
  }, [userData]);

  // Submit all data to database
  const submitAllData = useCallback(async (): Promise<{ success: boolean; partnerId?: string; error?: string }> => {
    try {
      if (!isDataComplete()) {
        return { success: false, error: 'Please complete all required fields before submitting.' };
      }

      // Check if already submitted
      if (userData.isSubmitted && userData.partnerId) {
        return { success: true, partnerId: userData.partnerId };
      }

      // Prepare data for submission
      const submissionData = {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        referralCode: userData.referralCode || undefined,
        spokenLanguages: userData.spokenLanguages,
        hobbies: userData.hobbies,
        bio: userData.bio,
        audioIntro: userData.audioIntro,
        earningPreference: userData.earningPreference,
        avatarUrl: userData.avatarUrl,
        profilePicture: userData.profilePicture,
        kyc: userData.kyc,
        bankDetails: userData.bankDetails,
        capturedPhoto: userData.capturedPhoto,
        status: 'Pending'
      };

      // Submit to API (will create new or update existing partner)
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit registration data');
      }

      const partner = await response.json();
      
      // Update local state with submission success
      setUserData(prev => ({
        ...prev,
        isSubmitted: true,
        partnerId: partner._id
      }));

      return { success: true, partnerId: partner._id };
    } catch (error: any) {
      console.error('Error submitting user data:', error);
      return { success: false, error: error.message || 'Failed to submit registration data' };
    }
  }, [userData, isDataComplete]);

  // Clear all user data
  const clearUserData = useCallback(() => {
    setUserData(initialUserData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRegistrationData');
      // Also clear any legacy localStorage items
      localStorage.removeItem('name');
      localStorage.removeItem('phoneNumber');
      localStorage.removeItem('gender');
      localStorage.removeItem('referralCode');
      localStorage.removeItem('partnerDetails');
      localStorage.removeItem('partnerId');
      localStorage.removeItem('kycData');
      localStorage.removeItem('bankDetails');
      localStorage.removeItem('profilePicture');
      localStorage.removeItem('capturedPhoto');
      localStorage.removeItem('avatarUrl');
      localStorage.removeItem('panCardFileUrl');
      localStorage.removeItem('cancelChequeUrl');
    }
  }, []);

  const value: UserDataContextType = {
    userData,
    updateUserData,
    updateKycData,
    updateBankDetails,
    submitAllData,
    clearUserData,
    isDataComplete,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

// Hook to use the context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 