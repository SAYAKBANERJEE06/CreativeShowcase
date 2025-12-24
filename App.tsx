
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import MasonryGrid from './components/MasonryGrid';
import { storage } from './services/storage';
import { geminiService } from './services/gemini';
import { User, AuthState, Artwork } from './types';

// --- Pages ---

const LandingPage = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  
  useEffect(() => {
    // Shuffle and get all artworks
    const allArt = storage.getArtworks();
    setArtworks([...allArt].sort(() => Math.random() - 0.5));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-stone-900">Where Creativity Finds its Voice.</h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Join a community of artists sharing digital memories, portfolios, and visions. Get AI-powered critiques to help you grow.
        </p>
      </div>
      
      <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-semibold text-stone-800">Community Showcase</h2>
        <span className="text-sm text-stone-500">{artworks.length} pieces of art</span>
      </div>
      
      <MasonryGrid artworks={artworks} />
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storage.findUserByUsername(username);
    if (user) {
      onLogin(user);
      navigate('/profile');
    } else {
      setError('User not found. Try "vincent" or "frida"');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-stone-100">
      <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your username"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const SignupPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [formData, setFormData] = useState({ username: '', email: '', displayName: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    };
    storage.saveUser(newUser);
    onLogin(newUser);
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-stone-100">
      <h2 className="text-3xl font-bold mb-8 text-center">Start Your Journey</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Display Name</label>
          <input 
            type="text" 
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="johndoe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            placeholder="john@example.com"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

const ProfilePage = ({ user }: { user: User }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newArt, setNewArt] = useState({ title: '', description: '', image: '' as string | null });

  const fetchArt = useCallback(() => {
    setArtworks(storage.getArtworksByUser(user.id));
  }, [user.id]);

  useEffect(() => {
    fetchArt();
  }, [fetchArt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewArt(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArt.image || !newArt.title) return;

    setUploading(true);
    try {
      // Get AI Critique if key available
      const critique = await geminiService.getArtCritique(newArt.title, newArt.description, newArt.image);

      const artwork: Artwork = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        username: user.username,
        title: newArt.title,
        description: newArt.description,
        imageUrl: newArt.image,
        createdAt: Date.now(),
        critique
      };

      storage.saveArtwork(artwork);
      setNewArt({ title: '', description: '', image: null });
      fetchArt();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-stone-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle text-indigo-600"></i>
              New Artwork
            </h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <div 
                className={`relative h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${newArt.image ? 'border-indigo-400 bg-indigo-50' : 'border-stone-200 hover:border-indigo-300'}`}
              >
                {newArt.image ? (
                  <img src={newArt.image} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <i className="fa-solid fa-image text-3xl text-stone-300 mb-2"></i>
                    <p className="text-xs text-stone-500">Click to upload image</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required={!newArt.image}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newArt.title}
                  onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea 
                  value={newArt.description}
                  onChange={(e) => setNewArt({ ...newArt, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${uploading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
              >
                {uploading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    Analyzing with AI...
                  </>
                ) : (
                  'Publish Masterpiece'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* User Gallery */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">My Gallery</h2>
            <p className="text-stone-500">{artworks.length} items</p>
          </div>
          <MasonryGrid artworks={artworks} />
        </div>
      </div>
    </div>
  );
};

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (username) {
      const u = storage.findUserByUsername(username);
      setProfileUser(u || null);
      setArtworks(storage.getArtworksByUsername(username));
    }
  }, [username]);

  if (!profileUser) {
    return <div className="p-20 text-center">Artist not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
          {profileUser.displayName[0]}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{profileUser.displayName}</h1>
          <p className="text-indigo-600 font-medium mb-4">@{profileUser.username}</p>
          <p className="text-stone-600 max-w-xl">{profileUser.bio || "This artist hasn't written a bio yet, but their work speaks volumes."}</p>
        </div>
      </div>
      
      <div className="mb-8 border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-semibold">Artist Portfolio</h2>
      </div>
      
      <MasonryGrid artworks={artworks} />
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('cs_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('cs_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <Router>
      <Layout user={auth.user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={auth.isAuthenticated ? <Navigate to="/profile" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={auth.isAuthenticated ? <Navigate to="/profile" /> : <SignupPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/profile" 
            element={auth.isAuthenticated ? <ProfilePage user={auth.user!} /> : <Navigate to="/login" />} 
          />
          <Route path="/profile/:username" element={<PublicProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
