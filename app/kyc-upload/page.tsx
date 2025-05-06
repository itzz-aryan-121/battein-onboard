'use client'


import { SetStateAction, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function KYCVerification() {
  const [panNumber, setPanNumber] = useState('');
  const [panCardFile, setPanCardFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanCardFile(e.target.files[0]);
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

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('PAN Number:', panNumber);
    console.log('PAN Card File:', panCardFile);
    // Navigate to bank details page
    router.push('/bank-details');
  };

  const isFormValid = panNumber.trim() !== '' && panCardFile !== null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>KYC Verification - PAN Card Upload</title>
        <meta name="description" content="Complete your KYC by uploading your PAN Card" />
      </Head>

      <main className="w-[1154px] z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">
            Complete Your <span className="text-yellow-500">KYC</span> – Upload Your <span className="text-yellow-500">PAN Card</span> Now!
          </h1>
          <p className="text-center text-gray-700 text-xs sm:text-sm mb-3">
            Make sure your details match your <span className="text-yellow-500">PAN</span> card for smooth verification and payouts.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4 w-[483px] mx-auto">
            <h3 className="font-medium text-center text-sm mb-1">Why PAN Card is Required:</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>KYC Verification – Confirms your identity</li>
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>TDS Compliance – Required for tax purposes</li>
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>Receive Payments – No delays in payouts</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="mb-3 w-[479px] mx-auto">
              <label htmlFor="panNumber" className="block mb-1 text-sm font-medium">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="panNumber"
                className="w-[480px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your PAN Number"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-[483px] mx-auto">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Upload your <span className="uppercase">PAN CARD</span> Photo</label>
                <label htmlFor="panCardUpload" className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  Upload <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  <input type="file" id="panCardUpload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
              {panCardFile && (
                <div className="border border-yellow-400 rounded-xl px-4  mx-auto my-auto flex items-center gap-4 mt-2 w-[480px] h-[61px] " style={{ boxShadow: '0px 0px 12.3px 0px #00000014' }}>
                  <div className="flex items-center justify-center   rounded-full   ">
                    {/* File icon */}
                    <img src="/assets/_File upload icon.png" alt="" className='w-[28px] h-[28px]'/>
                  </div>
                  <div className="flex-1 my-auto  ">
                    <div className="font-light text-lg text-gray-800 max-w-[160px] truncate whitespace-nowrap">
                      {panCardFile.name}
                    </div>
                    <div className="text-gray-500 text-sm">{Math.round(panCardFile.size / 1024)} KB</div>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-full bg-yellow-100 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="ml-2 font-semibold text-gray-700">{uploadProgress}%</span>
                    {isUploaded && (
                      <span className="ml-2 flex items-center justify-center w-10 rounded-full ">
                        <img src="/assets/_Checkbox base.png" alt="" className='w-[16px] h-[16px]'/>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-center text-sm font-medium mb-1">Reference Video:</h3>
              <p className="text-center text-xs text-gray-600 mb-2">Complete Step by Step Process Explained</p>
              <div className="relative mx-auto rounded-lg overflow-hidden w-[257px]" style={{ maxHeight: "150px" }}>
                <img src="/assets/kyc-video-thumbnail.png" alt="KYC Video Thumbnail" className="w-full h-full object-cover" style={{ maxHeight: "150px" }} />
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg> 
                  </div>
                </div> */}
              </div>
            </div>
            <button
              type="submit"
              className={`w-[278px] mx-auto bg-yellow-500 text-white py-2 rounded-lg text-base font-medium transition-colors ${
                !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
              }`}
              disabled={!isFormValid}
            >
              Proceed
            </button>
          </form>
        </div>
      </main>
      <div className="w-full absolute bottom-0 left-0 right-0">
        <img src="/assets/wave-top.png" alt="Top Wave" className="w-full object-cover h-24 absolute bottom-16" />
        <img src="/assets/wave-middle.png" alt="Middle Wave" className="w-full object-cover h-24 absolute bottom-8" />
        <img src="/assets/wave-bottom.png" alt="Bottom Wave" className="w-full object-cover h-24 absolute bottom-0" />
      </div>
    </div>
  );
}