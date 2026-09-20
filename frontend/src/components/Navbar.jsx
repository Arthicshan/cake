import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cake, LogOut, User, Shield, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-pink-100 to-pink-400 bg-clip-text text-transparent">
              Sweet Delights
            </span>
            <span className="block text-xs text-slate-400 font-medium">Cake Shop Portal</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-sm">
                <User className="w-4 h-4 text-pink-400" />
                <span className="font-medium text-slate-200">{user.name}</span>
                <span
                  className={`ml-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl shadow-md shadow-pink-500/20 transition-all hover:shadow-pink-500/30"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
