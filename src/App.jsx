import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Create from './pages/Create';
import Community from './pages/Community';
import BlogDetail from './pages/BlogDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleGenerator from './pages/ArticleGenerator';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/create" element={<Create />} />
              <Route path="/article-generator" element={<ArticleGenerator />} />
              <Route path="/community" element={<Community />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
