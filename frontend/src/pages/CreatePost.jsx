import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaPlusSquare,
  FaImage,
  FaSpinner,
  FaMagic,
  FaPalette,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaWindows,
  FaClosedCaptioning
} from 'react-icons/fa';
import { CATEGORIES } from '../env';
const CreatePost = ({ setPageTitle, setShowBackArrow }) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    templateId: '',
    title: '',
    captionBased: 'no'
  });
  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableSubCategories,setAvailableSubCategories] = useState([]);
  const [selectedSubCat,setSelectedSubCat] = useState("");
  // useEffect(()=>{
  //   console.log("SKS",availableSubCategories)
  // },[selectedTemplate])
  const navigate = useNavigate();
  const isDesktop = window.innerWidth >= 768;
        useEffect(()=>{
        if(selectedTemplate){
          const category = selectedTemplate?.category;
          if(category!=""){
        const cattt = CATEGORIES.find((cat)=>{
          return cat.name == category;
        });
          // console.log(cattt);

        if(cattt){
            setAvailableSubCategories(cattt.subcategories);
console.log(cattt.subcategories);
        }else{
              setAvailableSubCategories([]);

        }

          }else{
            setAvailableSubCategories([]);
          }
        }
        },[selectedTemplate])
  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle("Create New Post");
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get('user/template', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTemplates(res.data.data || []);
    //   toast.success('Templates loaded successfully! 🎨');
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update selected template info
    if (name === 'templateId' && value) {
      const template = templates.find(t => t.id.toString() === value);
      setSelectedTemplate(template);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.templateId) {
      newErrors.templateId = 'Please select a template';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a post title';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
        // navigate(`/user/post/${formData.templateId}?post_title=${encodeURIComponent(formData.title)}`);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post('user/template/post/'+formData.templateId, {
        template_id: formData.templateId,
        title: formData.title.trim(),
        captionBased:formData.captionBased,
        subcategory:selectedSubCat,
        main_category: selectedTemplate.category
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Post created successfully! 🎉');
      
      // Navigate to customize page with the new post/template
      setTimeout(() => {
        navigate(`/user/post/${response.data.data.id}?post_title=${encodeURIComponent(formData.title)}`);
      }, 1000);

    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
    
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <FaSpinner className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Templates</h3>
          <p className="text-gray-600 animate-pulse">Preparing your creative options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* React Hot Toast Container */}
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
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Mobile Layout */}
      {!isDesktop && (
        <div className="w-full p-4">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                <FaPlusSquare className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Amazing Post</h1>
              <p className="text-gray-600">Choose a template and add your creative touch</p>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <FaImage className="text-purple-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">Select Template</h3>
              </div>
              
              <select
                name="templateId"
                value={formData.templateId}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white shadow-sm transition-all text-lg ${
                  errors.templateId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              
              {errors.templateId && (
                <div className="mt-2 flex items-center text-red-600">
                  <FaExclamationTriangle className="mr-2" />
                  <span className="text-sm">{errors.templateId}</span>
                </div>
              )}

              {selectedTemplate && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center mb-2">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Selected Template</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedTemplate.name}</p>
                                      Main Category: <b>{selectedTemplate.category}</b>

                </div>
              )}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaWindows className="text-red-500 mr-3" />
                  Sub Category
                </label>
                
                <select
                  type="text"
                  name="title"
                  value={selectedSubCat}
                  onChange={(e)=>{ setSelectedSubCat(e.target.value)}}
                  placeholder="Enter an engaging title for your post..."
                 
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-white shadow-sm transition-all text-lg  `}
                >
                  {availableSubCategories.length>0 && availableSubCategories.map((acd)=>{
                    return (
                    <option value={acd}>{acd}</option>
                    )
                  })}
                  <option value="None">None</option>
                </select>
                
                
              </div>
            {/* Title Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <FaPalette className="text-pink-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">Post Title/Topic</h3>
              </div>
              
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your creative post title..."
                maxLength={100}
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white shadow-sm transition-all text-lg ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              
              <div className="mt-2 flex justify-between items-center">
                <div>
                  {errors.title && (
                    <div className="flex items-center text-red-600">
                      <FaExclamationTriangle className="mr-2" />
                      <span className="text-sm">{errors.title}</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm ${
                  formData.title.length > 80 ? 'text-orange-500' : 'text-gray-500'
                }`}>
                  {formData.title.length}/100
                </span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaClosedCaptioning className="text-red-500 mr-3" />
                  Caption Based Post?
                </label>
                
                <select
                  type="text"
                   name="captionBased"
                value={formData.captionBased}
                onChange={handleInputChange}
                  placeholder="Enter an engaging title for your post..."
                 
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-white shadow-sm transition-all text-lg  `}
                >
                   
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                
                <small>
                  Caption Based Post means main content of post will be shown on caption. In that post only title type thing will be shown
                </small>
              </div>
            {/* Submit Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <button
                type="submit"
                disabled={isSubmitting || !formData.templateId || !formData.title.trim()}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Creating Post...</span>
                  </>
                ) : (
                  <>
                    <FaMagic />
                    <span>Create & Customize</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>

            {/* Tip Card */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center mb-3">
                <FaLightbulb className="text-yellow-500 mr-3" />
                <span className="text-sm font-bold text-blue-900">Pro Tip</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">

                Choose a template that matches your content theme, then customize it with AI-powered tools to create engaging social media posts!
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl">
                <FaPlusSquare className="text-white text-3xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className="text-xl text-gray-600">Transform your ideas into stunning social media content</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 space-y-8">
              {/* Template Selection */}
              <div>
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaImage className="text-purple-500 mr-3" />
                  Choose Template
                </label>
                
                <select
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white shadow-sm transition-all text-lg ${
                    errors.templateId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a template to get started...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                
                {errors.templateId && (
                  <div className="mt-3 flex items-center text-red-600">
                    <FaExclamationTriangle className="mr-2" />
                    <span>{errors.templateId}</span>
                  </div>
                )}

                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center mb-2">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-semibold text-gray-700">Template Selected</span>
                    </div>
                    <p className="text-gray-600">{selectedTemplate.name}</p>
                    {selectedTemplate.description && (
                      <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
                    )}
                    Main Category: <b>{selectedTemplate.category}</b>
                  </div>
                )}
              </div>
   {/* Title Input */}
              <div>
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaWindows className="text-red-500 mr-3" />
                  Sub Category
                </label>
                
                <select
                  type="text"
                  name="title"
                  value={selectedSubCat}
                  onChange={(e)=>{ setSelectedSubCat(e.target.value)}}
                  placeholder="Enter an engaging title for your post..."
                 
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-white shadow-sm transition-all text-lg  `}
                >
                  {availableSubCategories.length>0 && availableSubCategories.map((acd)=>{
                    return (
                    <option value={acd}>{acd}</option>
                    )
                  })}
                  <option value="None">None</option>
                </select>
                
                
              </div>
              {/* Title Input */}
              <div>
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaPalette className="text-pink-500 mr-3" />
                  Post Title/Topic
                </label>
                
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter an engaging title for your post..."
                  maxLength={100}
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white shadow-sm transition-all text-lg ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    {errors.title && (
                      <div className="flex items-center text-red-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-sm ${
                    formData.title.length > 80 ? 'text-orange-500 font-semibold' : 'text-gray-500'
                  }`}>
                    {formData.title.length}/100 characters
                  </span>
                </div>
              </div>
              {/* wqe */}
            <div>
                <label className="flex items-center text-lg font-bold text-gray-900 mb-4">
                  <FaClosedCaptioning className="text-red-500 mr-3" />
                  Caption Based Post?
                </label>
                
                <select
                  type="text"
                   name="captionBased"
                value={formData.captionBased}
                onChange={handleInputChange}
                  placeholder="Enter an engaging title for your post..."
                 
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-white shadow-sm transition-all text-lg  `}
                >
                   
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                
                <small>
                  Caption Based Post means main content of post will be shown on caption. In that post only title type thing will be shown
                </small>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.templateId || !formData.title.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-4"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      <span>Creating Your Post...</span>
                    </>
                  ) : (
                    <>
                      <FaMagic className="text-xl" />
                      <span>Create & Customize Post</span>
                      <FaArrowRight className="text-xl" />
                    </>
                  )}
                </button>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-3">
                  <FaLightbulb className="text-yellow-500 mr-3 text-xl" />
                  <span className="font-bold text-blue-900">Pro Tip</span>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  After creating your post, you'll be able to customize generated Title and Caption or Image Texts  to match your brand perfectly! You can directly post to your social media or schedule it for later.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
