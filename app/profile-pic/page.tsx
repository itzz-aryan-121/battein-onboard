'use client'

import { useState, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import Image from 'next/image';
import WaveBackground from '../components/WaveBackground';
import { useRouter } from 'next/navigation';
import { useUserData } from '../context/UserDataContext';
import { useLanguage } from '../context/LanguageContext';
import '../animations.css'; // Import animations

export default function Page() {
  const { t } = useLanguage();
  const { userData, updateUserData } = useUserData();
  const [uploadedImage, setUploadedImage] = useState<string | null>(userData.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(userData.profilePicture || null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const router = useRouter();
  
  // Animation states
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    card: false,
    uploadArea: false,
    button: false
  });
  
  // Progressive animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, header: true })), 200),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, card: true })), 400),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, uploadArea: true })), 600),
      setTimeout(() => setAnimatedElements(prev => ({ ...prev, button: true })), 800),
    ];
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  // Image compression function
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: FileUploadEvent): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    console.log('📁 File selected:', file.name, file.type, file.size);
    
    setIsUploading(true);
    setError(null);
    setImageLoadError(false);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP)");
      setIsUploading(false);
      return;
    }
    
    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Please select an image under 5MB.");
      setIsUploading(false);
      return;
    }
    
    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result && typeof result === 'string') {
        console.log('📷 Setting image preview');
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
    
    try {
      // Delete previous image if it exists
      if (uploadedImage && uploadedImage.includes('cloudinary.com')) {
        try {
          console.log('🗑️ Deleting previous image:', uploadedImage);
          await fetch(`/api/upload?url=${encodeURIComponent(uploadedImage)}`, {
            method: 'DELETE'
          });
          console.log('✅ Previous image deleted successfully');
        } catch (deleteError) {
          console.warn('⚠️ Failed to delete previous image:', deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!data.url) throw new Error('Upload failed - no URL returned');
      
      console.log('✅ New image uploaded to Cloudinary:', data.url);
      setUploadedImage(data.url); // Save Cloudinary URL
      setImagePreview(data.url); // Update preview with Cloudinary URL
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('❌ Upload error:', error);
      setError("Error uploading image. Please try again.");
      // Keep the local preview even if upload fails
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
    console.log('✅ Image loaded successfully, src:', imagePreview?.substring(0, 50));
  };

  const handleImageError = (e: any) => {
    setImageLoadError(true);
    console.error('❌ Image failed to load:', imagePreview?.substring(0, 50));
    console.error('❌ Image error event:', e);
    setError("Error loading image preview. Please try uploading again.");
  };

  const handleContinue = async () => {
    if (!uploadedImage && !imagePreview) {
      setError("Please upload a profile picture first");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      // Store profile picture in context (prefer Cloudinary URL, fallback to preview)
      const imageToSave = uploadedImage || imagePreview || '';
      updateUserData({ profilePicture: imageToSave });
      // Navigate to the next page
      router.push('/kyc-upload');
    } catch (error: any) {
      console.error('Error saving profile picture:', error);
      setError(error.message || 'Failed to save profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', '/profile-pic');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 relative animate-pageEnter bg-gradient-to-br from-[#faf9f5] to-[#f9f7f0]">
      {/* Heading above the white box */}
      <div className="text-center mb-6 sm:mb-8 z-10 px-2">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-golden-shine mb-2 transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
          {t('profilePic', 'title')} 📸
        </h1>
        <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed">
          Show your best self to the world
        </p>
      </div>
      
      <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 max-w-sm sm:max-w-lg w-full mx-2 sm:mx-4 z-10 transition-all duration-500 border border-[#f5bc1c1a] backdrop-blur-sm ${animatedElements.card ? 'animate-cardEntrance' : 'animate-on-load'}`}>
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
            {t('profilePic', 'subtitle')}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Upload a clear photo of yourself
          </p>
        </div>

        {/* Profile Picture Upload Section */}
        <div className={`flex flex-col items-center mb-6 sm:mb-8 transition-all duration-500 ${animatedElements.uploadArea ? 'animate-fadeInUp' : 'animate-on-load'}`}>
          {/* Upload Area */}
          <div className="relative mb-4 sm:mb-6 flex items-center justify-center w-full">
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="profile-upload"
              className={`border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl text-center cursor-pointer bg-gradient-to-br from-white to-[#fefefe] transition-all duration-200 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-lg
                ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gradient-to-br hover:from-[#fff9e9] hover:to-[#fffbf0] focus-within:bg-gradient-to-br focus-within:from-[#fff9e9] focus-within:to-[#fffbf0]'}
                profile-upload-area group`}
              style={{ 
                width: 'min(280px, 85vw)', 
                height: 'min(280px, 85vw)', 
                minWidth: 160, 
                minHeight: 160,
                maxWidth: 320,
                maxHeight: 320
              }}
            >
              {imagePreview ? (
                <div className="relative w-full h-full bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    key={imagePreview}
                    src={imagePreview}
                    alt="Profile picture preview"
                    onLoad={() => {
                      console.log('✅ Image rendered successfully');
                      setImageLoadError(false);
                    }}
                    onError={(e) => {
                      console.error('❌ Image render failed:', e);
                      setImageLoadError(true);
                    }}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      display: 'block',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      borderRadius: 'inherit',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                  {/* Hover overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: 'inherit'
                    }}
                  >
                    <span className="text-white text-xs sm:text-sm font-medium px-2 text-center">
                      Change Photo
                    </span>
                  </div>
                  {/* Upload overlay */}
                  {isUploading && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 'inherit'
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin h-6 w-6 border-2 border-[#f5bc1c] border-t-transparent rounded-full"></div>
                        <p className="text-gray-600 text-xs font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center space-y-3 p-4">
                  <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-3 border-[#f5bc1c] border-t-transparent rounded-full"></div>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3 p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#f5bc1c] to-[#ffd700] rounded-full flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-gray-600 font-semibold text-xs sm:text-sm mb-1">Add your photo</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Click or drag to upload</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Upload Button */}
          <label
            htmlFor="profile-upload"
            className={`flex items-center gap-2 text-[#f5bc1c] hover:text-[#e6a817] mb-4 font-semibold text-xs sm:text-sm hover-scale transition-all duration-200 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg bg-[#fff9e9] hover:bg-[#fff4d6] min-h-[44px] ${isUploading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Upload className="w-4 h-4 flex-shrink-0" />
            <span className="text-center">{imagePreview ? 'Change Picture' : t('profilePic', 'uploadProfilePicture')}</span>
          </label>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-shakeX w-full">
              <p className="text-red-600 text-xs sm:text-sm font-medium text-center leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button 
            onClick={handleContinue}
            disabled={!uploadedImage && !imagePreview || isUploading}
            className={`bg-gradient-to-r from-green-400 to-green-500 text-white py-3.5 sm:py-4 px-8 sm:px-10 rounded-xl font-bold text-base sm:text-lg transition-all hover-glow focus-visible:scale-105 focus-visible:shadow-xl shadow-lg hover:shadow-xl active:animate-pulseBtn w-full sm:w-auto min-h-[48px]
              ${!uploadedImage && !imagePreview || isUploading ? 'opacity-50 cursor-not-allowed from-gray-300 to-gray-400' : 'hover:from-green-500 hover:to-green-600'}
              ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
            style={{ minWidth: 180 }}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span className="text-sm sm:text-base">{t('profilePic', 'saving')}...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="text-sm sm:text-base">{t('profilePic', 'continue')}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
          
          <p className="text-gray-400 text-xs mt-3 sm:mt-4 leading-relaxed px-2">
            Your photo will be used for verification and profile display
          </p>
        </div>
      </div>
      
      <WaveBackground height={250} />
    </div>
  );
}