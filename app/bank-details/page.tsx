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

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    return (
      formData.bankAccountNumber.trim() !== '' &&
      formData.bankAccountNumber.match(/^\d{9,18}$/) &&
      formData.accountHolderName.trim() !== '' &&
      formData.ifscCode.trim() !== '' &&
      formData.ifscCode.match(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/) &&
      formData.branchName.trim() !== '' &&
      formData.upiId.trim() !== '' &&
      formData.upiId.includes('@') &&
      (isUploaded || userData.bankDetails.cancelCheque) &&
      !uploadError &&
      !isSubmitting
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-4 sm:py-6 md:py-8 px-4">
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

      <main className="w-full max-w-6xl z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mx-auto border border-[#f5bc1c0a]">
          {/* Header Section - Compact for Desktop */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 lg:mb-3 text-gray-800 transition-all duration-700 ${animatedFields.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              {t('bankDetails', 'title')} 🏦
            </h1>
            <p className={`text-center text-gray-600 text-sm sm:text-base leading-relaxed mb-3 lg:mb-4 px-2 transition-all duration-700 delay-200 ${animatedFields.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              We collect your Bank Details, UPI ID to ensure secure and smooth
              <span className="hidden sm:inline"><br /></span> payouts directly to your account.
            </p>
          </div>

          {/* Desktop: Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column: Info Section */}
            <div className="order-1 lg:order-1 lg:col-span-1">
              <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-200 transition-all duration-700 delay-300 ${animatedFields.header ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-center font-semibold mb-3 text-sm sm:text-base text-blue-800 flex items-center justify-center gap-2">
                  <span className="text-lg">💡</span>
                  Correct bank details needed to send your earnings securely
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                    <span className="text-gray-700">Make sure all information is accurate</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <span className="text-red-500 mr-2 flex-shrink-0">❌</span>
                    <span className="text-gray-700">Incorrect details may lead to failed or delayed payouts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="order-2 lg:order-2 lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Bank Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className={`transition-all duration-700 ${animatedFields.bankAccount ? 'animate-fadeInLeft opacity-100' : 'opacity-0 -translate-x-8'}`}>
                    <label htmlFor="bankAccountNumber" className="block font-semibold mb-2 text-sm sm:text-base text-gray-700">
                      Bank Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-sm sm:text-base transition-all duration-300 placeholder-gray-400
                        ${errors.bankAccountNumber ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your Bank Account Number"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.bankAccountNumber && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium flex items-start gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        {errors.bankAccountNumber}
                      </p>
                    )}
                  </div>
                  
                  <div className={`transition-all duration-700 ${animatedFields.accountHolder ? 'animate-fadeInRight opacity-100' : 'opacity-0 translate-x-8'}`}>
                    <label htmlFor="accountHolderName" className="block font-semibold mb-2 text-sm sm:text-base text-gray-700">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-sm sm:text-base transition-all duration-300 placeholder-gray-400
                        ${errors.accountHolderName ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter Account Holder Name"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.accountHolderName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium flex items-start gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        {errors.accountHolderName}
                      </p>
                    )}
                  </div>
                  
                  <div className={`transition-all duration-700 ${animatedFields.ifsc ? 'animate-fadeInLeft opacity-100' : 'opacity-0 -translate-x-8'}`}>
                    <label htmlFor="ifscCode" className="block font-semibold mb-2 text-sm sm:text-base text-gray-700">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-sm sm:text-base transition-all duration-300 placeholder-gray-400
                        ${errors.ifscCode ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter IFSC Code"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.ifscCode && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium flex items-start gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>
                  
                  <div className={`transition-all duration-700 ${animatedFields.branch ? 'animate-fadeInRight opacity-100' : 'opacity-0 translate-x-8'}`}>
                    <label htmlFor="branchName" className="block font-semibold mb-2 text-sm sm:text-base text-gray-700">
                      Branch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="branchName"
                      name="branchName"
                      className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-sm sm:text-base transition-all duration-300 placeholder-gray-400
                        ${errors.branchName ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                      value={formData.branchName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter Branch Name"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.branchName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium flex items-start gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        {errors.branchName}
                      </p>
                    )}
                  </div>
                </div>

                {/* UPI and Upload Section - Side by Side on Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  
                  {/* UPI Section */}
                  <div className={`transition-all duration-700 ${animatedFields.upi ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
                    <div className="text-center lg:text-left mb-3">
                      <label htmlFor="upiId" className="block font-semibold text-sm sm:text-base  mb-1">
                        {t('bankDetails', 'upiId')} <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs sm:text-sm text-gray-500">Quick and easy payment method</p>
                    </div>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-sm sm:text-base transition-all duration-300 placeholder-gray-400
                        ${errors.upiId ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                      value={formData.upiId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your UPI ID (e.g., name@paytm)"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.upiId && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 font-medium flex items-start gap-2">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        {errors.upiId}
                      </p>
                    )}
                  </div>

                  {/* File Upload Section */}
                  <div className={`transition-all duration-700 ${animatedFields.upload ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
                    <div className="text-center lg:text-left mb-3">
                      <label htmlFor="cancelCheque" className="block font-semibold text-sm sm:text-base mb-1">
                        {t('bankDetails', 'cancelCheque')} <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs sm:text-sm text-gray-500">Upload cancelled cheque or passbook</p>
                    </div>
                    
                    <label 
                      htmlFor="cancelCheque" 
                      className={`relative flex flex-col items-center justify-center w-full h-28 sm:h-32 lg:h-36 border-2 border-dashed rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 
                        ${uploadProgress > 0 && uploadProgress < 100 ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50' :
                          isUploaded ? 'border-green-400 bg-green-50 hover:bg-green-100' : 
                          'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#f5bc1c] hover:scale-[1.02]'}`}
                    >
                      {isUploaded ? (
                        // Success State
                        <div className="text-center p-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-green-700 mb-1">Upload Complete!</p>
                          <p className="text-xs text-green-600">Click to change file</p>
                        </div>
                      ) : uploadProgress > 0 && uploadProgress < 100 ? (
                        // Uploading State
                        <div className="text-center p-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2">
                            <svg className="animate-spin h-10 w-10 lg:h-12 lg:w-12 text-[#f5bc1c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Uploading...</p>
                          <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
                        </div>
                      ) : (
                        // Default Upload State
                        <div className="text-center p-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 bg-[#f5bc1c] rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Upload Cancel Cheque
                          </p>
                          <p className="text-xs text-gray-500">
                            Click to browse or drag & drop
                          </p>
                        </div>
                      )}
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
                      <div className="mt-2 animate-fadeInUp">
                        <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded-lg">
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
                      <div className="mt-2 animate-fadeInUp">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-700 font-medium">
                            {uploadProgress < 20 ? 'Preparing upload...' : 
                             uploadProgress < 50 ? 'Uploading to cloud...' : 
                             uploadProgress < 90 ? 'Processing file...' : 
                             'Finalizing upload...'}
                          </span>
                          <span className="text-xs text-gray-700 font-semibold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#f5bc1c] h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Success State */}
                    {isUploaded && uploadProgress === 100 && !uploadError && (
                      <div className="mt-2 animate-fadeInUp">
                        <div className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-sm text-green-600 font-medium">File uploaded successfully!</span>
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-2 text-xs text-gray-500 text-center lg:text-left">
                      Supported formats: JPEG, PNG, PDF (Max size: 10MB)
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className={`transition-all duration-700 ${animatedFields.button ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r text-white py-3 sm:py-4 lg:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 shadow-lg 
                      ${!isFormValid() ? 'from-gray-400 to-gray-500 opacity-50 cursor-not-allowed' : 
                        isSubmitting ? 'from-gray-400 to-gray-500 opacity-75 cursor-not-allowed' :
                        'from-[#f5bc1c] to-[#ffd700] hover:from-[#e6a817] hover:to-[#f5bc1c] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'}`}
                    disabled={!isFormValid()}
                    style={{ minHeight: '48px' }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Continue to Next Step</span>
                        {isFormValid() ? (
                          <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        ) : (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        )}
                      </span>
                    )}
                  </button>
                  
                  {/* Form Status Message */}
                  <div className="mt-2 text-center">
                    {isFormValid() ? (
                      <p className="text-xs sm:text-sm text-green-600 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        All details completed - Ready to proceed
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500">
                        All fields are required to proceed to the next step
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Wave Background */}
      <WaveBackground height={150} />
    </div>
  );
}