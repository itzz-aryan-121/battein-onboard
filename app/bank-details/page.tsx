'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FloatingParticles from '../components/FloatingParticles';

export default function BankDetailsPage() {
  const router = useRouter();
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showBankDetails, setShowBankDetails] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle bank account number input
  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setBankAccountNumber(value);
  };
  
  // Handle name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountHolderName(e.target.value);
  };
  
  // Handle IFSC code input
  const handleIFSCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove spaces
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    setIfscCode(value);
  };
  
  // Handle branch name input
  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranchName(e.target.value);
  };
  
  // Handle UPI ID input
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };
  
  // Handle file upload for canceled cheque
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setChequeFile(file);
      
      // Simulate upload progress
      simulateUpload();
    }
  };
  
  // Simulate file upload with progress
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Toggle between bank details and UPI
  const togglePaymentMethod = (showBank: boolean) => {
    setShowBankDetails(showBank);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (showBankDetails) {
      if (!bankAccountNumber) {
        newErrors.bankAccountNumber = 'Bank account number is required';
      } else if (!/^\d{9,18}$/.test(bankAccountNumber)) {
        newErrors.bankAccountNumber = 'Enter a valid account number (9-18 digits)';
      }
      
      if (!accountHolderName) {
        newErrors.accountHolderName = 'Account holder name is required';
      }
      
      if (!ifscCode) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifscCode)) {
        newErrors.ifscCode = 'Enter a valid IFSC code';
      }
      
      if (!branchName) {
        newErrors.branchName = 'Branch name is required';
      }
    } else {
      if (!upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
        newErrors.upiId = 'Enter a valid UPI ID';
      }
    }
    
    if (!chequeFile) {
      newErrors.chequeFile = 'Please upload a cancelled cheque or passbook';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would send the bank details to a server
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to rules and regulations page
      router.push('/rules-regulations');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white h-screen   relative overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles color="#F5BC1C" count={8} />
      
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-10 sm:px-10 py-20 mt-4">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 relative z-10 w-full max-w-6xl mx-auto">
          <h1 className="text-center text-2xl font-bold mb-1">
            Add Your <span className="text-[#F5BC1C]">Bank Details</span> to Receive Payouts
          </h1>
          
          <p className="text-center text-gray-700 text-sm mb-3">
            We collect your Bank Details, UPI ID to ensure secure and smooth
            payouts directly to your account.
          </p>
          
          {/* Payment method toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => togglePaymentMethod(true)}
                className={`px-4 py-1.5 text-sm font-medium rounded-l-lg ${
                  showBankDetails
                    ? 'bg-[#F5BC1C] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Bank Account
              </button>
              <button
                type="button"
                onClick={() => togglePaymentMethod(false)}
                className={`px-4 py-1.5 text-sm font-medium rounded-r-lg ${
                  !showBankDetails
                    ? 'bg-[#F5BC1C] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                UPI
              </button>
            </div>
          </div>
          
          {/* Information Box */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3 max-w-3xl mx-auto">
            <h3 className="font-medium text-xs mb-1">Correct bank details needed to send your earnings securely</h3>
            <ul className="text-xs space-y-0.5">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Make sure all information is accurate</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <span>Incorrect details may lead to failed or delayed payouts</span>
              </li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {/* Left Side - Bank Details Form */}
              {showBankDetails && (
                <div className="space-y-2">
                  <div>
                    <label htmlFor="bankAccount" className="block mb-0.5 text-xs font-medium">
                      Bank Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bankAccount"
                      value={bankAccountNumber}
                      onChange={handleBankAccountChange}
                      placeholder="9124871274634"
                      className={`w-full px-3 py-1.5 text-sm border ${
                        errors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]`}
                      aria-invalid={errors.bankAccountNumber ? 'true' : 'false'}
                    />
                    {errors.bankAccountNumber && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.bankAccountNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="accountHolder" className="block mb-0.5 text-xs font-medium">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountHolder"
                      value={accountHolderName}
                      onChange={handleNameChange}
                      placeholder="Riya sharma"
                      className={`w-full px-3 py-1.5 text-sm border ${
                        errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]`}
                      aria-invalid={errors.accountHolderName ? 'true' : 'false'}
                    />
                    {errors.accountHolderName && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.accountHolderName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="ifscCode" className="block mb-0.5 text-xs font-medium">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      value={ifscCode}
                      onChange={handleIFSCChange}
                      placeholder="SBIN12481002"
                      className={`w-full px-3 py-1.5 text-sm border ${
                        errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]`}
                      aria-invalid={errors.ifscCode ? 'true' : 'false'}
                    />
                    {errors.ifscCode && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.ifscCode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="branchName" className="block mb-0.5 text-xs font-medium">
                      Branch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="branchName"
                      value={branchName}
                      onChange={handleBranchChange}
                      placeholder="Gurugram"
                      className={`w-full px-3 py-1.5 text-sm border ${
                        errors.branchName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]`}
                      aria-invalid={errors.branchName ? 'true' : 'false'}
                    />
                    {errors.branchName && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.branchName}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* UPI Section (Shown when bank details are hidden) */}
              {!showBankDetails && (
                <div className="space-y-2">
                  <div>
                    <label htmlFor="upiId" className="block mb-0.5 text-xs font-medium">
                      Your UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={handleUpiIdChange}
                      placeholder="riya@ybl"
                      className={`w-full px-3 py-1.5 text-sm border ${
                        errors.upiId ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]`}
                      aria-invalid={errors.upiId ? 'true' : 'false'}
                    />
                    {errors.upiId && (
                      <p className="mt-0.5 text-xs text-red-500">{errors.upiId}</p>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 mt-2">
                    <h4 className="font-medium text-xs mb-0.5 text-yellow-800">UPI Information:</h4>
                    <ul className="text-xs space-y-0.5 text-yellow-700">
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-1">•</span>
                        <span>UPI is an instant real-time payment system</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-1">•</span>
                        <span>Your UPI ID typically follows the format: username@bankcode</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-500 mr-1">•</span>
                        <span>You can find your UPI ID in your bank's mobile app</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Right Side - Upload Section */}
              <div>
                {/* Cheque Upload */}
                <div className="mb-3">
                  <label className="block mb-0.5 text-xs font-medium">
                    Cancel cheque/ passbook <span className="text-red-500">*</span>
                  </label>
                  
                  <div className={`border-2 border-dashed ${errors.chequeFile ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg p-3 text-center cursor-pointer hover:border-[#F5BC1C] transition-colors`} onClick={handleUploadClick}>
                    {!chequeFile ? (
                      <div className="flex flex-col items-center py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs font-medium text-gray-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-0.5">PNG, JPG or PDF (max. 5MB)</p>
                        
                        {errors.chequeFile && (
                          <p className="mt-1 text-xs text-red-500">{errors.chequeFile}</p>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-2 bg-white">
                        <div className="flex items-center">
                          <div className="bg-[#F5BC1C] rounded-full w-6 h-6 flex items-center justify-center text-white mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium truncate max-w-[150px]">{chequeFile.name}</span>
                              <span className="text-gray-500">{Math.round(chequeFile.size / 1024)} KB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1 overflow-hidden">
                              <div 
                                className="bg-[#F5BC1C] h-full" 
                                style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease' }}
                              ></div>
                            </div>
                          </div>
                          {isUploaded ? (
                            <div className="ml-2 rounded-full w-4 h-4 flex items-center justify-center">
                              <img src="/assets/_Checkbox base.png" alt="check" className="w-[14px] h-[14px]" />
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChequeFile(null);
                                setIsUploaded(false);
                              }}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {isUploading && (
                          <div className="text-right text-xs text-gray-500 mt-0.5">
                            Uploading... {uploadProgress}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    aria-label="Upload cancelled cheque or passbook"
                  />
                </div>
                
                {/* Additional information */}
                <div className="mt-2 bg-gray-50 rounded-lg p-2">
                  <h4 className="font-medium text-xs mb-0.5">Important Information:</h4>
                  <ol className="text-xs list-decimal pl-3 space-y-0.5">
                    <li>Ensure the bank account is in your name</li>
                    <li>Double-check your account number and IFSC code</li>
                    <li>Cancelled cheque helps verify your bank details</li>
                    <li>UPI is an alternative method for receiving payments</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-4 max-w-xs mx-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F5BC1C] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e5ac0f] transition-colors flex items-center justify-center disabled:bg-[#f5bc1c99] disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Proceed"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Bottom Waves - Made shorter */}
      <div className="w-full absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '100px' }}>
        {/* Background layer - main wave */}
        <img 
          src="/assets/wave-bottom-yellow.png" 
          alt="Wave" 
          className="w-full absolute bottom-0 left-0 right-0 object-cover"
          style={{ height: '100px' }}
        />
        
        {/* Middle layer wave for depth */}
        <div className="absolute bottom-0 left-0 right-0">
          <img 
            src="/assets/wave-middle.png" 
            alt="Wave Middle" 
            className="w-full object-cover"
            style={{ height: '60px' }}
          />
        </div>
      </div>
    </div>
  );
} 