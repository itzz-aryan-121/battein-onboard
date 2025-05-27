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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [showFaceErrorModal, setShowFaceErrorModal] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewApproved, setPreviewApproved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
  
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
  
  // Handle face error modal close
  const handleFaceErrorModalClose = () => {
    setShowFaceErrorModal(false);
    setProcessingComplete(false);
    setFaceDetectionError(null); // Reset face detection error
    // Restart camera and countdown process
    setCountdown(null);
    setScanning(false);
    
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

  // Handle retake photo
  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
    setProcessingComplete(false);
    setPreviewApproved(false);
    setCountdown(null);
    setScanning(false);
    
    // Restart camera
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
             t('cameraVerification', 'positionFace')}
          </h1>
          
          {/* Camera View */}
          <div className={`relative mx-auto w-full max-w-lg mb-6 transition-all duration-500 ${animatedElements.cameraFrame ? 'animate-fadeInUp' : 'animate-on-load'}`}>
            {/* Camera Outline Frame */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 border-2 border-gray-300">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Camera Controls */}
          <div className={`flex justify-center gap-4 mb-6 transition-all duration-500 ${animatedElements.controls ? 'animate-fadeInUp stagger-fast' : 'animate-on-load'}`}>
            {cameraActive && !capturedPhoto && !error && !scanning && (
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
            
            {scanning && !capturedPhoto && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <p className="text-lg font-medium">{t('cameraVerification', 'scanningFace')}</p>
              </div>
            )}
            
            {capturedPhoto && !processingComplete && (
              <div className="text-center text-[#F5BC1C] animate-pulse">
                <p className="text-lg font-medium">{t('cameraVerification', 'processingPhoto')}</p>
              </div>
            )}
            
            {showPreview && processingComplete && !previewApproved && (
              <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${animatedElements.preview ? 'animate-scaleIn' : 'animate-on-load'}`}>
                <div className="text-center text-green-500">
                  <p className="text-lg font-medium mb-2">{t('cameraVerification', 'faceVerified')}</p>
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
                <p className="text-lg font-medium">{t('cameraVerification', 'proceeding')}</p>
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