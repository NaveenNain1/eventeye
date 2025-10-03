import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaUser, 
  FaEdit, 
  FaCamera,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBolt,
  FaImage,
  FaTrophy,
  FaStar,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrash
} from 'react-icons/fa';

const Profile = ({ setPageTitle, setShowBackArrow }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    joinedDate: '',
    stats: {
      templatesCreated: 0,
      creditsUsed: 0,
      totalCredits: 0,
      favoriteTemplates: 0
    }
  });

  // Edit form state
  const [editData, setEditData] = useState({});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setPageTitle("My Profile");
    setShowBackArrow(true);
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosClient.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profile = response.data.user || mockUserData;
      setUserData(profile);
      setEditData(profile);
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Use mock data on error
      setUserData(mockUserData);
      setEditData(mockUserData);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demonstration
  const mockUserData = {
    name: 'User Name',
     phone: '+1 (555) 123-4567',
    
    joinedDate: '2024-01-15T00:00:00Z',
    stats: {
      templatesCreated: 47,
      creditsUsed: 234,
      totalCredits: 400,
      favoriteTemplates: 12
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const savePromise = axiosClient.put('/user/profile', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await toast.promise(
        savePromise,
        {
          loading: 'Saving profile...',
          success: 'Profile updated successfully! 🎉',
          error: 'Failed to update profile'
        }
      );

      setUserData(editData);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const token = localStorage.getItem('token');
      const uploadPromise = axiosClient.post('/user/avatar', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const response = await toast.promise(
        uploadPromise,
        {
          loading: 'Uploading avatar...',
          success: 'Avatar updated successfully! 📸',
          error: 'Failed to upload avatar'
        }
      );

      const avatarUrl = response.data.avatarUrl || URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, avatar: avatarUrl }));
      setEditData(prev => ({ ...prev, avatar: avatarUrl }));
      
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const changePromise = axiosClient.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await toast.promise(
        changePromise,
        {
          loading: 'Changing password...',
          success: 'Password changed successfully! 🔒',
          error: 'Failed to change password'
        }
      );

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully! 👋');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <FaSpinner className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-600 animate-pulse">Getting your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 40,
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl text-white mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                    <FaUser className="text-4xl text-white/70" />
                    </>
                    
                  )}
                </div>
                
                {/* Upload Avatar Button */}
                {/* <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-white/90 text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <FaCamera className="text-sm" />
                  )}
                </button> */}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                <p className="text-white/90 text-lg mb-4">{userData.email}</p>
                
                
                
                <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>Joined {formatDate(userData.joinedDate)}</span>
                  </div>
                  {userData.location && (
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt />
                      <span>{userData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaSave className="text-sm" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 font-semibold text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaTimes className="text-sm" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaEdit className="text-sm" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaImage className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">{userData.stats.templatesCreated}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaBolt className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Credits Used</p>
                <p className="text-2xl font-bold text-gray-900">{userData.stats.creditsUsed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FaTrophy className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{userData.stats.totalCredits}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <FaStar className="text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{userData.stats.favoriteTemplates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <FaUser className="text-purple-500" />
                <span>Profile Information</span>
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{userData.name}</p>
                )}
              </div>

           

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <p className="text-gray-900">{userData.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
 
 
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            {/* Security Settings */}
             

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <FaCog className="text-purple-500" />
                  <span>Quick Actions</span>
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={() => navigate('/user/credits')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <FaBolt className="text-sm" />
                  <span>View Credits</span>
                </button>

                <button
                  onClick={() => navigate('/user/templates')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <FaImage className="text-sm" />
                  <span>My Templates</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  );
};

export default Profile;
