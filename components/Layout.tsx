
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold brand text-stone-900 flex items-center gap-2">
                <i className="fa-solid fa-palette text-indigo-600"></i>
                <span>CreativeShowcase</span>
              </Link>
            </div>
            
            <nav className="flex items-center gap-4 sm:gap-6">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-stone-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="text-stone-600 hover:text-red-500 font-medium transition-colors"
                  >
                    Logout
                  </button>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {user.displayName[0]}
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-stone-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-500 text-sm">
            &copy; {new Date().getFullYear()} Creative Showcase. Built for artists, powered by inspiration.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
