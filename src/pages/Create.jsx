import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Loader2, Plus, X } from 'lucide-react';
import ImageUpload from '../components/ui/ImageUpload';

const Create = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  // Blog Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Publish blog
  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsPublishing(true);

    try {
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage.trim(),
        tags,
        seoKeywords: tags,
        isAIGenerated: false,
      };

      const { data } = await api.post('/blog', blogData);
      
      // Update user data with new points
      if (user) {
        const updatedUser = { ...user, points: user.points + 10 };
        updateUserData(updatedUser);
      }

      setSuccess('Blog published successfully! Redirecting...');
      
      // Redirect to blog detail page
      setTimeout(() => {
        navigate(`/blog/${data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish blog. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Create New Blog</h1>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Blog Form */}
        <form onSubmit={handlePublish} className="bg-card p-8 rounded-2xl shadow-lg border border-border">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="Enter your blog title..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/200 characters</p>
          </div>

          {/* Cover Image Upload */}
          <div className="mb-6">
            <ImageUpload
              currentImage={coverImage}
              onUploadSuccess={(url) => setCoverImage(url)}
              label="Cover Image (Optional)"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={16}
              placeholder="Paste your generated article here or write your own content... (Supports Markdown)"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label htmlFor="tagInput" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <div className="flex gap-3 mb-3">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publish Blog (+10 points)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
