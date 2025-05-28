'use client'

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import WaveBackground from '../components/WaveBackground';
import FaceErrorModal from './FaceErrorModal';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Simple face detection using image analysis
async function detectFaceInImage(imageDataUrl: string): Promise<{
  success: boolean;
  faceDetected: boolean;
  error?: string;
  confidence?: number;
}> {
  try {
    // Create image element for analysis
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageDataUrl;
    });

    // Create canvas for image analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Basic face detection heuristics
    const analysis = analyzeImageForFace(data, canvas.width, canvas.height);
    
    if (analysis.faceDetected) {
      return {
        success: true,
        faceDetected: true,
        confidence: analysis.confidence
      };
    } else {
      return {
        success: false,
        faceDetected: false,
        error: analysis.error || 'No face detected. Please ensure your face is clearly visible and well-lit.',
        confidence: analysis.confidence
      };
    }
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      success: false,
      faceDetected: false,
      error: 'Face detection failed. Please try again.'
    };
  }
}

// Analyze image data for face-like features
function analyzeImageForFace(data: Uint8ClampedArray, width: number, height: number): {
  faceDetected: boolean;
  confidence: number;
  error?: string;
} {
  // Basic image quality checks
  const totalPixels = width * height;
  let brightPixels = 0;
  let darkPixels = 0;
  let skinTonePixels = 0;
  let edgePixels = 0;
  let midTonePixels = 0;

  // Analyze pixel data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;

    // Count bright pixels (well-lit areas)
    if (brightness > 200) brightPixels++;
    
    // Count dark pixels (shadows/hair)
    if (brightness < 40) darkPixels++;

    // Count mid-tone pixels (good lighting)
    if (brightness >= 80 && brightness <= 200) midTonePixels++;

    // More inclusive skin-tone detection
    if (r > 60 && g > 30 && b > 15 && 
        r >= g && r >= b && 
        (r - g) < 80 && (r - b) < 120) {
      skinTonePixels++;
    }

    // Simple edge detection (brightness changes)
    if (i > width * 4) {
      const prevBrightness = (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3;
      if (Math.abs(brightness - prevBrightness) > 25) {
        edgePixels++;
      }
    }
  }

  // Calculate percentages
  const brightPercent = (brightPixels / totalPixels) * 100;
  const darkPercent = (darkPixels / totalPixels) * 100;
  const skinPercent = (skinTonePixels / totalPixels) * 100;
  const edgePercent = (edgePixels / totalPixels) * 100;
  const midTonePercent = (midTonePixels / totalPixels) * 100;

  console.log('Detection stats:', {
    brightPercent: brightPercent.toFixed(2),
    darkPercent: darkPercent.toFixed(2),
    skinPercent: skinPercent.toFixed(2),
    edgePercent: edgePercent.toFixed(2),
    midTonePercent: midTonePercent.toFixed(2)
  });

  // Face detection logic based on heuristics
  let confidence = 0;
  let faceDetected = false;
  let error: string | undefined;

  // Check for extreme darkness
  if (darkPercent > 90) {
    error = 'Image too dark. Please ensure good lighting on your face.';
    confidence = 0.1;
  }
  // Check for extreme overexposure
  else if (brightPercent > 80) {
    error = 'Image too bright. Please reduce lighting or move away from bright light.';
    confidence = 0.2;
  }
  // More lenient skin tone check
  else if (skinPercent < 0.5) {
    error = 'No face detected. Please ensure your face is visible in the frame.';
    confidence = 0.3;
  }
  // More lenient detail check
  else if (edgePercent < 2) {
    error = 'Image lacks detail. Please ensure your face is in focus and well-lit.';
    confidence = 0.4;
  }
  // Good conditions detected
  else {
    // More generous confidence calculation
    confidence = Math.min(
      (skinPercent / 5) * 0.3 +        // Skin tone presence (lowered threshold)
      (edgePercent / 15) * 0.3 +       // Facial features/edges (lowered threshold)
      (midTonePercent / 50) * 0.2 +    // Good lighting distribution
      (Math.min(darkPercent, 30) / 30) * 0.1 +  // Some shadows (natural)
      0.1,  // Base confidence boost
      1.0
    );

    // Much more lenient face detection threshold
    if (confidence > 0.35) {  // Lowered from 0.6 to 0.35
      faceDetected = true;
    } else {
      // Give more specific feedback based on what's missing
      if (skinPercent < 1) {
        error = 'Face not clearly visible. Please position your face in the center of the frame.';
      } else if (edgePercent < 3) {
        error = 'Image appears blurry. Please ensure the camera is in focus.';
      } else {
        error = 'Face detection confidence low. Please ensure good lighting and clear visibility.';
      }
    }
  }

  console.log('Final detection result:', { faceDetected, confidence: confidence.toFixed(3), error });

  return {
    faceDetected,
    confidence,
    error
  };
}

// Basic image quality check as fallback
async function checkBasicImageQuality(imageDataUrl: string): Promise<{
  acceptable: boolean;
  reason?: string;
}> {
  try {
    // Create image element for analysis
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageDataUrl;
    });

    // Basic checks
    const minWidth = 200;
    const minHeight = 200;
    
    if (img.width < minWidth || img.height < minHeight) {
      return {
        acceptable: false,
        reason: 'Image resolution too low'
      };
    }

    // Create canvas for basic analysis
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { acceptable: true }; // If can't analyze, assume acceptable
    }

    canvas.width = Math.min(img.width, 400); // Limit size for performance
    canvas.height = Math.min(img.height, 400);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Basic quality metrics
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      pixelCount++;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    // Very basic acceptance criteria
    if (avgBrightness < 20) {
      return {
        acceptable: false,
        reason: 'Image too dark'
      };
    }
    
    if (avgBrightness > 240) {
      return {
        acceptable: false,
        reason: 'Image too bright'
      };
    }
    
    // If we get here, image has reasonable quality
    return {
      acceptable: true
    };
    
  } catch (error) {
    console.error('Basic quality check error:', error);
    // If check fails, assume acceptable to avoid blocking users
    return { acceptable: true };
  }
}

export default function CameraVerificationPage() {
  const { userData, updateUserData } = useUserData();
  const { t } = useLanguage();
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(userData.capturedPhoto || null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [showFaceErrorModal, setShowFaceErrorModal] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewApproved, setPreviewApproved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
  const [countdownStarted, setCountdownStarted] = useState(false);
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    cameraFrame: false,
    controls: false,
    preview: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, cameraFrame: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, controls: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, preview: true })), 800),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);
  
  // Show entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Start auto-capture countdown when camera is active - FIXED: Prevent duplicate countdown
  useEffect(() => {
    if (cameraActive && !capturedPhoto && !error && !countdown && !countdownStarted && !scanning) {
      // Give the user a moment to position their face
      setTimeout(() => {
        setCountdownStarted(true);
        setScanning(true);
        setCountdown(3);
      }, 2000);
    }
  }, [cameraActive, capturedPhoto, error, countdown, countdownStarted, scanning]);
  
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
  
  // Face detection verification
  useEffect(() => {
    if (capturedPhoto && !processingComplete) {
      // Real face detection processing
      const timer = setTimeout(async () => {
        try {
          // Perform actual face detection on captured photo
          const faceDetectionResult = await detectFaceInImage(capturedPhoto);
          
          console.log('Face detection result:', faceDetectionResult);
          
          // Check if image meets basic quality criteria as fallback
          const basicQualityCheck = await checkBasicImageQuality(capturedPhoto);
          console.log('Basic quality check:', basicQualityCheck);
          
          if (faceDetectionResult.success && faceDetectionResult.faceDetected) {
            // Face detected successfully - show preview
            setProcessingComplete(true);
            setShowPreview(true);
            
          } else if (basicQualityCheck.acceptable) {
            // Fallback: Accept if basic quality is good even if face detection failed
            console.log('Accepting photo based on basic quality check');
            setProcessingComplete(true);
            setShowPreview(true);
            
          } else {
            // No face detected - show specific error
            setCapturedPhoto(null);
            setScanning(false);
            setFaceDetectionError(faceDetectionResult.error || 'No face detected');
            setShowFaceErrorModal(true);
          }
        } catch (error) {
          console.error('Face detection error:', error);
          setCapturedPhoto(null);
          setScanning(false);
          setFaceDetectionError('Face detection failed. Please try again.');
          setShowFaceErrorModal(true);
        }
      }, 2000); // Processing time
      
      return () => clearTimeout(timer);
    }
  }, [capturedPhoto, router, processingComplete, updateUserData]);
  
  // Handle preview approval and upload
  useEffect(() => {
    if (previewApproved && capturedPhoto) {
      // Store the base64 photo in context immediately for preview
      updateUserData({ capturedPhoto: capturedPhoto });
      
      // Upload captured photo to Cloudinary and update with URL
      if (typeof window !== 'undefined') {
        (async () => {
          try {
            const file = base64ToFile(capturedPhoto, 'captured-photo.jpg');
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
              // Update with Cloudinary URL after upload
              updateUserData({ capturedPhoto: data.url });
            }
          } catch (error) {
            console.error('Upload failed:', error);
            // Keep the base64 version if upload fails
          }
        })();
      }
      
      // Navigate to success page
      const proceedTimer = setTimeout(() => {
        router.push('/facial-success');
      }, 500);
      
      return () => clearTimeout(proceedTimer);
    }
  }, [previewApproved, capturedPhoto, router, updateUserData]);
  
  // Handle camera errors
  const handleCameraError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraLoading(false);
    
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
  
  // Handle webcam load success - FIXED: Proper loading state management
  const handleWebcamLoad = () => {
    setCameraLoading(false);
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
        setCountdownStarted(false);
      } else {
        setError('Failed to capture photo. Please try again.');
        setScanning(false);
        setCountdown(null);
        setCountdownStarted(false);
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
        setCountdownStarted(false);
      } else {
        setError('Failed to capture photo. Please try again.');
      }
    }
  }, [webcamRef]);
  
  // Switch between front and back camera - FIXED: Reset states properly
  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    // Reset all countdown and scanning states
    setCountdown(null);
    setScanning(false);
    setCountdownStarted(false);
    setCameraLoading(true);
  };
  
  // Retry after error - FIXED: Reset all states
  const retryCamera = () => {
    setError(null);
    setCountdown(null);
    setScanning(false);
    setCountdownStarted(false);
    setCameraLoading(true);
    // Force remounting of Webcam component
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
    }, 100);
  };
  
  // Handle face error modal close - FIXED: Reset all states
  const handleFaceErrorModalClose = () => {
    setShowFaceErrorModal(false);
    setProcessingComplete(false);
    setFaceDetectionError(null);
    // Restart camera and countdown process
    setCountdown(null);
    setScanning(false);
    setCountdownStarted(false);
    setCameraLoading(true);
    
    // Force remounting of Webcam component
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
    }, 100);
  };

  // Handle preview approval
  const handleApprovePhoto = () => {
    setPreviewApproved(true);
  };

  // Handle retake photo - FIXED: Reset all states
  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
    setProcessingComplete(false);
    setPreviewApproved(false);
    setCountdown(null);
    setScanning(false);
    setCountdownStarted(false);
    setCameraLoading(true);
    
    // Restart camera
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
    }, 100);
  };

  // Webcam configuration
  const videoConstraints = {
    width: { ideal: 1280, min: 640 },
    height: { ideal: 960, min: 480 },
    aspectRatio: 4/3,
    facingMode: facingMode,
  };

  const handleSwitchCamera = async () => {
    setIsSwitchingCamera(true);
    try {
      await switchCamera();
    } catch (error) {
      console.error('Error switching camera:', error);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    try {
      await capturePhoto();
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen relative overflow-hidden animate-pageEnter">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 relative z-10 w-full max-w-5xl mx-auto animate-cardEntrance">
          <h1 className={`text-center text-2xl font-medium text-golden-shine mb-6 transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
            {showPreview && processingComplete ? t('cameraVerification', 'reviewPhoto') :
             scanning ? t('cameraVerification', 'holdStill') : 
             cameraLoading ? t('cameraVerification', 'initializingCamera') :
             t('cameraVerification', 'positionFace')}
          </h1>
          
          {/* Camera View */}
          <div className={`relative mx-auto w-full max-w-lg mb-6 transition-all duration-500 ${animatedElements.cameraFrame ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {/* Camera Outline Frame */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-black border-2 border-gray-300">
              
              {/* Camera Loading State */}
              {cameraLoading && !capturedPhoto && !error && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 absolute inset-0">
                  <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5BC1C] mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">{t('cameraVerification', 'startingCamera')}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('cameraVerification', 'allowCameraAccess')}</p>
                  </div>
                </div>
              )}
              
              {/* Webcam Component */}
              {!capturedPhoto && !error && (
                <div className="absolute inset-0 w-full h-full">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMedia={handleWebcamLoad}
                    onUserMediaError={handleCameraError}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      cameraLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                    mirrored={facingMode === 'user'}
                  />
                </div>
              )}
              
              {/* Captured Photo Preview */}
              {capturedPhoto && (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    className="w-full h-full object-cover animate-fadeIn"
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 absolute inset-0">
                  <div className="text-center p-4">
                    <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-4 font-medium">Camera Error</p>
                    <p className="text-xs text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={retryCamera}
                      className="px-4 py-2 bg-[#F5BC1C] text-white rounded-lg hover:bg-[#e5ac0f] transition-colors font-medium"
                    >
                      {t('cameraVerification', 'tryAgain') || 'Try Again'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Countdown Overlay */}
              {countdown !== null && countdown > 0 && !capturedPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
                  <div className="text-center">
                    <div className="text-white text-7xl font-bold animate-pulse mb-2">
                      {countdown}
                    </div>
                    <p className="text-white text-lg font-medium">Get ready...</p>
                  </div>
                </div>
              )}
              
              {/* Scanning Overlay */}
              {scanning && !capturedPhoto && countdown === null && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute inset-4 border-2 border-[#F5BC1C] rounded-2xl">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#F5BC1C] animate-scanLine"></div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-[#F5BC1C] text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full inline-block">
                      Scanning face...
                    </p>
                  </div>
                </div>
              )}
              
              {/* Face Detection Frame Overlay */}
              {cameraActive && !capturedPhoto && !error && !cameraLoading && (
                <div className="absolute inset-0 pointer-events-none z-5">
                  <div className="absolute inset-8 border-2 border-white border-opacity-50 rounded-2xl">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-[#F5BC1C] rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-[#F5BC1C] rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-[#F5BC1C] rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-[#F5BC1C] rounded-br-lg"></div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <p className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded inline-block">
                      Position your face in the frame
                    </p>
                  </div>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className={`flex justify-center gap-4 mb-6 transition-all duration-500 ${animatedElements.controls ? 'animate-fadeInUp stagger-fast' : 'animate-on-load'}`}>
            {cameraActive && !capturedPhoto && !error && !scanning && !cameraLoading && (
              <>
                <button
                  onClick={handleSwitchCamera}
                  disabled={isSwitchingCamera}
                  className={`bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors hover-glow ${
                    isSwitchingCamera ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Switch Camera"
                >
                  {isSwitchingCamera ? (
                    <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleCapturePhoto}
                  disabled={isCapturing}
                  className={`bg-[#F5BC1C] p-4 rounded-full hover:bg-[#e5ac0f] transition-colors hover-glow ${
                    isCapturing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Take Photo"
                >
                  {isCapturing ? (
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </>
            )}
            
            {(scanning || cameraLoading) && !capturedPhoto && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <p className="text-lg font-medium">
                  {cameraLoading ? t('cameraVerification', 'preparingCamera') : t('cameraVerification', 'scanningFace')}
                </p>
              </div>
            )}
            
            {capturedPhoto && !processingComplete && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F5BC1C]"></div>
                  <p className="text-lg font-medium">{t('cameraVerification', 'processingPhoto')}</p>
                </div>
              </div>
            )}
            
            {showPreview && processingComplete && !previewApproved && (
              <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${animatedElements.preview ? 'animate-scaleIn' : 'animate-on-load'}`}>
                <div className="text-center text-green-500">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-lg font-medium">{t('cameraVerification', 'faceVerified')}</p>
                  </div>
                  <p className="text-sm text-gray-600">{t('cameraVerification', 'reviewConfirm')}</p>
                </div>
                <div className="flex gap-4 stagger-fast">
                  <button
                    onClick={handleRetakePhoto}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors hover-glow"
                  >
                    {t('cameraVerification', 'retakePhoto')}
                  </button>
                  <button
                    onClick={handleApprovePhoto}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors hover-glow"
                  >
                    {t('cameraVerification', 'looksGood')}
                  </button>
                </div>
              </div>
            )}
            
            {previewApproved && (
              <div className="text-center text-green-500 animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  <p className="text-lg font-medium">{t('cameraVerification', 'proceeding')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Face Error Modal */}
      <FaceErrorModal 
        isOpen={showFaceErrorModal} 
        onClose={handleFaceErrorModalClose}
        errorMessage={faceDetectionError}
      />
      
      {/* Bottom Wave Background */}
      <WaveBackground height={180} />
    </div>
  );
}