import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTasks, FaUserCircle, FaEdit } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import ProfileEditModal from './ProfileEditModal'; // Assuming modal component is in same folder or adjust path

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const onProfileUpdate = () => {
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-2xl font-bold">
              <FaTasks />
              <span>TaskApp</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border-2 border-blue-200 dark:border-gray-600 transition-colors hover:border-blue-400">
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                    </div>
                  </button>

                  {/* Profile Dropdown Card */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate" title={user.email}>
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FaEdit className="text-blue-500" /> Edit Profile
                        </button>
                        <button
                          onClick={onLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-blue-500/30 shadow-md"
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 pb-4">
            <div className="flex flex-col space-y-2 px-4 pt-2">
              {user ? (
                <>
                  <div className="py-2 border-b dark:border-gray-700 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-gray-600">
                            {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                        </div>
                        <div>
                             <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                        setIsEditModalOpen(true);
                        setIsOpen(false);
                    }}
                     className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2 w-full text-left"
                  >
                     <FaEdit /> <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-600 py-2 w-full text-left"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Edit Modal (Global access via Navbar) */}
      {isEditModalOpen && user && (
        <ProfileEditModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onUpdate={onProfileUpdate}
        />
      )}
    </>
  );
};

export default Navbar;
