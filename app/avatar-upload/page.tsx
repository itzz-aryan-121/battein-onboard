'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert image URL to base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    // Fetch the image
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error('Error converting image URL to base64:', error);
    throw error;
  }
};

const generateAvatarFromAPI = async (prompt: string) => {
  try {
    console.log(`Generating avatar with prompt: ${prompt}`);
    
    // Mock response for now - this would be replaced with actual API call
    // return await fetch('/api/generate-avatar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt })
    // }).then(res => res.json());
    
    // For now, just return a mock response after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, imageUrl: '/assets/avatars/image (5).png' };
  } catch (error) {
    console.error('Error generating avatar:', error);
    return { success: false, error: 'Failed to generate avatar' };
  }
};

export default function AvatarUploadPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [showGenerateInput, setShowGenerateInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarsBase64, setAvatarsBase64] = useState<string[]>([]);
  const [avatarsLoaded, setAvatarsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const avatars = [
    '/assets/avatars/image 3.png',
    '/assets/avatars/image (1).png',
    '/assets/avatars/image (4).png',
    '/assets/avatars/image (5).png',
  ];

  // Preload all predefined avatars as base64 on component mount
  useEffect(() => {
    const loadAvatarsAsBase64 = async () => {
      try {
        const base64Promises = avatars.map(avatarUrl => imageUrlToBase64(avatarUrl));
        const base64Results = await Promise.all(base64Promises);
        setAvatarsBase64(base64Results);
        setAvatarsLoaded(true);
      } catch (error) {
        console.error('Error loading avatars as base64:', error);
        // Fall back to using URLs if conversion fails
        setAvatarsLoaded(true);
      }
    };
    
    loadAvatarsAsBase64();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        
        // Convert the file to base64 directly
        const base64Image = await fileToBase64(file);
        
        // Set the base64 image as custom avatar
        setCustomAvatar(base64Image);
        setSelectedAvatar(null);
      } catch (error: any) {
        console.error('Error processing avatar:', error);
        alert(`Error processing avatar: ${error.message || 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSwitchToVideo = () => {
    router.push('/video-upload');
  };

  const handleContinue = async () => {
    try {
      setIsSaving(true);
      
      let avatarUrl = '';
      
      if (selectedAvatar !== null) {
        // Use the preloaded base64 version of the predefined avatar
        if (avatarsLoaded && avatarsBase64[selectedAvatar]) {
          avatarUrl = avatarsBase64[selectedAvatar];
        } else {
          // Fallback: Convert the selected avatar to base64 right now
          try {
            avatarUrl = await imageUrlToBase64(avatars[selectedAvatar]);
          } catch (error) {
            console.error('Error converting avatar to base64:', error);
            // Last resort fallback - just use the URL
            avatarUrl = avatars[selectedAvatar];
          }
        }
      } else if (customAvatar !== null) {
        // Custom avatars are already in base64 format
        avatarUrl = customAvatar;
      }
      
      // Get the partner ID from localStorage
      const partnerId = localStorage.getItem('partnerId');
      
      if (partnerId && avatarUrl) {
        // Update the partner record with the base64 avatar
        const response = await fetch(`/api/partners?id=${partnerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            avatarUrl,
            isBase64: true // Always true since we're always using base64 now
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save avatar');
        }
      }
      
      // Navigate to the next step
      router.push('/kyc-upload');
    } catch (error: any) {
      console.error('Error saving avatar:', error);
      alert(`Error saving avatar: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle generating an avatar from the API
  const handleGenerateAvatar = async () => {
    if (!generationPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await generateAvatarFromAPI(generationPrompt);
      if (result.success && result.imageUrl) {
        // Convert the generated avatar URL to base64
        const base64Image = await imageUrlToBase64(result.imageUrl);
        setCustomAvatar(base64Image);
        setSelectedAvatar(null);
        setShowGenerateInput(false);
      } else {
        alert('Failed to generate avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      alert('An error occurred while generating the avatar.');
    } finally {
      setIsGenerating(false);
      setGenerationPrompt('');
    }
  };

  return (
    <div className="flex flex-col bg-white h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 relative z-10 w-full max-w-4xl mx-auto">
          {/* Heading */}
          <h1 className="text-center text-3xl font-bold mb-4">
            <span className="text-[#F5BC1C]">Congratulations!</span> You've Chosen the Audio Call<br />
            Option to Grow Your Career!
          </h1>
          
          {/* Avatar Selection */}
          <div className="bg-gray-50 rounded-2xl p-5 mx-auto max-w-2xl mb-5">
            <p className="text-center text-lg text-gray-700 mb-4">Just upload your favourite Avtar</p>
            
            {/* Upload Box */}
            <div className="flex justify-center mb-5">
              <div 
                className={`w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden ${isUploading ? 'opacity-50' : ''}`}
                onClick={!isUploading ? handleAvatarClick : undefined}
              >
                {isUploading ? (
                  <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : customAvatar ? (
                  <img src={customAvatar} alt="Custom Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                disabled={isUploading}
              />
            </div>
            
            {/* Avatar Options */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {avatars.map((avatar, index) => (
                <div 
                  key={index}
                  className={`w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${selectedAvatar === index ? 'border-[#F5BC1C]' : 'border-transparent'}`}
                  onClick={() => {
                    setSelectedAvatar(index);
                    setCustomAvatar(null); // Clear custom avatar when selecting predefined
                  }}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Upload Own Avatar Button */}
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button 
                className="text-[#4CAF50] font-medium flex items-center"
                onClick={handleAvatarClick}
              >
                Upload your own Avtar 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <span className="mx-2 text-gray-400">or</span>
              
              {/* Generate Avatar Option - will be connected to API in future */}
              <button 
                className="text-[#4CAF50] font-medium flex items-center"
                onClick={() => setShowGenerateInput(!showGenerateInput)}
              >
                Generate Avatar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </button>
            </div>
            
            {/* Generate Avatar Input - Only shown when button is clicked */}
            {showGenerateInput && (
              <div className="mt-3 flex flex-col items-center">
                <div className="w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Describe your avatar (e.g., 'professional woman with glasses')"
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleGenerateAvatar}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className={`w-full bg-[#F5BC1C] text-white py-2 rounded-lg ${
                      isGenerating || !generationPrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e5ac0f]'
                    }`}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Avatar'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Avatar generation will be available soon.
                </p>
              </div>
            )}
          </div>
          
          {/* Verification Notes */}
          <div className="max-w-xl mx-auto">
            <p className="text-center text-base mb-3">Are you okey with this</p>
            
            <div className="flex justify-center mb-3">
              <button 
                className="bg-[#F5BC1C] text-white px-3 py-1.5 rounded-full flex items-center hover:bg-[#e5ac0f] transition-colors"
                onClick={handleSwitchToVideo}
              >
                Switch to <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg> call
              </button>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">No <span className="text-[#F5BC1C]">face verification</span> = No verified badge</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">No <span className="text-[#F5BC1C]">face verification</span> = Fewer earning opportunities</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">No <span className="text-[#F5BC1C]">face verification</span> = No virtual gifts</span>
              </div>
            </div>
            
            {/* Continue Button */}
            <div className="flex justify-center mt-5">
              <button 
                onClick={handleContinue}
                className={`bg-[#4CAF50] text-white px-5 py-1.5 rounded-lg font-medium transition-colors ${
                  (selectedAvatar !== null || customAvatar !== null) && !isSaving 
                  ? 'hover:bg-[#3d9940]' 
                  : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={(selectedAvatar === null && customAvatar === null) || isSaving || isUploading}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Background */}
      <WaveBackground height={250} />
    </div>
  );
}