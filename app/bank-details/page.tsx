'use client'


import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

export default function BankDetails() {
  const [formData, setFormData] = useState<{
    bankAccountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    branchName: string;
    upiId: string;
    cancelCheque: File | null;
  }>({
    bankAccountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    branchName: '',
    upiId: '',
    cancelCheque: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errors, setErrors] = useState<{
    bankAccountNumber?: string;
    accountHolderName?: string;
    ifscCode?: string;
    branchName?: string;
    upiId?: string;
    cancelCheque?: string;
    general?: string;
  }>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        cancelCheque: e.target.files[0]
      });
      setIsUploaded(false);
      setUploadProgress(0);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploaded(true);
        }
      }, 80);
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
    if (!formData.cancelCheque) {
      newErrors.cancelCheque = "Please upload a cancel cheque or passbook front image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateDetails()) {
      setShowErrorModal(true);
      return;
    }
    
    const partnerId = localStorage.getItem('partnerId');
    if (!partnerId) {
      alert('No partner ID found!');
      return;
    }

    // 1. Upload the cancel cheque file if needed
    let cancelChequeUrl = '';
    if (formData.cancelCheque) {
      const formDataFile = new FormData();
      formDataFile.append('file', formData.cancelCheque);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formDataFile });
      const uploadData = await uploadRes.json();
      cancelChequeUrl = uploadData.url;
    }

    // 2. PATCH the partner document with bank details
    await fetch(`/api/partners/${partnerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankDetails: {
          bankAccountNumber: formData.bankAccountNumber,
          accountHolderName: formData.accountHolderName,
          ifscCode: formData.ifscCode,
          branchName: formData.branchName,
          upiId: formData.upiId,
          cancelCheque: cancelChequeUrl
        }
      })
    });

    // Navigate to rules and regulations page as the next step in the flow
    router.push('/rules-regulations');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0  bg-opacity-50 backdrop-filter backdrop-blur-sm"
            onClick={() => setShowErrorModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md mx-auto z-10 relative" style={{ boxShadow: '-9px 4px 76px 0px #00000040' }}>
            <div className="p-6">
              <div className="flex">
                <div className="w-3/4">
                  {/* <h2 className="text-gray-400 text-2xl font-bold mb-1">Form Errors</h2> */}
                  <h3 className="text-[#E75A34] text-lg font-medium mb-4">Please fix the following issues:</h3>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {errors.bankAccountNumber && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.bankAccountNumber}</p>
                      </div>
                    )}
                    {errors.accountHolderName && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.accountHolderName}</p>
                      </div>
                    )}
                    {errors.ifscCode && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.ifscCode}</p>
                      </div>
                    )}
                    {errors.branchName && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.branchName}</p>
                      </div>
                    )}
                    {errors.upiId && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.upiId}</p>
                      </div>
                    )}
                    {errors.cancelCheque && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.cancelCheque}</p>
                      </div>
                    )}
                    {errors.general && (
                      <div className="flex items-start">
                        <span className="text-[#E75A34] mr-2">•</span>
                        <p className="text-sm text-gray-700">{errors.general}</p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-[#E75A34] text-white font-medium py-3 rounded-md transition-colors mt-6 button-animate"
                  >
                    Fix Errors
                  </button>
                </div>
                <div className="w-1/4 flex items-center justify-center">
                  <Image 
                    src="/assets/error.png" 
                    alt="Error" 
                    width={100} 
                    height={100} 
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl w-[1159px] z-10 px-2">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
            Add Your <span className="text-yellow-500">Bank Details</span> to Receive Payouts
          </h1>
          <p className="text-center text-gray-700 mb-3 sm:mb-4 text-md font-medium sm:text-base">
            We collect your Bank Details, UPI ID to ensure secure and smooth<br />
            payouts directly to your account.
          </p>
          <div className="bg-gray-50 rounded-md p-3 sm:p-4 mb-3 sm:mb-4 w-[596px] mx-auto">
            <h2 className="text-center font-medium mb-2 sm:mb-3 text-sm sm:text-base">Correct bank details needed to send your earnings securely</h2>
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
            <div className="flex justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label htmlFor="bankAccountNumber" className="block font-medium mb-1 text-xs sm:text-sm">
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  className={`w-[226px] border ${errors.bankAccountNumber ? 'border-red-500' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm`}
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your Bank Account Number"
                />
              </div>
              <div>
                <label htmlFor="accountHolderName" className="block font-medium mb-1 text-xs sm:text-sm">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  className={`w-[226px] border ${errors.accountHolderName ? 'border-red-500' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm`}
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Account Holder Name"
                />
              </div>
              <div>
                <label htmlFor="ifscCode" className="block font-medium mb-1 text-xs sm:text-sm">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  className={`w-[226px] border ${errors.ifscCode ? 'border-red-500' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm`}
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter IFSC Code"
                />
              </div>
              <div>
                <label htmlFor="branchName" className="block font-medium mb-1 text-xs sm:text-sm">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="branchName"
                  name="branchName"
                  className={`w-[226px] border ${errors.branchName ? 'border-red-500' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm`}
                  value={formData.branchName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Branch Name"
                />
              </div>
            </div>
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                
              </div>
            </div>
            <div className="mb-3 sm:mb-4 flex flex-col  mx-auto">
              <label htmlFor="upiId" className=" font-medium mb-1  text-xs sm:text-sm mx-auto">
                Your UPI ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                className={`w-[348px] max-w-md border ${errors.upiId ? 'border-red-500' : 'border-yellow-400'} rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm mx-auto`}
                value={formData.upiId}
                onChange={handleInputChange}
                required
                placeholder="Enter your UPI ID"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label htmlFor="cancelCheque" className="block font-medium mb-1 text-center text-xs sm:text-sm">
                Cancel cheque/ passbook <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-center justify-center">
                <label 
                  htmlFor="cancelCheque" 
                  className={`flex items-center gap-2 border ${errors.cancelCheque ? 'border-red-500' : 'border-gray-300'} rounded-md px-2 py-2 sm:px-4 sm:py-3 cursor-pointer text-xs sm:text-sm transition-colors duration-300 ${isUploaded ? 'bg-[#F5BC1C]' : 'bg-gray-100'}`}
                >
                  <span className="text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="8" y1="4" x2="8" y2="20"></line>
                      <line x1="16" y1="4" x2="16" y2="20"></line>
                      <line x1="4" y1="8" x2="20" y2="8"></line>
                      <line x1="4" y1="16" x2="20" y2="16"></line>
                    </svg>
                  </span>
                  Upload Cancel Cheque / Passbook Front
                </label>
                <input
                  type="file"
                  id="cancelCheque"
                  name="cancelCheque"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                />
                {formData.cancelCheque && (
                  <>
                    <div className="mt-2 flex flex-col items-center">
                      <div className="w-[120px] h-[6px] bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${isUploaded ? 'bg-[#F5BC1C]' : 'bg-yellow-400'}`} style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{uploadProgress}%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-green-600 text-center mt-1">
                      File selected: {formData.cancelCheque.name}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-4 rounded-md transition duration-300 text-base sm:text-lg button-animate"
              >
                Proceed
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