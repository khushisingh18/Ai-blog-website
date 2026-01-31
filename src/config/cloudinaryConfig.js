// Cloudinary Configuration
// Values are loaded from .env file (client/.env)
// Make sure to prefix environment variables with VITE_ in Vite projects

export const CLOUDINARY_CONFIG = {
  // Get this from your Cloudinary Dashboard
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  
  // Create an unsigned upload preset in Cloudinary Settings > Upload
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'YOUR_UPLOAD_PRESET',
  
  // API endpoint for image uploads (auto-generated)
  get uploadUrl() {
    return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }
};

export default CLOUDINARY_CONFIG;
