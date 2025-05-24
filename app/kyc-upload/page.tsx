'use client'

import { SetStateAction, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

export default function KYCVerification() {
  const [panNumber, setPanNumber] = useState('');
  const [panCardFile, setPanCardFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [panError, setPanError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const router = useRouter();
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);

  // // Initialize video modal on page load
  // useEffect(() => {
  //   setShowVideoModal(true);
    
  //   const handleBeforeUnload = () => {
  //     return undefined;
  //   };
    
  //   window.addEventListener('beforeunload', handleBeforeUnload);
    
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  // // Handle video playback
  // useEffect(() => {
  //   if (showVideoModal && videoRef.current) {
  //     videoRef.current.play()
  //       .catch(e => console.log('Video autoplay prevented:', e));
  //     setIsVideoPlaying(true);
  //   }
  // }, [showVideoModal]);

  // // Toggle video play/pause
  // const toggleVideoPlayback = () => {
  //   if (videoRef.current) {
  //     if (isVideoPlaying) {
  //       videoRef.current.pause();
  //       setIsVideoPlaying(false);
  //     } else {
  //       videoRef.current.play();
  //       setIsVideoPlaying(true);
  //     }
  //   }
  // };

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

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!data.url) throw new Error('Upload failed');

        // Save the Cloudinary URL
        setPanCardFile(data.url);
        localStorage.setItem('panCardFileUrl', data.url);
        localStorage.setItem('panCardFileLocation', 'localstorage');
        setUploadProgress(100);
        setIsUploaded(true);
      } catch (error: any) {
        setUploadError(error.message || 'Upload failed');
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
        // Always use Cloudinary URL from localStorage
        const panCardFileUrl = localStorage.getItem('panCardFileUrl') || '';
        if (!panCardFileUrl) {
            alert('Please upload your PAN card first');
            setIsSubmitting(false);
            return;
        }

        // Store KYC data in localStorage
        const kycData = {
            panNumber,
            panCardFile: panCardFileUrl
        };
        localStorage.setItem('kycData', JSON.stringify(kycData));

        // Navigate to bank details page
        router.push('/bank-details');
    } catch (error: any) {
        console.error('Error saving KYC data:', error);
        alert(`Error saving KYC data: ${error.message || 'Unknown error'}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const isFormValid = panNumber.trim() !== '' && panCardFile !== null && !panError && !uploadError && isUploaded;

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/kyc-upload');
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden overflow-y-auto py-8 px-4">
      <Head>
        <title>KYC Verification - PAN Card Upload</title>
        <meta name="description" content="Complete your KYC by uploading your PAN Card" />
      </Head>

      {/* Video Modal */}
      {/* {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm"
           
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl mx-auto z-10 rounded-xl overflow-hidden shadow-2xl">
            <button 
              
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="p-4 sm:p-6 pb-6 sm:pb-8">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-yellow-500 text-xl sm:text-2xl font-bold mb-1">
                  KYC Verification Guide
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm">
                  Watch this step-by-step guide on how to complete your KYC verification
                </p>
              </div>
              
              <div className="relative rounded-lg overflow-hidden w-full aspect-video">
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  
                  controls={false}
                  muted
                  autoPlay
                >
                  <source src="/assets/kyc-reference-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {!isVideoPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}

      <main className="w-full max-w-4xl z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">
            Complete Your <span className="text-yellow-500">KYC</span> – Upload Your <span className="text-yellow-500">PAN Card</span> Now!
          </h1>
          <p className="text-center text-gray-700 text-xs sm:text-sm mb-3">
            Make sure your details match your <span className="text-yellow-500">PAN</span> card for smooth verification and payouts.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4 w-full max-w-md mx-auto">
            <h3 className="font-medium text-center text-sm mb-1">Why PAN Card is Required:</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>KYC Verification – Confirms your identity</li>
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>TDS Compliance – Required for tax purposes</li>
              <li className="flex items-start"><span className="text-red-500 mr-2">📌</span>Receive Payments – No delays in payouts</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="mb-3 w-full max-w-md mx-auto">
              <label htmlFor="panNumber" className="block mb-1 text-sm font-medium">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="panNumber"
                className={`w-full px-3 py-2 text-sm border ${panError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'} rounded-lg focus:outline-none focus:ring-2`}
                placeholder="Enter your PAN Number (e.g., AAAAA0000A)"
                value={panNumber}
                onChange={handlePanNumberChange}
                maxLength={10}
                required
              />
              {panError && (
                <p className="mt-1 text-xs text-red-500">
                  {panError}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: 5 letters, 4 numbers, 1 letter (e.g., AAAAA0000A)
              </p>
            </div>
            <div className="mb-4 w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Upload your <span className="uppercase">PAN CARD</span> Photo</label>
                <label htmlFor="panCardUpload" className={`inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white ${(uploadProgress > 0 && uploadProgress < 100) || isCompressing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
                  {isCompressing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Compressing...
                    </span>
                  ) : (uploadProgress > 0 && uploadProgress < 100) ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      Upload <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="panCardUpload" 
                    className="hidden" 
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif" 
                    onChange={handleFileUpload} 
                    disabled={(uploadProgress > 0 && uploadProgress < 100) || isCompressing} 
                  />
                </label>
              </div>
              
              {/* Show compression progress for large files */}
              {isCompressing && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-600">Compressing large file...</span>
                    <span className="text-xs text-blue-600">{compressionProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${compressionProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              {/* Show upload error */}
              {uploadError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{uploadError}</p>
                </div>
              )}
              
              {panCardFile && (
                <div className="border border-yellow-400 rounded-xl px-3 sm:px-4 mx-auto my-auto flex items-center gap-2 sm:gap-4 mt-2 w-full h-auto py-2 sm:py-0 sm:h-[61px]" style={{ boxShadow: '0px 0px 12.3px 0px #00000014' }}>
                  <div className="flex-shrink-0">
                    <img src="/assets/_File upload icon.png" alt="" className='w-[24px] h-[24px] sm:w-[28px] sm:h-[28px]'/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-light text-sm sm:text-lg text-gray-800 truncate">
                      {panCardFile}
                    </div>
                    {uploadedFileSize !== null && (
                      <div className="text-gray-500 text-xs sm:text-sm">
                        {uploadedFileSize > 1024 * 1024 
                          ? `${(uploadedFileSize / (1024 * 1024)).toFixed(1)} MB` 
                          : `${Math.round(uploadedFileSize / 1024)} KB`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-auto">
                    <div className="w-16 sm:w-20 bg-yellow-100 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="ml-1 font-semibold text-gray-700 text-xs sm:text-sm whitespace-nowrap">{uploadProgress}%</span>
                    {isUploaded && (
                      <span className="ml-1 flex items-center justify-center">
                        <img src="/assets/_Checkbox base.png" alt="" className='w-[16px] h-[16px]'/>
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <p className="mt-2 text-xs text-gray-500">
                Supported formats: JPEG, PNG, WEBP, HEIC, HEIF (Max size: 50MB - Large files will be automatically compressed)
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-center text-sm font-medium mb-1">Reference Video:</h3>
              <p className="text-center text-xs text-gray-600 mb-2">Complete Step by Step Process Explained</p>
              <div 
                className="relative mx-auto rounded-lg overflow-hidden w-full max-w-[257px] cursor-pointer" 
                style={{ maxHeight: "150px" }}
                onClick={() => setShowVideoModal(true)}
              >
                <img src="/assets/kyc-video-thumbnail.png" alt="KYC Video Thumbnail" className="w-full h-full object-cover" style={{ maxHeight: "150px" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full max-w-[278px] mx-auto bg-yellow-500 text-white py-2 rounded-lg text-base font-medium transition-colors ${
                !isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
              } button-animate`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Proceed'
              )}
            </button>
          </form>
        </div>
      </main>

      <WaveBackground height={250} />
    </div>
  );
}