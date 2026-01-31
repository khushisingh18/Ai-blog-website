import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Pen, Home, Newspaper, Trophy, LogOut, Moon, Sun, PenSquare, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Pen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">ScribeFlow</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden md:inline">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/feed" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Newspaper className="w-5 h-5" />
                  <span className="hidden md:inline">Feed</span>
                </Link>
                <Link to="/create" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <PenSquare className="w-5 h-5" />
                  <span className="hidden md:inline">Create</span>
                </Link>
                <Link to="/article-generator" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden md:inline">Article Generator</span>
                </Link>
                <Link to="/community" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Trophy className="w-5 h-5" />
                  <span className="hidden md:inline">Community</span>
                </Link>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                  <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.points} pts</p>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-4 py-2 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
