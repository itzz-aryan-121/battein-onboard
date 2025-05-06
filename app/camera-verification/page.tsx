'use client'

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function CameraVerificationPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  
  // Show entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Start auto-capture countdown when camera is active
  useEffect(() => {
    if (cameraActive && !capturedPhoto && !error && !countdown) {
      // Give the user a moment to position their face
      setTimeout(() => {
        setScanning(true);
        setCountdown(3);
      }, 2000);
    }
  }, [cameraActive, capturedPhoto, error, countdown]);
  
  // Handle countdown for auto-capture
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto capture when countdown reaches 0
      autoCapture();
    }
  }, [countdown]);
  
  // Auto proceed to next page after capturing photo
  useEffect(() => {
    if (capturedPhoto) {
      // Save captured photo to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('capturedPhoto', capturedPhoto);
      }
      
      // Display the captured photo for a moment before proceeding
      const timer = setTimeout(() => {
        router.push('/facial-success');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [capturedPhoto, router]);
  
  // Handle camera errors
  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    
    let errorMessage = 'Failed to access camera.';
    
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Camera access denied. Please allow camera access in your browser settings.';
          break;
        case 'NotFoundError':
          errorMessage = 'No camera found on this device.';
          break;
        case 'NotReadableError':
          errorMessage = 'Camera is already in use by another application.';
          break;
        default:
          errorMessage = `Camera error: ${error.message || error.name}`;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
  };
  
  // Handle webcam load success
  const handleWebcamLoad = () => {
    setCameraActive(true);
    setError(null);
  };
  
  // Auto capture photo from webcam
  const autoCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
        setScanning(false);
        setCountdown(null);
      } else {
        setError('Failed to capture photo. Please try again.');
        setScanning(false);
        setCountdown(null);
      }
    }
  }, [webcamRef]);
  
  // Manual capture photo from webcam
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
        setScanning(false);
        setCountdown(null);
      } else {
        setError('Failed to capture photo. Please try again.');
      }
    }
  }, [webcamRef]);
  
  // Switch between front and back camera
  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    // Reset countdown when switching camera
    setCountdown(null);
    setScanning(false);
  };
  
  // Retry after error
  const retryCamera = () => {
    setError(null);
    setCountdown(null);
    setScanning(false);
    // Force remounting of Webcam component
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
    }, 100);
  };

  // Webcam configuration
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 relative z-10 w-full max-w-5xl mx-auto">
          <h1 className="text-center text-2xl font-medium text-gray-600 mb-6">
            {scanning ? 'Hold still, scanning your face...' : 'Please position your face in the frame'}
          </h1>
          
          {/* Camera View */}
          <div className={`relative mx-auto w-full max-w-lg mb-6 ${showAnimation ? 'animate-fadeIn' : ''}`}>
            {/* Camera Outline Frame */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 border-2 border-gray-300">
              
              {/* Error State */}
              {error && (
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-4 z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-800 mb-2">Camera Access Error</p>
                  <p className="text-gray-600 mb-4">{error}</p>
                  
                  <button 
                    onClick={retryCamera}
                    className="bg-[#F5BC1C] text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {/* Loading State */}
              {!error && !cameraActive && !capturedPhoto && (
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-4 z-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5BC1C] mb-4"></div>
                  <p className="text-gray-600">Initializing camera...</p>
                </div>
              )}
              
              {/* Webcam */}
              {!capturedPhoto && !error && (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMedia={handleWebcamLoad}
                  onUserMediaError={handleCameraError}
                  className="w-full h-full object-cover"
                  style={{ 
                    display: cameraActive && !capturedPhoto ? 'block' : 'none',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                  }}
                />
              )}
              
              {/* Captured Photo Display */}
              {capturedPhoto && (
                <img 
                  src={capturedPhoto} 
                  alt="Captured" 
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                  }}
                />
              )}
              
              {/* Countdown display */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="bg-[#F5BC1C] text-white font-bold text-5xl w-24 h-24 rounded-full flex items-center justify-center animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}
              
              {/* Face Frame Overlay */}
              {(cameraActive || capturedPhoto) && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className={`w-4/5 h-4/5 border-2 ${scanning ? 'border-[#F5BC1C]' : 'border-white'} rounded-xl`}></div>
                  {/* Horizontal scanner line animation */}
                  {cameraActive && !capturedPhoto && scanning && (
                    <div className="absolute w-4/5 h-0.5 bg-[#F5BC1C] animate-scanLine"></div>
                  )}
                </div>
              )}
              
              {/* Corner frame markers */}
              {(cameraActive || capturedPhoto) && !error && (
                <>
                  <div className={`absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 ${scanning ? 'border-[#F5BC1C]' : 'border-white'} rounded-tl-lg z-10`}></div>
                  <div className={`absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 ${scanning ? 'border-[#F5BC1C]' : 'border-white'} rounded-tr-lg z-10`}></div>
                  <div className={`absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 ${scanning ? 'border-[#F5BC1C]' : 'border-white'} rounded-bl-lg z-10`}></div>
                  <div className={`absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 ${scanning ? 'border-[#F5BC1C]' : 'border-white'} rounded-br-lg z-10`}></div>
                </>
              )}
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {cameraActive && !capturedPhoto && !error && !scanning && (
              <>
                <button
                  onClick={switchCamera}
                  className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors"
                  aria-label="Switch Camera"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
                
                <button
                  onClick={capturePhoto}
                  className="bg-[#F5BC1C] p-4 rounded-full hover:bg-[#e5ac0f] transition-colors"
                  aria-label="Take Photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </>
            )}
            
            {scanning && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <p className="text-lg font-medium">Scanning your face...</p>
              </div>
            )}
            
            {capturedPhoto && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <p className="text-lg font-medium">Processing your photo...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="w-full absolute bottom-0 left-0 right-0">
        <img 
          src="/assets/wave-bottom.png" 
          alt="Wave" 
          className="w-full object-cover h-32"
        />
      </div>
    </div>
  );
} 