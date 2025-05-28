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
    
    setIsUploading(true);
    setError(null);
    
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
      
      if (!data.url) throw new Error('Upload failed');
      
      console.log('✅ New image uploaded:', data.url);
      setUploadedImage(data.url); // Save Cloudinary URL in state
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('❌ Upload error:', error);
      setError("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!uploadedImage) {
      setError("Please upload a profile picture first");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      // Store profile picture in context
      updateUserData({ profilePicture: uploadedImage });
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative animate-pageEnter">
      {/* Heading above the white box */}
      <h1 className={`text-2xl font-medium text-golden-shine mb-8 z-10 transition-all duration-500 ${animatedElements.header ? 'animate-headerSlide' : 'animate-on-load'}`}>
        {t('profilePic', 'title')} 🎬📷
      </h1>
      
      <div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 z-10 transition-all duration-500 ${animatedElements.card ? 'animate-cardEntrance' : 'animate-on-load'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">
            {t('profilePic', 'subtitle')}
          </p>
        </div>

        {/* Profile Picture Upload Section */}
        <div className={`flex flex-col items-center mb-8 transition-all duration-500 ${animatedElements.uploadArea ? 'animate-fadeInUp' : 'animate-on-load'}`}>
          {/* Upload Area */}
          <div className="relative mb-6">
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
              className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-all ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Profile picture"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : isUploading ? (
                <div className="animate-spin h-8 w-8 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              ) : (
                <Plus className="w-8 h-8 text-gray-400" />
              )}
            </label>
          </div>

          {/* Upload Button */}
          <label
            htmlFor="profile-upload"
            className={`flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 hover-scale ${isUploading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Upload className="w-4 h-4" />
            {t('profilePic', 'uploadProfilePicture')}
          </label>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center mb-4 animate-shakeX">
              {error}
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button 
            onClick={handleContinue}
            disabled={!uploadedImage || isUploading}
            className={`bg-green-400 text-white py-3 px-8 rounded-lg font-medium transition-all hover-glow ${
              !uploadedImage || isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-500'
            } ${animatedElements.button ? 'animate-buttonGlow' : 'animate-on-load'}`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                {t('profilePic', 'saving')}...
              </span>
            ) : (
              t('profilePic', 'continue')
            )}
          </button>
          
          {/* Debug Button - For testing only */}
          {/* <button 
            onClick={() => {
              console.log("Current Partner ID:", localStorage.getItem('partnerId'));
              console.log("Image loaded:", !!uploadedImage);
              if (uploadedImage) {
                console.log("Image size:", uploadedImage.length);
                console.log("Estimated payload size:", JSON.stringify({profilePicture: uploadedImage}).length, "bytes");
              }
            }}
            className="text-xs text-gray-400 mt-2 hover:underline"
          >
            Debug
          </button> */}
        </div>
      </div>
      
      <WaveBackground height={250} />
    </div>
  );
}