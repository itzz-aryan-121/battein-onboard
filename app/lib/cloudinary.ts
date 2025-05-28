import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to delete old Cloudinary images
export const deleteCloudinaryImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return false;
    }

    const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('✅ Cloudinary image deleted:', imageUrl);
      return true;
    } else {
      console.warn('⚠️ Failed to delete Cloudinary image:', imageUrl);
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting Cloudinary image:', error);
    return false;
  }
};

export default cloudinary; 