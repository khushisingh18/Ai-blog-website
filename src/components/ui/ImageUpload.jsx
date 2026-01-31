import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ 
  currentImage, 
  onUploadSuccess, 
  label = 'Image',
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, WEBP, or GIF)');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to upload images');
      }

      // Upload to backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      
      // Get the secure URL
      const imageUrl = data.url;
      setPreview(imageUrl);
      
      // Call the callback with the uploaded URL
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium">
        {label}
      </label>

      {/* Preview and Upload Area */}
      <div className="space-y-3">
        {/* Image Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-lg object-cover border-2 border-border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:opacity-80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 border border-input"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : preview ? (
              <>
                <Upload className="w-5 h-5" />
                Change Image
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, WEBP, GIF. Max size: 10MB
      </p>
    </div>
  );
};

export default ImageUpload;
