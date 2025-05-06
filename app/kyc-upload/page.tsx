'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function KycUploadPage() {
  const router = useRouter();
  const [panNumber, setPanNumber] = useState('');
  const [panCardFile, setPanCardFile] = useState<File | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileSize, setFileSize] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle PAN number input change
  const handlePanNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove spaces
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    // PAN format is AAAAA0000A (5 letters, 4 numbers, 1 letter)
    // Limit to 10 characters
    setPanNumber(value.slice(0, 10));
  };
  
  // Handle file upload for PAN card
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPanCardFile(file);
      setFileName(file.name);
      
      // Convert file size to KB
      const fileSizeKB = Math.round(file.size / 1024);
      setFileSize(`${fileSizeKB} KB`);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPanCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload progress
      simulateUpload();
    }
  };
  
  // Add this new function to simulate file upload
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the PAN card and details to a server here
    // Navigate to next step
    router.push('/bank-details');
  };
  
  return (
    <div className="flex flex-col bg-white h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-10 py-16 ">
        <div className="bg-white rounded-xl shadow-lg p-4 relative z-10 w-full max-w-5xl mx-auto">
          <h1 className="text-center text-2xl font-bold mb-2">
            Complete Your <span className="text-[#F5BC1C]">KYC</span> – Upload Your <span className="text-[#F5BC1C]">PAN Card</span>
          </h1>
          
          <p className="text-center text-gray-700 text-sm mb-4">
            Make sure your details match your <span className="text-[#F5BC1C] font-medium">PAN</span> card for smooth verification.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side - Form */}
            <div>
              {/* Why PAN Card is Required Section */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h3 className="font-medium text-sm mb-1">Why PAN Card is Required:</h3>
                <ul className="text-xs space-y-1">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">📌</span>
                    <span>KYC Verification – Confirms your identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">📌</span>
                    <span>TDS Compliance – Required for tax purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">📌</span>
                    <span>Receive Payments – No delays in payouts</span>
                  </li>
                </ul>
              </div>
              
              {/* Form Section */}
              <form onSubmit={handleSubmit}>
                {/* PAN Number Input */}
                <div className="mb-3">
                  <label htmlFor="panNumber" className="block mb-1 text-sm font-medium">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    value={panNumber}
                    onChange={handlePanNumberChange}
                    placeholder="Enter your PAN Number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5BC1C]"
                    required
                  />
                </div>
                
                {/* PAN Card Upload */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">
                      Upload your <span className="font-bold">PAN CARD</span> Photo
                    </div>
                    {!isUploaded && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="bg-white border hover:border-[#F5BC1C] rounded-full px-3 py-1 text-xs flex items-center"
                      >
                        Upload 
                        <img src="/assets/plus.png" alt="Upload" className="w-[9px] h-[9px] ml-1" />
                      </button>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {/* File upload display */}
                  {panCardFile && (
                    <div className="mt-2 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="bg-[#F5BC1C] rounded-full w-8 h-8 flex items-center justify-center text-white mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between text-xs">
                            <span>{fileName}</span>
                            <span className="text-gray-500">{fileSize}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div 
                              className="bg-[#F5BC1C] h-full" 
                              style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease' }}
                            ></div>
                          </div>
                        </div>
                        {isUploaded && (
                          <div className="ml-2 rounded-full w-5 h-5 flex items-center justify-center">
                            <img src="/assets/_Checkbox base.png" alt="check" className="w-[16px] h-[16px]" />
                          </div>
                        )}
                      </div>
                      {isUploading && (
                        <div className="text-right text-xs text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#F5BC1C] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e5ac0f] transition-colors"
                >
                  Proceed
                </button>
              </form>
            </div>
            
            {/* Right Side - Reference Video */}
            <div>
              <h3 className="text-center font-medium text-sm mb-1">Reference Video:</h3>
              <p className="text-center text-xs mb-2">Complete Step by Step Process Explained</p>
              
              {/* Video thumbnail with play button */}
              <div className="relative mx-auto w-full">
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <img 
                    src="/assets/kyc-video-thumbnail.png" 
                    alt="KYC Video Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center">
                      <div className="w-8 h-8  rounded-full flex items-center justify-center">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional information or steps */}
              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-1">Important Steps:</h4>
                <ol className="text-xs list-decimal pl-4 space-y-1">
                  <li>Enter your 10-digit PAN number exactly as it appears on your card</li>
                  <li>Upload a clear, well-lit photo of your original PAN card</li>
                  <li>Make sure all details are clearly visible in the image</li>
                  <li>Verification typically takes 24-48 hours to complete</li>
                </ol>
              </div>
            </div>
          </div>
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
        <div className="absolute bottom-0 left-0 right-0" style={{ opacity: 0.4, transform: 'translateY(-20px)' }}>
          <img 
            src="/assets/wave-middle.png" 
            alt="Wave Middle" 
            className="w-full object-cover"
            style={{ height: '60px' }}
          />
        </div>
        
        {/* Top layer - decorative elements */}
        <div className="absolute bottom-0 w-full">
          <div className="absolute left-[10%] bottom-[20px]">
            <div className="bg-[#F5BC1C] opacity-20 rounded-full" style={{ width: '20px', height: '20px' }}></div>
          </div>
          <div className="absolute right-[15%] bottom-[40px]">
            <div className="bg-[#F5BC1C] opacity-30 rounded-full" style={{ width: '15px', height: '15px' }}></div>
          </div>
          <div className="absolute left-[30%] bottom-[30px]">
            <div className="bg-[#F5BC1C] opacity-25 rounded-full" style={{ width: '10px', height: '10px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}