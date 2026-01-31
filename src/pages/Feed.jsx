import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, Eye, Heart, MessageCircle, Sparkles, Loader2 } from 'lucide-react';

const Feed = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'personalized'
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [filter, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'personalized' && isAuthenticated
        ? '/blog/feed/personalized'
        : `/blog?page=${page}&limit=10`;
      
      const { data } = await api.get(endpoint);
      
      if (filter === 'personalized') {
        setBlogs(data.blogs);
      } else {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = searchTerm
    ? blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : blogs;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {filter === 'personalized' ? 'Your Personalized Feed' : 'Explore Blogs'}
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:opacity-80'
                }`}
              >
                All Blogs
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setFilter('personalized')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    filter === 'personalized'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:opacity-80'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  For You
                </button>
              )}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="px-4 py-2 w-full md:w-64 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'No blogs found matching your search.' : 'No blogs available yet. Be the first to create one!'}
            </p>
            {!searchTerm && (
              <Link
                to="/create"
                className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Create Your First Blog
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {filter === 'all' && totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-muted rounded-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ blog }) => {
  return (
    <Link
      to={`/blog/${blog._id}`}
      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all card-hover"
    >
      {blog.coverImage && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* AI Badge */}
        {blog.isAIGenerated && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </span>
        )}

        <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <img
              src={blog.author?.avatar}
              alt={blog.author?.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">{blog.author?.name}</p>
              <p className="text-xs text-muted-foreground">{blog.author?.points} pts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readTime}m
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {blog.likes?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Feed;
