import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../env';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

const CreateTemplate = ({setPageTitle, setShowBackArrow}) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle("Create Template");
  });

  // Form data state
  const [formData, setFormData] = useState({
    instagramName: '',
    category: '',
    pageLanguage: 'English',
  });

  // --- Handler for input changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Form Submission ---
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Validation
    if (!formData.instagramName.trim() || !formData.category || !formData.pageLanguage.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    console.log('Final Form Data:', formData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      const res = await axiosClient.post('user/template', {
        name: formData.instagramName,
        category: formData.category,
        language: formData.pageLanguage,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const id = res.data.data.id;
      navigate('/user/templates/customize/' + id);
    } catch(error) {
      console.error(error);
      setError('Failed to create template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Template</h1>
          <p className="text-gray-600 text-lg">Design your perfect Instagram post template</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Instagram Name Field */}
            <div className="space-y-2">
              <label htmlFor="instagramName" className="flex items-center text-sm font-medium text-gray-700">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
                Template Title / Instagram Page Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">@</span>
                </div>
                <input
                  type="text"
                  name="instagramName"
                  id="instagramName"
                  value={formData.instagramName}
                  onChange={handleInputChange}
                  placeholder="yourbrand_official"
                  className="w-full pl-10 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">Enter your Instagram handle without the @ symbol. You can also enter title directly</p>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-2"></div>
                Content Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 text-lg border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none"
                >
                  <option value="" disabled>Choose your content category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-1">Select the category that best fits your content</p>
            </div>

            {/* Language Field */}
            <div className="space-y-2">
              <label htmlFor="pageLanguage" className="flex items-center text-sm font-medium text-gray-700">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mr-2"></div>
                Content Language
              </label>
              <input
                type="text"
                name="pageLanguage"
                id="pageLanguage"
                value={formData.pageLanguage}
                onChange={handleInputChange}
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="English, Hindi, Spanish, etc."
              />
              <p className="text-xs text-gray-500 ml-1">Primary language for your content</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Template...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Template
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">AI-Powered</h3>
            <p className="text-xs text-gray-600">Smart design suggestions based on your category</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Customizable</h3>
            <p className="text-xs text-gray-600">Fully customizable designs for your brand</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Quick Setup</h3>
            <p className="text-xs text-gray-600">Get started in minutes, not hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
