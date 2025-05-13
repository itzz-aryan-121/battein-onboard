'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import './styles.css';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phone = searchParams.get('phoneNumber');
    if (phone) {
      setMobileNumber('+91 - ' + phone);
    }
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    // Check if input is numeric or empty
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value !== '') {
        // If current input is filled and not the last one, focus on next input
        if (index < 3) {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) nextInput.focus();
        } 
        // If this is the last input being filled, check if all inputs are filled
        else if (index === 3) {
          const allFilled = newOtp.every(digit => digit !== '');
          if (allFilled) {
            // Show processing state immediately
            setIsProcessing(true);
            // Auto-continue after a short delay
            setTimeout(() => {
              handleContinue();
            }, 100);
          }
        }
      }
    } else {
      // Show error modal for non-numeric input
      setShowErrorModal(true);
      
      // Add shake animation to the current input
      const currentInput = document.getElementById(`otp-${index}`);
      if (currentInput) {
        currentInput.classList.add('shake');
        setTimeout(() => {
          currentInput.classList.remove('shake');
        }, 500);
      }
      
      // Set timeout to hide error after 3 seconds
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleContinue = () => {
    console.log('OTP Submitted:', otp.join(''));
    setIsProcessing(true);
    
    // Simulate verification delay (in a real app, this would be an API call)
    setTimeout(() => {
      router.push('/partner-details');
    }, 1500);
  };

  const handleSendOtp = () => {
    console.log('Sending OTP to:', mobileNumber);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Girl Illustration - Positioned to the left of the screen */}
      <Image 
        src="/assets/yo-girl.png" 
        alt="Illustration" 
        width={453} 
        height={520}
        className="absolute right-[200px] bottom-32 z-50 object-contain"
        priority
      />

      {/* Main content - aligned to the left */}
      <div className="flex flex-1  relative z-10 px-44 pt-16">
        <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-[650px] max-w-4xl overflow-hidden relative z-10 border border-[#F3F3F3] h-[650px]">
          
          {/* Left: OTP Form */}
          <div className="flex-1 flex flex-col justify-center px-12 py-14 md:py-10 max-w-[480px]">
            <h1 className="text-[2rem] w-[511px] md:text-[2.1rem] font-medium text-[#232323] mb-2 leading-tight" style={{ fontFamily: 'Inter' }}>
              Verify Your Number to Secure<br />Your Account
            </h1>
            <h2 className="text-[1.6rem] font-bold text-[#232323] mb-4 mt-4" style={{ fontFamily: 'Inter' }}>OTP Verification</h2>
            <p className="text-[#232323] mb-1 text-[1.08rem] w-[400px]" style={{ fontFamily: 'Inter' }}>
              A one-time password will be sent to this <span className="font-extrabold">Mobile Number</span> for verification.
            </p>
            <div className="flex items-center gap-2 mb-8 mt-2">
              <span className="font-extrabold text-lg" style={{ fontFamily: 'Inter' }}>{mobileNumber}</span>
              {/* <button className="ml-1 text-gray-400 hover:text-amber-400" aria-label="Edit number">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button> */}
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-6 mb-8">
              {otp.map((digit, index) => (
                <div key={index} className="w-[72px] h-[72px] flex items-center justify-center">
                  <input
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full h-full bg-gray-100 text-center text-2xl font-extrabold rounded-full border-2 border-[#F5BC1C] focus:border-[#F5BC1C] focus:outline-none transition-all text-[#232323] placeholder:text-[#C7C7C7]"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{ fontFamily: 'Inter', fontSize: '2rem' }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center mb-8">
              <span className="text-[#232323] mr-2 text-[1.08rem]" style={{ fontFamily: 'Inter' }}>Do not send OTP?</span>
              <button 
                className="text-[#FF9900] font-bold hover:underline text-[1.08rem]"
                onClick={handleSendOtp}
                style={{ fontFamily: 'Inter' }}
              >
                Send OTP
              </button>
            </div>

            <button 
              className={`bg-[#F5BC1C] hover:bg-[#FFB800] text-white font-extrabold py-3 px-6 rounded-[8px] w-[220px] transition-colors text-[1.15rem] shadow-sm ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
              onClick={handleContinue}
              disabled={isProcessing}
              style={{ fontFamily: 'Inter' }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={() => setShowErrorModal(false)}></div>
          <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 max-w-md mx-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-500">Invalid Input</h3>
              <button onClick={() => setShowErrorModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Please enter only numeric values (0-9) for OTP verification.</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowErrorModal(false)}
                className="bg-[#F5BC1C] text-white px-4 py-2 rounded font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wave Background Component */}
      <WaveBackground height={180} />
    </div>
  );
}
