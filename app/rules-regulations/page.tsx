'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WaveBackground from '../components/WaveBackground';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function RulesRegulationsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { userData, submitAllData, isDataComplete, clearUserData } = useUserData();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    logo: false,
    rules: false,
    checkbox: false,
    button: false,
    illustration: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, logo: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, rules: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, checkbox: true })), 800),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 1000),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, illustration: true })), 1200),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if all required data is complete
      if (!isDataComplete()) {
        setError('Please complete all required fields before submitting.');
        setIsLoading(false);
        return;
      }

      // Submit all data to database
      const result = await submitAllData();
      
      if (result.success) {
        // Clear the form data after successful submission
        // Note: We keep the partnerId for potential future use
        router.push('/success');
      } else {
        setError(result.error || 'Failed to submit registration data. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/rules-regulations');
  }, []);

  // Show data completion status for debugging (remove in production)
  const dataCompletionStatus = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Data completion status:', {
        name: !!userData.name,
        phoneNumber: !!userData.phoneNumber,
        gender: !!userData.gender,
        spokenLanguages: userData.spokenLanguages.length > 0,
        hobbies: userData.hobbies.length > 0,
        bio: !!userData.bio,
        earningPreference: !!userData.earningPreference,
        profilePicture: !!userData.profilePicture,
        panNumber: !!userData.kyc.panNumber,
        panCardFile: !!userData.kyc.panCardFile,
        bankAccountNumber: !!userData.bankDetails.bankAccountNumber,
        accountHolderName: !!userData.bankDetails.accountHolderName,
        ifscCode: !!userData.bankDetails.ifscCode,
        branchName: !!userData.bankDetails.branchName,
        cancelCheque: !!userData.bankDetails.cancelCheque,
      });
    }
  };

  useEffect(() => {
    dataCompletionStatus();
  }, [userData]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden py-32 animate-pageEnter">
      <main className="w-full max-w-4xl z-10 px-2 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-auto w-full relative animate-cardEntrance">
          {/* Logo and title */}
          <div className={`flex flex-col items-center mb-2 transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
            <div className={`flex items-center mb-2 transition-all duration-500 ${animatedElements.logo ? 'animate-scaleIn' : 'animate-on-load'}`}>
              <div className="bg-[#F5BC1C] rounded-xl w-10 h-10 flex items-center justify-center mr-2">
                <img src="/assets/Baaten Logo 6.png" alt="Baatein Logo" className="w-6 h-6" />
              </div>
              <div className="text-[#F5BC1C] text-2xl font-bold">Baatein</div>
            </div>
            <h1 className="text-2xl font-bold text-golden-shine mb-2 text-center">{t('rulesRegulations', 'title')}</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-shakeX">
              {error}
            </div>
          )}

          {/* Data completion warning */}
          {!isDataComplete() && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg animate-fadeInUp">
              Please complete all previous steps before submitting your registration.
            </div>
          )}

          {/* Rules Content */}
          <div className={`max-w-3xl mx-auto text-left transition-all duration-500 ${animatedElements.rules ? 'animate-fadeInUp stagger-children' : 'animate-on-load'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="mb-1">
                <span className="font-bold text-sm">Accurate Information Required</span>
                <p className="text-xs text-gray-700">
                  All users must submit correct personal details including Name (as per PAN), PAN Card, Mobile Number, Gender, Profile Photo, and Bank Details. Inaccurate info may lead to account suspension.
                </p>
              </div>
              <div className="mb-1">
                <span className="font-bold text-sm">Earning Potential</span>
                <p className="text-xs text-gray-700">
                  Partners can earn ₹20,000–₹30,000 through audio calls and ₹60,000–₹1,00,000 through video calls. Earnings depend on performance, consistency, and user engagement.
                </p>
              </div>
              <div className="mb-1">
                <span className="font-bold text-sm">Respectful Communication</span>
                <p className="text-xs text-gray-700">
                  All voice, video, and chat interactions must be respectful and professional. Any form of abuse, inappropriate behavior, or misuse of the platform is strictly prohibited.
                </p>
              </div>
              <div className="mb-1">
                <span className="font-bold text-sm">Verified Payments</span>
                <p className="text-xs text-gray-700">
                  Payouts are processed based on the verified bank/UPI details provided. Baatein is not liable for payment failures due to incorrect account information.
                </p>
              </div>
              <div className="mb-1">
                <span className="font-bold text-sm">Privacy & Data Security</span>
                <p className="text-xs text-gray-700">
                  Personal information is used only for verification and payouts. It will remain confidential and will not be visible publicly or shared without permission.
                </p>
              </div>
              <div className="mb-1">
                <span className="font-bold text-sm">Age & Eligibility</span>
                <p className="text-xs text-gray-700">
                  Users must be 18+ to register and earn. All partners are expected to follow legal and ethical guidelines while using the platform.
                </p>
              </div>
            </div>
            <div className="mt-1">
              <span className="font-bold text-sm">Violation & Consequences</span>
              <p className="text-xs text-gray-700">
                Any breach of rules may lead to warnings, temporary suspension, or permanent removal from the platform. Baatein reserves the right to take appropriate action at any time.
              </p>
            </div>
          </div>
          
          {/* Agreement checkbox */}
          <div className={`mt-4 flex items-start text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200 transition-all duration-500 ${animatedElements.checkbox ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
            <input 
              type="checkbox" 
              id="agreement-checkbox"
              className="h-5 w-5 cursor-pointer mt-0.5 flex-shrink-0 hover-scale" 
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
            />
            <label htmlFor="agreement-checkbox" className="ml-3 text-green-700 text-sm cursor-pointer">
              I agree to the <span className="underline font-medium">Terms & Conditions</span> and confirm that the information provided is accurate.
            </label>
          </div>
          
          {/* Submit button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={!isAgreed || isLoading || !isDataComplete()}
              onClick={handleSubmit}
              className={`w-[280px] bg-[#F5BC1C] text-white py-2.5 rounded-lg text-base font-medium hover:bg-[#e5ac0f] transition-all flex items-center justify-center disabled:bg-[#f5bc1c99] disabled:cursor-not-allowed button-animate hover-glow ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting
                </>
              ) : "Submit"}
            </button>
          </div>
        </div>
      </main>
      
      {/* Girl Illustration - Hidden on mobile, visible on md screens and up */}
      <div className={`absolute z-10 pointer-events-none hidden md:block transition-all duration-500 ${animatedElements.illustration ? 'animate-fadeInRight' : 'animate-on-load'}`} style={{bottom: '220px', right: '250px'}}>
        <Image 
          src="/assets/rules-girl.png" 
          alt="Person with checklist" 
          width={180} 
          height={180}
          priority
          className="hover-scale"
        />
      </div>
      
      {/* Wave Background Component */}
      <WaveBackground height={300} />
    </div>
  );
}