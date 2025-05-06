'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FloatingParticles from '../components/FloatingParticles';

export default function RulesRegulationsPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAgreed) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to success page after agreement
      router.push('/success');
    } catch (error) {
      console.error('Error submitting agreement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white  relative overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles color="#F5BC1C" count={8} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 sm:px-10 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 relative z-10 w-full max-w-5xl mx-auto">
          {/* Logo and title */}
          <div className="flex justify-center items-center mb-5">
            <div className="bg-[#F5BC1C] rounded-xl w-12 h-12 flex items-center justify-center mr-2">
              <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-8 h-8" />
            </div>
            <div className="text-[#F5BC1C] text-3xl font-bold">Baatein</div>
          </div>
          
          <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Rules & Regulations
          </h1>
          
          <div className="flex flex-col md:flex-row">
            <div className="flex-grow pr-0 md:pr-6 max-w-2xl">
              {/* Rules content */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold">Accurate Information Required</h2>
                  <p className="text-sm text-gray-700">
                    All users must submit correct personal details including Name (as per PAN), PAN Card, Mobile Number, Gender, Profile Photo, and 
                    Bank Details (IFSC Code, Branch Name, UPI ID). Inaccurate info may lead to account suspension.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Earning Potential</h2>
                  <p className="text-sm text-gray-700">
                    Partners can earn ₹20,000-₹30,000 through audio calls and ₹60,000-₹1,00,000 through video calls. Earnings depend on 
                    performance, consistency, and user engagement.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Respectful Communication</h2>
                  <p className="text-sm text-gray-700">
                    All voice, video, and chat interactions must be respectful and professional. Any form of abuse, inappropriate behavior, or misuse 
                    of the platform is strictly prohibited.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Verified Payments</h2>
                  <p className="text-sm text-gray-700">
                    Payouts are processed based on the verified bank/UPI details provided. Baatein is not liable for payment failures due to incorrect 
                    account information.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Privacy & Data Security</h2>
                  <p className="text-sm text-gray-700">
                    Personal information is used only for verification and payouts. It will remain confidential and will not be visible publicly or shared 
                    without permission.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Age & Eligibility</h2>
                  <p className="text-sm text-gray-700">
                    Users must be 18+ to register and earn. All partners are expected to follow legal and ethical guidelines while using the platform.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-base font-semibold">Violation & Consequences</h2>
                  <p className="text-sm text-gray-700">
                    Any breach of rules may lead to warnings, temporary suspension, or permanent removal from the platform. Baatein reserves the 
                    right to take appropriate action at any time.
                  </p>
                </div>
              </div>
              
              {/* Agreement checkbox */}
              <div className="mt-6">
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="mt-1 h-4 w-4 text-[#F5BC1C] border-gray-300 rounded focus:ring-[#F5BC1C]"
                    checked={isAgreed}
                    onChange={() => setIsAgreed(!isAgreed)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the Terms & Conditions and confirm that the information provided is accurate.
                  </span>
                </label>
              </div>
              
              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="button"
                  disabled={!isAgreed || isLoading}
                  onClick={handleSubmit}
                  className="w-full sm:w-1/3 mx-auto bg-[#F5BC1C] text-white py-3 rounded-lg text-base font-medium hover:bg-[#e5ac0f] transition-colors flex items-center justify-center disabled:bg-[#f5bc1c99] disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Submit"}
                </button>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="md:block w-1/3 flex justify-end mt-10 ">
              <div className="flex">
                <Image 
                  src="/assets/rules-girl.png" 
                  alt="Person with checklist" 
                  width={300} 
                  height={350}
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Waves */}
      <div className="w-full absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '150px' }}>
        {/* Background layer - main wave */}
        <img 
          src="/assets/wave-bottom-yellow.png" 
          alt="Wave" 
          className="w-full absolute bottom-0 left-0 right-0 object-cover"
          style={{ height: '150px' }}
        />
      </div>
    </div>
  );
} 