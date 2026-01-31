import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Award, Edit, Loader2, Trash2 } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    fetchProfile();
    fetchUserBlogs();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const endpoint = isOwnProfile ? '/auth/profile' : `/auth/user/${userId}`;
      const { data } = await api.get(endpoint);
      setProfile(data.user);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const { data } = await api.get(`/blog?author=${userId}&limit=20`);
      setUserBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setDeletingBlogId(blogToDelete._id);
    setShowDeleteConfirm(false);

    try {
      await api.delete(`/blog/${blogToDelete._id}`);
      
      // Remove the blog from the list
      setUserBlogs(userBlogs.filter(blog => blog._id !== blogToDelete._id));
      
      // Reset state
      setBlogToDelete(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error.response?.data?.message || 'Failed to delete blog. Please try again.');
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setBlogToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <Link to="/" className="text-primary hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {isOwnProfile && (
                  <Link
                    to="/settings"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-all flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                )}
              </div>

              {profile.bio && (
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-3xl font-bold text-primary">{profile.points}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">Level {profile.level}</p>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.blogsPublished || 0}</p>
                  <p className="text-sm text-muted-foreground">Blogs Published</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.commentsPosted || 0}</p>
                  <p className="text-sm text-muted-foreground">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {profile.badges && profile.badges.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Badges ({profile.badges.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg font-medium"
                  >
                    🏆 {badge.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User's Blogs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {isOwnProfile ? 'Your Blogs' : `${profile.name}'s Blogs`} ({userBlogs.length})
          </h2>

          {userBlogs.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">
                {isOwnProfile ? "You haven't published any blogs yet." : 'No blogs published yet.'}
              </p>
              {isOwnProfile && (
                <Link
                  to="/create"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
                >
                  Create Your First Blog
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all card-hover relative"
                >
                  <Link to={`/blog/${blog._id}`} className="block">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{blog.views} views</span>
                      <span>{blog.likes?.length || 0} likes</span>
                      <span>{blog.commentsCount} comments</span>
                    </div>
                  </Link>
                  
                  {/* Delete Button - Only show for own blogs */}
                  {isOwnProfile && (
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      disabled={deletingBlogId === blog._id}
                      className="absolute top-4 right-4 p-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-all disabled:opacity-50"
                      title="Delete blog"
                    >
                      {deletingBlogId === blog._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
            <h3 className="text-xl font-bold mb-4">Delete Blog?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
