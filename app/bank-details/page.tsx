'use client'


import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Data:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>Add Bank Details</title>
        <meta name="description" content="Add your bank details to receive payouts" />
      </Head>

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
                  className="w-[226px] border border-yellow-400 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
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
                  className="w-[226px]  border border-yellow-400 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
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
                  className="w-[226px] border border-yellow-400 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
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
                  className="w-[226px] border border-yellow-400 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm"
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
                <span className="bg-white px-2 sm:px-4 text-gray-500 text-xs sm:text-sm">or</span>
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
                className="w-[348px] max-w-md border border-yellow-400 rounded-md px-2 py-1.5 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs sm:text-sm mx-auto"
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
                  className={`flex items-center gap-2 border border-gray-300 rounded-md px-2 py-2 sm:px-4 sm:py-3 cursor-pointer text-xs sm:text-sm transition-colors duration-300 ${isUploaded ? 'bg-[#F5BC1C]' : 'bg-gray-100'}`}
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
                className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-4 rounded-md transition duration-300 text-base sm:text-lg"
              >
                Proceed
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="w-full absolute bottom-0 left-0 right-0 pointer-events-none">
        <img src="/assets/wave-top.png" alt="Top Wave" className="w-full object-cover h-24 absolute bottom-16" />
        <img src="/assets/wave-middle.png" alt="Middle Wave" className="w-full object-cover h-24 absolute bottom-8" />
        <img src="/assets/wave-bottom.png" alt="Bottom Wave" className="w-full object-cover h-24 absolute bottom-0" />
      </div>
    </div>
  );
}