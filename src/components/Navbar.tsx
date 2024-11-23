import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote, LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/elections" className="flex items-center space-x-2">
            <Vote className="h-8 w-8" />
            <span className="text-xl font-bold">E-Voting</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' ? (
              <>
                <Link
                  to="/admin"
                  className="hover:bg-indigo-700 px-3 py-2 rounded-md"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/logs"
                  className="hover:bg-indigo-700 px-3 py-2 rounded-md"
                >
                  System Logs
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}