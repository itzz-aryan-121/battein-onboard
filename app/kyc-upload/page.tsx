'use client'

import { SetStateAction, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function KYCVerification() {
  const { t } = useLanguage();
  const { userData, updateKycData } = useUserData();
  const [panNumber, setPanNumber] = useState(userData.kyc.panNumber || '');
  const [panCardFile, setPanCardFile] = useState<string | null>(userData.kyc.panCardFile || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(!!userData.kyc.panCardFile);
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [videoWatchedOnce, setVideoWatchedOnce] = useState(false);
  const [panError, setPanError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const router = useRouter();
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    panInput: false,
    uploadArea: false,
    button: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, panInput: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, uploadArea: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 800),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  // Initialize video modal on page load
  useEffect(() => {
    setShowVideoModal(true);
  }, []);

  // Handle video playback
  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      videoRef.current.play()
        .catch(e => console.log('Video autoplay prevented:', e));
      setIsVideoPlaying(true);
    }
  }, [showVideoModal]);

  // Toggle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  // Validate PAN number
  const validatePanNumber = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  // Handle PAN number change
  const handlePanNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPanNumber(value);
    
    if (!value.trim()) {
      setPanError(null);
      return;
    }
    
    if (value.length === 10) {
      if (!validatePanNumber(value)) {
        setPanError("Invalid PAN format. It should be 5 letters, 4 numbers, followed by 1 letter (e.g., AAAAA0000A)");
      } else {
        setPanError(null);
      }
    } else if (value.length > 10) {
      setPanError("PAN number cannot be more than 10 characters");
    } else {
      setPanError(null);
    }
  };

  // Compress image function with progress tracking
  const compressImage = (file: File, maxSizeMB: number = 2, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Start with the specified quality and reduce if needed
          let currentQuality = quality;
          const attemptCompression = () => {
            canvas.toBlob((blob) => {
              if (blob) {
                const sizeMB = blob.size / (1024 * 1024);
                
                if (sizeMB <= maxSizeMB || currentQuality <= 0.1) {
                  // Convert to base64
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                } else {
                  // Reduce quality and try again
                  currentQuality -= 0.1;
                  setTimeout(attemptCompression, 100);
                }
              } else {
                reject(new Error('Failed to compress image'));
              }
            }, file.type, currentQuality);
          };
          
          attemptCompression();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Process large files in chunks for better memory management
  const processLargeFile = async (file: File): Promise<string> => {
    const maxChunkSize = 50 * 1024 * 1024; // 50MB chunks
    
    if (file.size <= maxChunkSize) {
      // Small file - process normally with compression
      return await compressImage(file);
    }
    
    // Large file - need special handling
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const tempFile = new File([blob], file.name, { type: file.type });
          
          // Compress the large file
          const compressedBase64 = await compressImage(tempFile, 3); // Allow up to 3MB for large files
          resolve(compressedBase64);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read large file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Enhanced file validation
  const validateFile = (file: File): string | null => {
    // Check file size (increased limit to 50MB for large file support)
    if (file.size > 50 * 1024 * 1024) {
      return 'File size must be less than 50MB';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Please upload a valid image file (JPEG, PNG, WEBP, HEIC, HEIF)';
    }

    return null;
  };

  // Enhanced file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadProgress(0);
        setUploadError(null);
        setIsUploaded(false);
        setUploadedFileSize(file.size);

        // Validate file first
        const validationError = validateFile(file);
        if (validationError) {
          setUploadError(validationError);
          return;
        }

        // Show initial progress
        setUploadProgress(10);

        // Create FormData and upload to Cloudinary with progress tracking
        const formData = new FormData();
        formData.append('file', file);
        
        // Simulate progress updates during upload
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev < 90) return prev + 10;
            return prev;
          });
        }, 200);

        const res = await fetch('/api/upload', { 
          method: 'POST', 
          body: formData 
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          throw new Error('Upload failed. Please try again.');
        }

        const data = await res.json();
        if (!data.url) {
          throw new Error('Upload failed. No URL returned.');
        }

        // Complete the progress
        setUploadProgress(100);

        // Save the Cloudinary URL to context
        setPanCardFile(data.url);
        updateKycData({ panCardFile: data.url });
        setIsUploaded(true);

        // Show success message briefly
        setTimeout(() => {
          setUploadProgress(100);
        }, 500);

      } catch (error: any) {
        setUploadError(error.message || 'Upload failed. Please try again.');
        setUploadProgress(0);
        setIsUploaded(false);
      }
    }
  };

  // IndexedDB storage for large files
  const storeInIndexedDB = (key: string, data: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KYCStorage', 1);
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files');
        }
      };
      
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        const putRequest = store.put(data, key);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to store in IndexedDB'));
      };
    });
  };

  // Retrieve from IndexedDB
  const getFromIndexedDB = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KYCStorage', 1);
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            resolve(getRequest.result);
          } else {
            reject(new Error('File not found in IndexedDB'));
          }
        };
        getRequest.onerror = () => reject(new Error('Failed to retrieve from IndexedDB'));
      };
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate PAN number before submission
    if (!validatePanNumber(panNumber)) {
        setPanError("Invalid PAN format. It should be 5 letters, 4 numbers, followed by 1 letter (e.g., AAAAA0000A)");
        setIsSubmitting(false);
        return;
    }

    try {
        if (!panCardFile) {
            setPanError('Please upload your PAN card first');
            setIsSubmitting(false);
            return;
        }

        // Store KYC data in context
        updateKycData({
            panNumber,
            panCardFile
        });

        // Navigate to bank details page
        router.push('/bank-details');
    } catch (error: any) {
        console.error('Error saving KYC data:', error);
        setPanError(`Error saving KYC data: ${error.message || 'Unknown error'}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormValid = panNumber.trim() !== '' && panCardFile !== null && !panError && !uploadError && isUploaded;

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/kyc-upload');
  }, []);

  const handleVideoEnded = () => {
    setHasWatchedVideo(true);
    setVideoWatchedOnce(true);
  };

  const handleReplay = () => {
    setHasWatchedVideo(false);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden py-1 sm:py-2 md:py-3 px-4">
      <Head>
        <title>KYC Verification - PAN Card Upload</title>
        <meta name="description" content="Complete your KYC by uploading your PAN Card" />
      </Head>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
          <div className="relative bg-white/90 w-full max-w-lg mx-auto z-10 rounded-2xl overflow-hidden shadow-2xl border border-yellow-100">
            <div className="p-4 sm:p-8 pb-6 sm:pb-10">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-yellow-500 text-2xl sm:text-3xl font-bold mb-1">
                  KYC Verification Guide
                </h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  Watch this step-by-step guide on how to complete your KYC verification
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 flex justify-center items-center" style={{ height: '70vh', background: '#000' }}>
                <video
                  ref={videoRef}
                  className="h-full w-auto object-contain bg-black"
                  controls
                  muted
                  autoPlay
                  onEnded={handleVideoEnded}
                >
                  <source src="https://baateinvideos001.blob.core.windows.net/videos/kyc%20part%202%20no%20music.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {!isVideoPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={toggleVideoPlayback}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {/* Modal Actions */}
              <div className="flex flex-col items-center gap-3 mt-2">
                {!videoWatchedOnce ? (
                  <button
                    className="w-32 py-2 rounded-lg bg-gray-300 text-gray-600 font-semibold cursor-not-allowed opacity-60"
                    disabled
                  >
                    Watch till end to continue
                  </button>
                ) : (
                  <>
                    <button
                      className="w-32 py-2 rounded-lg bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition"
                      onClick={() => setShowVideoModal(false)}
                    >
                      Continue
                    </button>
                    <button
                      className="w-32 py-2 rounded-lg bg-white border border-yellow-400 text-yellow-600 font-semibold hover:bg-yellow-50 transition"
                      onClick={handleReplay}
                    >
                      Replay
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-4xl z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-5 mx-auto border border-[#f5bc1c0a]">
          {/* Header Section */}
          <div className="text-center mb-2 sm:mb-3">
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-gray-800 transition-all duration-700 ${animatedElements.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              {t('kyc', 'title')} 📄
            </h1>
            <p className={`text-center text-gray-600 text-xs sm:text-sm leading-relaxed mb-1 px-2 transition-all duration-700 delay-200 ${animatedElements.header ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
              {t('kyc', 'subtitle')}
            </p>
          </div>

          {/* Desktop: Single Column Layout with Info Section */}
          <div className="max-w-3xl mx-auto">
            
            {/* Info Section */}
            <div className="mb-2 lg:mb-3">
              <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-2 sm:p-3 w-full max-w-md mx-auto border border-amber-200 transition-all duration-700 delay-300 ${animatedElements.header ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-center font-semibold mb-1 text-xs sm:text-sm text-amber-800 flex items-center justify-center gap-2">
                  <span className="text-sm">💡</span>
                  {t('kyc', 'whyPanRequired')}
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                    <span className="text-gray-700">{t('kyc', 'kycVerification')}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                    <span className="text-gray-700">{t('kyc', 'tdsCompliance')}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                    <span className="text-gray-700">{t('kyc', 'receivePayments')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* PAN Number Input */}
              <div className={`w-full max-w-sm mx-auto transition-all duration-700 ${animatedElements.panInput ? 'animate-fadeInLeft opacity-100' : 'opacity-0 -translate-x-8'}`}>
                <label htmlFor="panNumber" className="block font-semibold mb-1 text-xs sm:text-sm text-gray-700">
                  {t('kyc', 'panNumber')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="panNumber"
                    className={`w-full border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#f5bc1c] focus:border-[#f5bc1c] text-xs sm:text-sm transition-all duration-300 placeholder-gray-400
                      ${panError ? 'border-red-400 bg-red-50 animate-shakeX' : 'border-gray-300 bg-white hover:border-[#f5bc1c]'}`}
                    placeholder={t('kyc', 'panPlaceholder')}
                    value={panNumber}
                    onChange={handlePanNumberChange}
                    maxLength={10}
                    required
                    style={{ minHeight: '36px' }}
                  />
                  {panNumber.length > 0 && !panError && panNumber.length === 10 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                {panError && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-start gap-1">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                    {panError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <span className="text-blue-500">💡</span>
                  {t('kyc', 'panFormat')}
                </p>
              </div>

              {/* File Upload Section */}
              <div className={`w-full max-w-sm mx-auto transition-all duration-700 ${animatedElements.uploadArea ? 'animate-scaleIn opacity-100' : 'opacity-0 scale-95'}`}>
                <div className="text-center mb-2">
                  <label htmlFor="panCardUpload" className="block font-semibold text-xs sm:text-sm text-[#f5bc1c] mb-1">
                    {t('kyc', 'uploadPanCard')} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500">Upload your PAN card image</p>
                </div>
                
                <label 
                  htmlFor="panCardUpload" 
                  className={`relative flex flex-col items-center justify-center w-full h-16 sm:h-20 border-2 border-dashed rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 
                    ${uploadProgress > 0 && uploadProgress < 100 ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50' :
                      isUploaded ? 'border-green-400 bg-green-50 hover:bg-green-100' : 
                      'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#f5bc1c] hover:scale-[1.02]'}`}
                >
                  {isUploaded ? (
                    // Success State
                    <div className="text-center p-2">
                      <div className="w-6 h-6 mx-auto mb-1 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-green-700 mb-1">Upload Complete!</p>
                      <p className="text-xs text-green-600">Click to change file</p>
                    </div>
                  ) : uploadProgress > 0 && uploadProgress < 100 ? (
                    // Uploading State
                    <div className="text-center p-2">
                      <div className="w-6 h-6 mx-auto mb-1">
                        <svg className="animate-spin h-6 w-6 text-[#f5bc1c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Uploading...</p>
                      <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
                    </div>
                  ) : (
                    // Default Upload State
                    <div className="text-center p-2">
                      <div className="w-6 h-6 mx-auto mb-1 bg-[#f5bc1c] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Upload PAN Card
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to browse or drag & drop
                      </p>
                    </div>
                  )}
                </label>
                
                <input
                  type="file"
                  id="panCardUpload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                />

                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-1 animate-fadeInUp">
                    <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded-lg">
                      <svg className="h-3 w-3 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-xs text-red-600 font-medium">Upload Failed</p>
                        <p className="text-xs text-red-600">{uploadError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && !uploadError && (
                  <div className="mt-1 animate-fadeInUp">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700 font-medium">
                        {uploadProgress < 20 ? 'Preparing upload...' : 
                         uploadProgress < 50 ? 'Uploading to cloud...' : 
                         uploadProgress < 90 ? 'Processing file...' : 
                         'Finalizing upload...'}
                      </span>
                      <span className="text-xs text-gray-700 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-[#f5bc1c] h-1 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {isUploaded && uploadProgress === 100 && !uploadError && (
                  <div className="mt-1 animate-fadeInUp">
                    <div className="flex items-center p-1 bg-green-50 border border-green-200 rounded-lg">
                      <svg className="h-3 w-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-xs text-green-600 font-medium">File uploaded successfully!</span>
                    </div>
                  </div>
                )}
                
                <p className="mt-1 text-xs text-gray-500 text-center">
                  Supported formats: JPEG, PNG, PDF (Max size: 50MB)
                </p>
              </div>

              {/* Submit Button */}
              <div className={`w-full max-w-sm mx-auto transition-all duration-700 ${animatedElements.button ? ' opacity-100' : 'opacity-0 translate-y-8'}`}>
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-[#f5bc1c] to-[#ffd700] text-white py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] 
                    ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed from-gray-400 to-gray-500' : 'hover:from-[#e6a817] hover:to-[#f5bc1c]'}`}
                  disabled={!isFormValid || isSubmitting}
                  style={{ minHeight: '36px' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Continue to Next Step</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </span>
                  )}
                </button>
                
                {/* Form Status Message */}
                <div className="mt-1 text-center">
                  <p className="text-xs text-gray-500">
                    All fields are required to proceed to the next step
                  </p>
                </div>
              </div>

              {/* Reference Video Section - After proceed button */}
              <div className={`w-full max-w-sm mx-auto mt-2 transition-all duration-700 ${animatedElements.uploadArea ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center mb-2">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">📹 Reference Video</h3>
                  <p className="text-xs text-gray-500">Complete Step-by-Step Process Explained</p>
                </div>
                <div 
                  className="relative mx-auto rounded-lg sm:rounded-xl overflow-hidden w-full max-w-[200px] cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ aspectRatio: '16/9' }}
                  onClick={() => setShowVideoModal(true)}
                >
                  <img 
                    src="/assets/kyc-video-thumbnail.png" 
                    alt="KYC Video Thumbnail" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#f5bc1c] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <WaveBackground height={100} />
    </div>
  );
}