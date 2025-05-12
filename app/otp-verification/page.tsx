'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [mobileNumber, setMobileNumber] = useState('');
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
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
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
    // Navigate to partner-details page regardless of the OTP
    router.push('/partner-details');
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
        className="absolute right-[325px] bottom-24 z-0 object-contain"
        priority
      />

      {/* Main content - aligned to the left */}
      <div className="flex flex-1 items-start justify-start relative z-10 px-12 pt-12">
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
              <button className="ml-1 text-gray-400 hover:text-amber-400" aria-label="Edit number">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
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
                    className="w-full h-full bg-transparent text-center text-2xl font-extrabold rounded-full border-2 border-[#F5BC1C] focus:border-[#F5BC1C] focus:outline-none transition-all text-[#232323] placeholder:text-[#C7C7C7]"
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
              className="bg-[#F5BC1C] hover:bg-[#FFB800] text-white font-extrabold py-3 px-6 rounded-[8px] w-[220px] transition-colors text-[1.15rem] shadow-sm"
              onClick={handleContinue}
              style={{ fontFamily: 'Inter' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Waves at the bottom */}
      <div className="w-full absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '180px' }}>
        <img 
          src="/assets/wave-bottom-yellow.png" 
          alt="Wave" 
          className="w-full absolute bottom-0 left-0 right-0 object-cover"
          style={{ height: '180px' }}
        />
        <div className="absolute bottom-0 left-0 right-0" style={{ opacity: 0.4, transform: 'translateY(-40px)' }}>
          <img 
            src="/assets/wave-middle.png" 
            alt="Wave Middle" 
            className="w-full object-cover"
            style={{ height: '100px' }}
          />
        </div>
        <div className="absolute bottom-0 w-full">
          <div className="absolute left-[10%] bottom-[40px]">
            <div className="bg-[#F5BC1C] opacity-20 rounded-full" style={{ width: '30px', height: '30px' }}></div>
          </div>
          <div className="absolute right-[15%] bottom-[80px]">
            <div className="bg-[#F5BC1C] opacity-30 rounded-full" style={{ width: '20px', height: '20px' }}></div>
          </div>
          <div className="absolute left-[30%] bottom-[60px]">
            <div className="bg-[#F5BC1C] opacity-25 rounded-full" style={{ width: '15px', height: '15px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
