'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import '../animations.css';
import './styles.css';
import { useLanguage } from '../context/LanguageContext';

export default function OtpVerification() {
  const { t } = useLanguage();
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
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    subheader: false,
    description: false,
    phoneNumber: false,
    successMessage: false,
    otpInputs: false,
    resendSection: false,
    continueButton: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, subheader: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, description: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, phoneNumber: true })), 800),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, successMessage: true })), 1000),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, otpInputs: true })), 1200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, resendSection: true })), 1400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, continueButton: true })), 1600),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

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

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/otp-verification');
  }, []);

  interface OtpDigit {
    index: number;
    value: string;
  }

  const handleChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp: string[] = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '') {
        if (index < 3) {
          const nextInput: HTMLElement | null = document.getElementById(`otp-${index + 1}`);
          if (nextInput) nextInput.focus();
        } else if (index === 3) {
          const allFilled: boolean = newOtp.every((digit: string) => digit !== '');
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
      const currentInput: HTMLElement | null = document.getElementById(`otp-${index}`);
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

  interface KeyboardEvent {
    key: string;
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const prevInput: HTMLElement | null = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  interface SendOtpResponse {
    success: boolean;
  }

  const sendOtpToPhone = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpCode })
      });
      const result: SendOtpResponse = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const handleSendOtp = async (phoneNumber: string | null = null) => {
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

  interface VerifyOtpResult {
    success: boolean;
    message?: string;
  }

  const handleVerifyOtp = async (enteredOtp: string): Promise<void> => {
    setIsProcessing(true);
    try {
      const storedOtp: string | null = sessionStorage.getItem('generatedOtp');
      const storedPhone: string | null = sessionStorage.getItem('otpPhone');
      const otpTimestamp: string | null = sessionStorage.getItem('otpTimestamp');

      if (!storedOtp || !storedPhone || !otpTimestamp) {
        setErrorMessage('OTP session expired. Please request a new OTP.');
        setShowErrorModal(true);
        setIsProcessing(false);
        return;
      }

      const currentTime: number = Date.now();
      const otpAge: number = currentTime - parseInt(otpTimestamp);
      if (otpAge > 300000) {
        setErrorMessage('OTP has expired. Please request a new OTP.');
        setShowErrorModal(true);
        setIsProcessing(false);
        sessionStorage.clear();
        return;
      }

      if (enteredOtp === storedOtp) {
        sessionStorage.clear();
        localStorage.removeItem('partnerId');
        localStorage.removeItem('partnerDetails');
        router.push('/partner-details');
      } else {
        setErrorMessage('Invalid OTP. Please check and try again.');
        setShowErrorModal(true);
        setIsProcessing(false);
        setOtp(['', '', '', '']);
        const firstInput: HTMLElement | null = document.getElementById('otp-0');
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
    <div className="relative min-h-screen bg-white flex flex-col overflow-hidden px-4 sm:px-6 lg:px-12 py-6 sm:py-8 animate-pageEnter">
      {/* Centered flex container for OTP and illustration */}
      <div className="flex flex-1 min-h-[80vh] items-center justify-center xl:justify-center xl:items-center w-full max-w-7xl mx-auto">
        {/* OTP Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-xl overflow-hidden relative z-10 border border-gray-200 p-6 sm:p-8 lg:p-14 animate-cardEntrance">
          {/* Header */}
          <h1 className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-golden-shine mb-2 sm:mb-3 leading-tight font-inter transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
            {t('otp', 'title')}
          </h1>
          
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-golden-shine mb-3 sm:mb-4 mt-2 sm:mt-4 font-inter transition-all duration-500 ${animatedElements.subheader ? 'animate-contentReveal' : 'animate-on-load'}`}>
            {t('otp', 'subtitle')}
          </h2>
          
          <p className={`text-gray-700 mb-1 text-sm sm:text-base lg:text-lg font-inter leading-relaxed transition-all duration-500 ${animatedElements.description ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {t('otp', 'description')}{' '}
            <span className="font-extrabold text-golden-shine">{t('otp', 'mobileNumber')}</span> {t('otp', 'description').includes('verification') ? '' : 'for verification.'}
          </p>
          
          <div className={`flex items-center gap-2 mb-4 sm:mb-6 mt-2 transition-all duration-500 ${animatedElements.phoneNumber ? 'animate-fadeInLeft' : 'animate-on-load'}`}>
            <span className="font-extrabold text-base sm:text-lg font-inter break-all text-golden-shine">
              {mobileNumber}
            </span>
          </div>

          {/* Success message */}
          {otpSent && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-500 ${animatedElements.successMessage ? 'animate-scaleIn' : 'animate-on-load'}`}>
              <p className="text-green-700 text-xs sm:text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('otp', 'otpSentSuccess')}
              </p>
            </div>
          )}

          {/* OTP Input Fields */}
          <div className={`flex gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 transition-all duration-500 ${animatedElements.otpInputs ? 'animate-fadeInUp stagger-fast' : 'animate-on-load'}`}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 text-center text-xl sm:text-2xl font-extrabold rounded-xl sm:rounded-2xl border-2 border-yellow-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all text-gray-900 placeholder-gray-400 font-inter touch-manipulation"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isProcessing}
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className={`flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 gap-2 sm:gap-0 transition-all duration-500 ${animatedElements.resendSection ? 'animate-fadeInRight' : 'animate-on-load'}`}>
            <span className="text-gray-700 sm:mr-2 text-sm sm:text-base font-inter text-center sm:text-left">
              {otpSent ? <span className="text-golden-shine">{t('otp', 'didntReceive')}</span> : t('otp', 'needToSend')}
            </span>
            <button 
              className={`text-orange-600 font-bold hover:underline text-sm sm:text-base  min-h-[44px] px-2 touch-manipulation ${
                (isSendingOtp || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
              } font-inter  duration-200 hover-scale`}
              onClick={() => handleSendOtp()}
              disabled={isSendingOtp || countdown > 0}
            >
              {isSendingOtp ? t('otp', 'sending') : countdown > 0 ? `${t('otp', 'resendIn')} ${countdown}s` : t('otp', 'sendOtp')}
            </button>
          </div>

          {/* Continue Button */}
          <button 
            className={`bg-[#F5BC1C] hover:bg-yellow-500 text-white font-extrabold py-3 sm:py-4 px-6 rounded-lg w-full transition-all duration-200 text-base sm:text-lg shadow-sm min-h-[48px] touch-manipulation ${
              (isProcessing || otp.join('').length !== 4) ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md hover-glow'
            } font-inter ${animatedElements.continueButton ? 'animate-buttonGlow' : 'animate-on-load'}`}
            onClick={handleContinue}
            disabled={isProcessing || otp.join('').length !== 4}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                {t('otp', 'verifying')}
              </div>
            ) : (
              t('otp', 'continue')
            )}
          </button>
        </div>
        {/* Illustration - attached to OTP box on xl screens */}
        <div className="hidden xl:flex items-center justify-center ml-12 h-full">
          <Image 
            src="/assets/yo-girl.png" 
            alt="Illustration" 
            width={300} 
            height={500}
            className="object-contain z-50 animate-fadeInRight"
            priority
          />
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowErrorModal(false)}></div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl relative z-10 max-w-sm sm:max-w-md mx-auto w-full animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-red-500">{t('otp', 'error')}</h3>
              <button 
                onClick={() => setShowErrorModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{errorMessage}</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowErrorModal(false)}
                className="bg-[#F5BC1C] hover:bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors min-h-[44px] touch-manipulation"
              >
                {t('otp', 'ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wave Background */}
      <WaveBackground height={120} />
    </div>
  );
}
