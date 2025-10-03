import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';

// Importing icons from React Icons
import { 
  FaThLarge,       // Templates
  FaPlusSquare,    // Create Post
  FaCreditCard,    // Credits
  FaShoppingCart,  // Buy Credits
  FaArrowLeft,     // Back Arrow
  FaUser,          // Profile
  FaSignOutAlt,    // Logout
  FaCog,           // Settings
  FaChevronDown    // Dropdown arrow
} from 'react-icons/fa';

const ThemeOutlet = ({pageTitle, showBackArrow = false, user}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const menuItems = [
    { name: 'Templates', path: '/user/templates', icon: <FaThLarge size={20} /> },
    // { name: 'Create Post', path: '/user/create-post', icon: <FaPlusSquare size={20} /> },
        { name: 'Gennerate Certificates', path: '/user/posts', icon: <FaPlusSquare size={20} /> },

    { name: 'Credits', path: '/user/credits', icon: <FaCreditCard size={20} /> },
    { name: 'Buy Credits', path: '/user/buy-credits', icon: <FaShoppingCart size={20} /> },
  ];

  // Calculate dropdown position when opened
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 256 + window.scrollX, // 256px = w-64
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      if (isProfileDropdownOpen) {
        calculateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isProfileDropdownOpen) {
        calculateDropdownPosition();
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isProfileDropdownOpen]);

  const handleDropdownToggle = () => {
    if (!isProfileDropdownOpen) {
      calculateDropdownPosition();
    }
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- Styling functions for NavLink ---
  const getSidebarNavLinkClass = ({ isActive }) => 
    `flex items-center w-full px-4 py-3 transition-all duration-200 rounded-xl ${
      isActive 
        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg transform scale-[1.02]' 
        : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:via-pink-50 hover:to-orange-50 hover:text-gray-800'
    }`;
  
  const getBottomNavLinkClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ${
      isActive 
        ? 'text-purple-600' 
        : 'text-gray-500 hover:text-gray-700'
    }`;

  // Dropdown component rendered via portal
  const DropdownPortal = () => {
    if (!isProfileDropdownOpen) return null;

    return createPortal(
      <div 
        ref={dropdownRef}
        className="fixed w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
        style={{ 
          top: `${dropdownPosition.top}px`, 
          left: `${dropdownPosition.left}px`,
          zIndex: 999999 // Keep this very high for dropdown
        }}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">{user?.name ?? 'USER111'}</p>
          <p className="text-sm text-gray-500">{user?.mobile.slice(-25) ?? '+91 xxxxx-xxxx'}</p>
        </div>
        
        {/* <div className="py-2">
          <button 
            onClick={() => {
              navigate('/user/profile');
              setIsProfileDropdownOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaUser className="w-4 h-4 mr-3" />
            Profile Settings
          </button>
        </div> */}
        
        <div className="border-t border-gray-100 pt-2">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 font-sans">
      
      {/* --- Sidebar (Visible on Medium screens and up) --- */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-xl rounded-r-3xl" style={{ zIndex: 10 }}>
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">EventEye AI</h1>
          </div>
        </div>
        <nav className="flex-1 px-6 py-6 space-y-3">
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={getSidebarNavLinkClass}>
              <div className="flex items-center justify-center w-8 h-8">
                {item.icon}
              </div>
              <span className="ml-4 text-md font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <a href='https://forms.gle/MDXydz1giLwyzYKj8' className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Bar */}
        {pageTitle && (
          <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm" style={{ zIndex: 10 }}>
            <div className="flex items-center">
              {showBackArrow && (
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 rounded-lg transition-all duration-200 focus:outline-none md:hidden"
                >
                  <FaArrowLeft size={18} />
                </button>
              )} 
              <h2 className="text-xl font-semibold text-gray-800 ml-2">{pageTitle}</h2>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleDropdownToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-medium">{user?.name?.[0] ?? 'U'}</span>
                </div>
                <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </header>
        )}   
        
        {/* Main content where routed components will be rendered */}
        {/* CRITICAL FIX: Remove inline z-index style that was constraining child modals */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            <br/>
            <br/>
            <br/>
          </div>
        </main>
      </div>

      {/* --- Bottom Navigation Bar (Visible on Mobile only) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-sm border-t border-white/20 shadow-xl rounded-t-3xl" style={{ zIndex: 50 }}>
        <div className="flex justify-around items-center h-full px-2">
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={getBottomNavLinkClass}>
              {({ isActive }) => (
                <div className="flex flex-col items-center space-y-1">
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg' 
                      : ''
                  }`}>
                    {React.cloneElement(item.icon, { 
                      size: 18,
                      className: isActive ? 'text-white' : 'text-gray-500'
                    })}
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' 
                      : 'text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile spacing to prevent content overlap with bottom nav */}
      <div className="md:hidden h-20"></div>

      {/* Dropdown Portal - Rendered at document.body level */}
      <DropdownPortal />
    </div>
  );
};

export default ThemeOutlet;
