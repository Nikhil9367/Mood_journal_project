import React, { useState } from 'react';
import { User, LogOut, Settings, Calendar, BookOpen, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onNewEntry }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">MoodJournal</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Calendar
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Analytics
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onNewEntry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              New Entry
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-3" />
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-3" />
                    Settings
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;