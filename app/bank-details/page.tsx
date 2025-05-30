'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function BankDetails() {
  const { t } = useLanguage();
  const { userData, updateBankDetails } = useUserData();
  const [formData, setFormData] = useState<{
    bankAccountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    branchName: string;
    upiId: string;
    cancelCheque: File | null;
  }>({
    bankAccountNumber: userData.bankDetails.bankAccountNumber || '',
    accountHolderName: userData.bankDetails.accountHolderName || '',
    ifscCode: userData.bankDetails.ifscCode || '',
    branchName: userData.bankDetails.branchName || '',
    upiId: userData.bankDetails.upiId || '',
    cancelCheque: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(!!userData.bankDetails.cancelCheque);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    bankAccountNumber?: string;
    accountHolderName?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
    cancelCheque?: string;
    general?: string;
  }>({});
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const router = useRouter();
  const [animatedFields, setAnimatedFields] = useState({
    header: false,
    bankAccount: false,
    accountHolder: false,
    ifsc: false,
    branch: false,
    upi: false,
    upload: false,
    button: false
  });

  // Progressive form field appearance for better UX like welcome page
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, bankAccount: true })), 400),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, accountHolder: true })), 600),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, ifsc: true })), 800),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, branch: true })), 1000),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, upi: true })), 1200),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, upload: true })), 1400),
      setTimeout(() => setAnimatedFields(prev => ({ ...prev, button: true })), 1600),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/bank-details');
  }, []);

  // Sync form data with context data
  useEffect(() => {
    setFormData({
      bankAccountNumber: userData.bankDetails.bankAccountNumber || '',
      accountHolderName: userData.bankDetails.accountHolderName || '',
      ifscCode: userData.bankDetails.ifscCode || '',
      branchName: userData.bankDetails.branchName || '',
      upiId: userData.bankDetails.upiId || '',
      cancelCheque: null
    });
    setIsUploaded(!!userData.bankDetails.cancelCheque);
  }, [userData.bankDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Save to context in real-time
    updateBankDetails({ [name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploaded(false);
        setUploadProgress(0);
        setUploadError(null);
        setUploadedFileSize(file.size);
        
        // Validate file first
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/pdf'];
        
        if (file.size > maxSize) {
          setUploadError('File size must be less than 10MB');
          return;
        }
        
        if (!allowedTypes.includes(file.type.toLowerCase())) {
          setUploadError('Please upload a valid file (JPEG, PNG, PDF)');
          return;
        }

        setFormData({
          ...formData,
          cancelCheque: file
        });

        // Show initial progress
        setUploadProgress(10);

        // Simulate progress updates during upload
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev < 90) return prev + 10;
            return prev;
          });
        }, 200);

        // Upload to Cloudinary immediately
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        
        const uploadRes = await fetch('/api/upload', { 
          method: 'POST', 
          body: formDataFile 
        });

        clearInterval(progressInterval);

        if (!uploadRes.ok) {
          throw new Error('Upload failed. Please try again.');
        }

        const uploadData = await uploadRes.json();
        if (!uploadData.url) {
          throw new Error('Upload failed. No URL returned.');
        }

        // Complete the progress
        setUploadProgress(100);
        updateBankDetails({ cancelCheque: uploadData.url });
        setIsUploaded(true);

        // Show success message briefly
        setTimeout(() => {
          setUploadProgress(100);
        }, 500);

      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadError(error.message || 'Upload failed. Please try again.');
        setUploadProgress(0);
        setIsUploaded(false);
      }
    }
  };

  const validateDetails = () => {
    const newErrors: {
      bankAccountNumber?: string;
      accountHolderName?: string;
      ifscCode?: string;
      branchName?: string;
      upiId?: string;
      cancelCheque?: string;
      general?: string;
    } = {};
    
    let isValid = true;

    // Validate Bank Account Number
    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = "Bank account number is required";
      isValid = false;
    } else if (!formData.bankAccountNumber.match(/^\d{9,18}$/)) {
      newErrors.bankAccountNumber = "Bank account number must be between 9 and 18 digits";
      isValid = false;
    }

    // Validate Account Holder Name
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
      isValid = false;
    }

    // Validate IFSC Code
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
      isValid = false;
    } else if (!formData.ifscCode.match(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/)) {
      newErrors.ifscCode = "Invalid IFSC code format (should be like SBIN0123456)";
      isValid = false;
    }

    // Validate Branch Name
    if (!formData.branchName.trim()) {
      newErrors.branchName = "Branch name is required";
      isValid = false;
    }

    // Validate UPI ID
    if (!formData.upiId.trim()) {
      newErrors.upiId = "UPI ID is required";
      isValid = false;
    } else if (!formData.upiId.includes('@')) {
      newErrors.upiId = "UPI ID must contain @ symbol";
      isValid = false;
    }

    // Validate Cancel Cheque
    if (!formData.cancelCheque && !userData.bankDetails.cancelCheque) {
      newErrors.cancelCheque = "Please upload a cancel cheque or passbook front image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDetails()) {
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Store bank details in context
      updateBankDetails({
        bankAccountNumber: formData.bankAccountNumber,
        accountHolderName: formData.accountHolderName,
        ifscCode: formData.ifscCode,
        branchName: formData.branchName,
        upiId: formData.upiId,
        cancelCheque: userData.bankDetails.cancelCheque
      });

      // Navigate to rules and regulations page
      router.push('/rules-regulations');
    } catch (error: any) {
      console.error('Error saving bank details:', error);
      setErrors({ general: 'An error occurred while saving your details. Please try again.' });
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>Add Bank Details</title>
        <meta name="description" content="Add your bank details to receive payouts" />
      </Head>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowErrorModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto z-10 relative animate-scaleIn" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-3/4">
                  <h3 className="text-[#E75A34] text-base sm:text-lg font-medium mb-3 sm:mb-4 animate-fadeInUp">Please fix the following issues:</h3>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {errors.bankAccountNumber && (
                      <div className="flex items-start animate-fadeInLeft delay-100">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.bankAccountNumber}</p>
                      </div>
                    )}
                    {errors.accountHolderName && (
                      <div className="flex items-start animate-fadeInLeft delay-200">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.accountHolderName}</p>
                      </div>
                    )}
                    {errors.ifscCode && (
                      <div className="flex items-start animate-fadeInLeft delay-300">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.ifscCode}</p>
                      </div>
                    )}
                    {errors.branchName && (
                      <div className="flex items-start animate-fadeInLeft delay-400">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.branchName}</p>
                      </div>
                    )}
                    {errors.upiId && (
                      <div className="flex items-start animate-fadeInLeft delay-500">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.upiId}</p>
                      </div>
                    )}
                    {errors.cancelCheque && (
                      <div className="flex items-start animate-fadeInLeft delay-600">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.cancelCheque}</p>
                      </div>
                    )}
                    {errors.general && (
                      <div className="flex items-start animate-fadeInLeft delay-700">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.general}</p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-[#E75A34] text-white font-medium py-2 sm:py-3 rounded-md transition-all duration-300 mt-4 sm:mt-6 button-animate transform hover:scale-105 animate-fadeInUp delay-800"
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
                    className="object-contain animate-floatY"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-6xl z-10 px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mx-auto">
          <h1 className={`text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 sm:mb-4 transition-all duration-700 ${animatedFields.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
            {t('bankDetails', 'title')}
          </h1>
          <p className={`text-center text-gray-700 mb-3 sm:mb-4 text-sm md:text-base font-medium px-2 transition-all duration-700 delay-200 ${animatedFields.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
            We collect your Bank Details, UPI ID to ensure secure and smooth
            <span className="hidden sm:inline"><br /></span> payouts directly to your account.
          </p>
          <div className={`bg-gray-50 rounded-md p-3 sm:p-4 mb-4 w-full sm:w-[90%] md:w-[80%] lg:w-[596px] mx-auto transition-all duration-700 delay-300 ${animatedFields.header ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
            <h2 className="text-center font-medium mb-2 sm:mb-3 text-sm sm:text-base text-golden-shine">{t('bankDetails', 'subtitle')}</h2>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-center text-xs sm:text-sm">
                <span className="text-green-500 mr-2">✅</span>
                <span>Make sure all information is accurate</span>
              </div>
              <div className="flex items-center justify-center text-xs sm:text-sm">
                <span className="text-red-500 mr-2">❌</span>
                <span>Incorrect details may lead to failed or delayed payouts</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4">
              <div className={`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] transition-all duration-700 ${animatedFields.bankAccount ? 'animate-fadeInLeft opacity-100' : 'opacity-0 -translate-x-8'}`}>
                <label htmlFor="bankAccountNumber" className="block font-medium mb-1 text-xs sm:text-sm">
                  Bank Account Number <span className="text-red-500 animate-pulse">*</span>
                </label>
                <input
                  type="text"
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  className={`w-full border ${errors.bankAccountNumber ? 'border-red-500 animate-shakeX' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm transition-all duration-300 focus:scale-105 hover:border-yellow-500`}
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your Bank Account Number"
                />
              </div>
              <div className={`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] transition-all duration-700 ${animatedFields.accountHolder ? 'animate-fadeInRight opacity-100' : 'opacity-0 translate-x-8'}`}>
                <label htmlFor="accountHolderName" className="block font-medium mb-1 text-xs sm:text-sm">
                  Account Holder Name <span className="text-red-500 animate-pulse">*</span>
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  className={`w-full border ${errors.accountHolderName ? 'border-red-500 animate-shakeX' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm transition-all duration-300 focus:scale-105 hover:border-yellow-500`}
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Account Holder Name"
                />
              </div>
              <div className={`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] transition-all duration-700 ${animatedFields.ifsc ? 'animate-fadeInLeft opacity-100' : 'opacity-0 -translate-x-8'}`}>
                <label htmlFor="ifscCode" className="block font-medium mb-1 text-xs sm:text-sm">
                  IFSC Code <span className="text-red-500 animate-pulse">*</span>
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  className={`w-full border ${errors.ifscCode ? 'border-red-500 animate-shakeX' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm transition-all duration-300 focus:scale-105 hover:border-yellow-500`}
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter IFSC Code"
                />
              </div>
              <div className={`w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] transition-all duration-700 ${animatedFields.branch ? 'animate-fadeInRight opacity-100' : 'opacity-0 translate-x-8'}`}>
                <label htmlFor="branchName" className="block font-medium mb-1 text-xs sm:text-sm">
                  Branch Name <span className="text-red-500 animate-pulse">*</span>
                </label>
                <input
                  type="text"
                  id="branchName"
                  name="branchName"
                  className={`w-full border ${errors.branchName ? 'border-red-500 animate-shakeX' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm transition-all duration-300 focus:scale-105 hover:border-yellow-500`}
                  value={formData.branchName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Branch Name"
                />
              </div>
            </div>
            <div className="relative mb-4 sm:mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                
              </div>
            </div>
            <div className={`mb-4 sm:mb-5 transition-all duration-700 ${animatedFields.upi ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              <label htmlFor="upiId" className="block font-medium mb-1 text-xs sm:text-sm text-center text-golden-shine">
                {t('bankDetails', 'upiId')} <span className="text-red-500 animate-pulse">*</span>
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  className={`w-full max-w-xs sm:max-w-sm md:max-w-md border ${errors.upiId ? 'border-red-500 animate-shakeX' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm transition-all duration-300 focus:scale-105 hover:border-yellow-500`}
                  value={formData.upiId}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your UPI ID"
                />
              </div>
            </div>
            <div className={`mb-4 sm:mb-6 transition-all duration-700 ${animatedFields.upload ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
              <label htmlFor="cancelCheque" className="block font-medium mb-2 text-center text-xs sm:text-sm text-golden-shine">
                {t('bankDetails', 'cancelCheque')} <span className="text-red-500 animate-pulse">*</span>
              </label>
              <div className="flex flex-col items-center justify-center">
                <label 
                  htmlFor="cancelCheque" 
                  className={`flex items-center justify-center gap-2 w-full max-w-xs border ${errors.cancelCheque ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 ${
                    uploadProgress > 0 && uploadProgress < 100 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                    isUploaded ? 'bg-green-50 border-green-300' : 'bg-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-gray-700">
                    {uploadProgress > 0 && uploadProgress < 100 ? (
                      <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : isUploaded ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="4" x2="8" y2="20"></line>
                        <line x1="16" y1="4" x2="16" y2="20"></line>
                        <line x1="4" y1="8" x2="20" y2="8"></line>
                        <line x1="4" y1="16" x2="20" y2="16"></line>
                      </svg>
                    )}
                  </span>
                  <span className="text-center">
                    {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' :
                     isUploaded ? 'File Uploaded Successfully' : 
                     'Upload Cancel Cheque / Passbook Front'}
                  </span>
                </label>
                <input
                  type="file"
                  id="cancelCheque"
                  name="cancelCheque"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                />

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-3 w-full max-w-xs animate-fadeInUp">
                    <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded-md">
                      <svg className="h-4 w-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-sm text-red-600 font-medium">Upload Failed</p>
                        <p className="text-xs text-red-600">{uploadError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && !uploadError && (
                  <div className="mt-3 w-full max-w-xs animate-fadeInUp">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-black font-medium">
                        {uploadProgress < 20 ? 'Preparing upload...' : 
                         uploadProgress < 50 ? 'Uploading to cloud...' : 
                         uploadProgress < 90 ? 'Processing file...' : 
                         'Finalizing upload...'}
                      </span>
                      <span className="text-xs text-black font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F5BC1C] rounded-full transition-all duration-300 ease-out animate-progress" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {isUploaded && uploadProgress === 100 && !uploadError && (
                  <div className="mt-3 w-full max-w-xs animate-scaleIn">
                    <div className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-md">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-green-600 font-medium">Upload completed successfully!</span>
                    </div>
                    {uploadedFileSize !== null && (
                      <div className="text-center text-gray-500 text-xs mt-1">
                        File size: {uploadedFileSize > 1024 * 1024 
                          ? `${(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB` 
                          : `${Math.round(uploadedFileSize / 1024)} KB`}
                      </div>
                    )}
                  </div>
                )}

                {/* File Info for uploaded files */}
                {formData.cancelCheque && !isUploaded && uploadProgress === 0 && (
                  <div className="mt-3 flex flex-col items-center w-full max-w-xs animate-fadeInUp">
                    <div className="w-full max-w-[200px] h-[6px] bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${isUploaded ? 'bg-[#F5BC1C]' : 'bg-yellow-400'}`} style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{uploadProgress}%</span>
                    {uploadedFileSize !== null && (
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {uploadedFileSize > 1024 * 1024 
                          ? `${(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB` 
                          : `${Math.round(uploadedFileSize / 1024)} KB`}
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-500 text-center">
                  Supported formats: JPEG, PNG, PDF (Max size: 10MB)
                </p>
              </div>
            </div>
            <div className={`flex justify-center mb-2 sm:mb-0 transition-all duration-700 ${animatedFields.button ? 'animate-buttonGlow opacity-100' : 'opacity-0 scale-95'}`}>
              <button
                type="submit"
                className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-md transition-all duration-300 text-sm sm:text-base button-animate flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!isUploaded || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : 'Proceed'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Wave Background */}
      <WaveBackground height={250} />
    </div>
  );
}