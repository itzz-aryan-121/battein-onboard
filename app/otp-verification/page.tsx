'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import './styles.css';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpSentRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phone = searchParams.get('phoneNumber');
    if (phone && !otpSentRef.current) {
      setMobileNumber('+91 - ' + phone);
      handleSendOtp(phone);
      otpSentRef.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '') {
        if (index < 3) {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) nextInput.focus();
        } else if (index === 3) {
          const allFilled = newOtp.every(digit => digit !== '');
          if (allFilled) {
            setTimeout(() => {
              handleVerifyOtp(newOtp.join(''));
            }, 100);
          }
        }
      }
    } else {
      setErrorMessage('Please enter only numeric values (0-9) for OTP verification.');
      setShowErrorModal(true);
      const currentInput = document.getElementById(`otp-${index}`);
      if (currentInput) {
        currentInput.classList.add('shake');
        setTimeout(() => {
          currentInput.classList.remove('shake');
        }, 500);
      }
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

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  interface SendOtpRequest {
    phoneNumber: string;
    otp: string;
  }

  interface SendOtpResponse {
    success: boolean;
  }

  const sendOtpToPhone = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpCode } as SendOtpRequest)
      });

      const result: SendOtpResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const handleSendOtp = async (phoneNumber: string | null | undefined = null) => {
    const phone = phoneNumber || searchParams.get('phoneNumber');
    if (!phone) {
      setErrorMessage('Phone number not found. Please go back and enter your phone number.');
      setShowErrorModal(true);
      return;
    }

    setIsSendingOtp(true);

    try {
      const newOtp = generateOtp();
      sessionStorage.setItem('generatedOtp', newOtp);
      sessionStorage.setItem('otpPhone', phone);
      sessionStorage.setItem('otpTimestamp', Date.now().toString());

      const success = await sendOtpToPhone(phone, newOtp);

      if (success) {
        setOtpSent(true);
        setCountdown(60);
        console.log('OTP sent successfully to:', phone);
        console.log('Generated OTP:', newOtp); // Remove in prod
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error in handleSendOtp:', error);
      setErrorMessage('Failed to send OTP. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (enteredOtp: string): Promise<void> => {
    setIsProcessing(true);

    try {
      const storedOtp = sessionStorage.getItem('generatedOtp');
      const storedPhone = sessionStorage.getItem('otpPhone');
      const otpTimestamp = sessionStorage.getItem('otpTimestamp');

      if (!storedOtp || !storedPhone || !otpTimestamp) {
        setErrorMessage('OTP session expired. Please request a new OTP.');
        setShowErrorModal(true);
        setIsProcessing(false);
        return;
      }

      const currentTime = Date.now();
      const otpAge = currentTime - parseInt(otpTimestamp);
      if (otpAge > 300000) {
        setErrorMessage('OTP has expired. Please request a new OTP.');
        setShowErrorModal(true);
        setIsProcessing(false);
        sessionStorage.clear();
        return;
      }

      if (enteredOtp === storedOtp) {
        sessionStorage.clear();
        console.log('OTP verified successfully');
        setTimeout(() => {
          router.push('/partner-details');
        }, 1500);
      } else {
        setErrorMessage('Invalid OTP. Please check and try again.');
        setShowErrorModal(true);
        setIsProcessing(false);
        setOtp(['', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Verification failed. Please try again.');
      setShowErrorModal(true);
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setErrorMessage('Please enter complete 4-digit OTP.');
      setShowErrorModal(true);
      return;
    }
    handleVerifyOtp(enteredOtp);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col overflow-hidden">
      <Image 
        src="/assets/yo-girl.png" 
        alt="Illustration" 
        width={453} 
        height={520}
        className="absolute right-[200px] bottom-32 z-50 object-contain"
        priority
      />

      <div className="flex flex-1 relative z-10 px-44 pt-16">
        <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-[650px] max-w-4xl overflow-hidden relative z-10 border border-[#F3F3F3] h-[650px]">
          
          <div className="flex-1 flex flex-col justify-center px-12 py-14 md:py-10 max-w-[480px]">
            <h1 className="text-[2rem] w-[511px] md:text-[2.1rem] font-medium text-[#232323] mb-2 leading-tight" style={{ fontFamily: 'Inter' }}>
              Verify Your Number to Secure<br />Your Account
            </h1>
            <h2 className="text-[1.6rem] font-bold text-[#232323] mb-4 mt-4" style={{ fontFamily: 'Inter' }}>OTP Verification</h2>
            <p className="text-[#232323] mb-1 text-[1.08rem] w-[400px]" style={{ fontFamily: 'Inter' }}>
              A one-time password {otpSent ? 'has been sent' : 'will be sent'} to this <span className="font-extrabold">Mobile Number</span> for verification.
            </p>
            <div className="flex items-center gap-2 mb-8 mt-2">
              <span className="font-extrabold text-lg" style={{ fontFamily: 'Inter' }}>{mobileNumber}</span>
            </div>

            {otpSent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  ✓ OTP sent successfully to your mobile number
                </p>
              </div>
            )}

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
                    disabled={isProcessing}
                    style={{ fontFamily: 'Inter', fontSize: '2rem' }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center mb-8">
              <span className="text-[#232323] mr-2 text-[1.08rem]" style={{ fontFamily: 'Inter' }}>
                {otpSent ? "Didn't receive OTP?" : "Need to send OTP?"}
              </span>
              <button 
                className={`text-[#FF9900] font-bold hover:underline text-[1.08rem] button-animate ${
                  (isSendingOtp || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handleSendOtp()}
                disabled={isSendingOtp || countdown > 0}
                style={{ fontFamily: 'Inter' }}
              >
                {isSendingOtp ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
              </button>
            </div>

            <button 
              className={`bg-[#F5BC1C] hover:bg-[#FFB800] text-white font-extrabold py-3 px-6 rounded-[8px] w-[220px] transition-colors text-[1.15rem] shadow-sm ${
                (isProcessing || otp.join('').length !== 4) ? 'opacity-80 cursor-not-allowed' : ''
              } button-animate`}
              onClick={handleContinue}
              disabled={isProcessing || otp.join('').length !== 4}
              style={{ fontFamily: 'Inter' }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowErrorModal(false)}></div>
          <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 max-w-md mx-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-500">Error</h3>
              <button onClick={() => setShowErrorModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">{errorMessage}</p>
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

      <WaveBackground height={180} />
    </div>
  );
}
