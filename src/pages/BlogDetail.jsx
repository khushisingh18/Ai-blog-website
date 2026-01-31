import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTTS } from '../hooks/useTTS';
import api from '../services/api';
import { 
  Clock, Eye, Heart, MessageCircle, Mic, MicOff, 
  Loader2, Send, Globe, Sparkles 
} from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { speak, stop, isSpeaking } = useTTS();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Translation state
  const [originalContent, setOriginalContent] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' },
  ];

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/blog/${id}`);
      setBlog(data.blog);
      setComments(data.comments || []);
      setIsLiked(data.blog.likes?.includes(user?._id));
      setLikesCount(data.blog.likes?.length || 0);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      const { data } = await api.post(`/blog/${id}/like`);
      setIsLiked(data.isLiked);
      setLikesCount(data.likes);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;

    setIsCommenting(true);
    try {
      const { data } = await api.post(`/blog/${id}/comment`, { content: commentText });
      setComments([data, ...comments]);
      setCommentText('');
      setBlog({ ...blog, commentsCount: blog.commentsCount + 1 });
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else if (blog) {
      // Map language codes to browser TTS language codes
      const languageMap = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-BR',
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'ru': 'ru-RU',
      };
      
      const ttsLanguage = languageMap[selectedLanguage] || 'en-US';
      const textToRead = `${blog.title}. ${blog.content}`;
      speak(textToRead, ttsLanguage);
    }
  };

  const handleTranslate = async (languageCode) => {
    if (languageCode === selectedLanguage) return; // Already in this language
    
    if (!originalContent) {
      setOriginalContent({ title: blog.title, content: blog.content });
    }

    if (languageCode === 'en' && originalContent) {
      // Restore original content
      setBlog({ ...blog, title: originalContent.title, content: originalContent.content });
      setSelectedLanguage('en');
      setShowLanguageMenu(false);
      return;
    }

    setIsTranslating(true);
    setShowLanguageMenu(false);
    
    try {
      const { data } = await api.post('/ai/translate', {
        blogId: blog._id,
        targetLanguage: languageCode,
      });
      
      setBlog({ ...blog, title: data.title, content: data.content });
      setSelectedLanguage(languageCode);
    } catch (error) {
      console.error('Error translating:', error);
      
      // Show specific error message
      const errorMsg = error.response?.data?.message || error.message || 'Failed to translate';
      
      if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        alert('⚠️ Translation temporarily unavailable due to API rate limit. Please wait 1-2 minutes and try again.');
      } else if (errorMsg.includes('API key')) {
        alert('❌ AI translation is not available. The API key may be invalid or missing.');
      } else if (!isAuthenticated) {
        alert('🔒 Please login to use the translation feature.');
      } else {
        alert(`❌ Translation failed: ${errorMsg}\n\nPlease try again in a moment.`);
      }
      
      // Reset to original language on error  
      setSelectedLanguage(originalContent ? 'en' : selectedLanguage);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
          <Link to="/feed" className="text-primary hover:underline">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <article className="max-w-4xl mx-auto">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Meta */}
        <div className="mb-8">
          {blog.isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI Generated
            </span>
          )}

          <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>

          {/* Author Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
            <Link
              to={`/profile/${blog.author?._id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={blog.author?.avatar}
                alt={blog.author?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{blog.author?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Level {blog.author?.level} • {blog.author?.points} points
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views} views
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isLiked
                ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                : 'bg-secondary text-secondary-foreground hover:opacity-80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>

          <button
            onClick={handleListen}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-all flex items-center gap-2"
          >
            {isSpeaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isSpeaking ? 'Stop' : 'Listen'}
          </button>

          {/* Translate Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              disabled={isTranslating}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  {languages.find(l => l.code === selectedLanguage)?.name || 'Translate'}
                </>
              )}
            </button>

            {showLanguageMenu && (
              <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10 w-48">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleTranslate(lang.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                      selectedLanguage === lang.code ? 'bg-primary/10 text-primary font-medium' : ''
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="whitespace-pre-wrap">{blog.content}</div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border pt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments ({blog.commentsCount})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-3 resize-none"
              />
              <button
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isCommenting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Comment (+2 points)
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-muted rounded-lg text-center">
              <Link to="/login" className="text-primary hover:underline">
                Login to comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <img
                  src={comment.author?.avatar}
                  alt={comment.author?.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.author?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
