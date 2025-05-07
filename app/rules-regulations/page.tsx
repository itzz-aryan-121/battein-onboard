'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RulesRegulationsPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/success');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <main className="w-full max-w-4xl z-10 px-2 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mx-auto w-full relative" style={{maxHeight: '80vh', minHeight: '400px', overflowY: 'auto'}}>
          {/* Logo and title */}
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center mb-2">
              <div className="bg-[#F5BC1C] rounded-xl w-12 h-12 flex items-center justify-center mr-2">
                <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-8 h-8" />
              </div>
              <div className="text-[#F5BC1C] text-3xl font-bold">Baatein</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Rules & Regulations</h1>
          </div>
          {/* Rules Content */}
          <div className="max-w-3xl mx-auto text-left">
            <div className="mb-2">
              <span className="font-bold text-base">Accurate Information Required</span>
              <p className="text-sm text-gray-700">
                All users must submit correct personal details including Name (as per PAN), PAN Card, Mobile Number, Gender, Profile Photo, and Bank Details (IFSC Code, Branch Name, UPI ID). Inaccurate info may lead to account suspension.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Earning Potential</span>
              <p className="text-sm text-gray-700">
                Partners can earn ₹20,000–₹30,000 through audio calls and ₹60,000–₹1,00,000 through video calls. Earnings depend on performance, consistency, and user engagement.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Respectful Communication</span>
              <p className="text-sm text-gray-700">
                All voice, video, and chat interactions must be respectful and professional. Any form of abuse, inappropriate behavior, or misuse of the platform is strictly prohibited.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Verified Payments</span>
              <p className="text-sm text-gray-700">
                Payouts are processed based on the verified bank/UPI details provided. Baatein is not liable for payment failures due to incorrect account information.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Privacy & Data Security</span>
              <p className="text-sm text-gray-700">
                Personal information is used only for verification and payouts. It will remain confidential and will not be visible publicly or shared without permission.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Age & Eligibility</span>
              <p className="text-sm text-gray-700">
                Users must be 18+ to register and earn. All partners are expected to follow legal and ethical guidelines while using the platform.
              </p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-base">- Violation & Consequences</span>
              <p className="text-sm text-gray-700">
                Any breach of rules may lead to warnings, temporary suspension, or permanent removal from the platform. Baatein reserves the right to take appropriate action at any time.
              </p>
            </div>
          </div>
          {/* Agreement checkbox */}
          <div className="mt-4 flex items-center text-sm text-gray-700">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-green-600 border-green-400 rounded focus:ring-green-500" 
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
            />
            <span className="ml-2 text-green-700">
              I agree to the <span className="underline">Terms & Conditions</span> and confirm that the information provided is accurate.
            </span>
          </div>
          {/* Submit button */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              disabled={!isAgreed || isLoading}
              onClick={handleSubmit}
              className="w-[320px] bg-[#F5BC1C] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#e5ac0f] transition-colors flex items-center justify-center disabled:bg-[#f5bc1c99] disabled:cursor-not-allowed"
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
          {/* Girl Illustration absolutely at the bottom right edge of the card */}
          <div className="absolute" style={{right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000}}>
            <Image 
              src="/assets/rules-girl.png" 
              alt="Person with checklist" 
              width={220} 
              height={220}
              priority
              className="object-contain z-1000 fixed bottom-9 right-36"
            />
          </div>
        </div>
      </main>
      {/* Bottom Waves */}
      <div className="w-full absolute bottom-0 left-0 right-0 pointer-events-none">
        <img src="/assets/wave-top.png" alt="Top Wave" className="w-full object-cover h-24 absolute bottom-16" />
        <img src="/assets/wave-middle.png" alt="Middle Wave" className="w-full object-cover h-24 absolute bottom-8" />
        <img src="/assets/wave-bottom.png" alt="Bottom Wave" className="w-full object-cover h-24 absolute bottom-0" />
      </div>
    </div>
  );
} 