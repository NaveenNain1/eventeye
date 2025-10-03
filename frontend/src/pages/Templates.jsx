import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import axios from '../axios';

const Templates = ({ setPageTitle, setShowBackArrow }) => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPageTitle("Templates");
    setShowBackArrow(false);
    fetchTemplates();
  }, [setPageTitle, setShowBackArrow]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/user/template', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setTemplates(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/user/create-template');
  };

  const handleTemplateAction = (action, templateId) => {
    switch(action) {
      case 'view':
        navigate(`/user/templates/view/${templateId}`);
        break;
      case 'edit':
        navigate(`/user/templates/customize/${templateId}`);
        break;
      case 'delete':
        handleDeleteTemplate(templateId);
        break;
      default:
        break;
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`/user/template/${templateId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        // Remove template from state
        setTemplates(prev => prev.filter(template => template.id !== templateId));
      } catch (err) {
        console.error('Error deleting template:', err);
        setError('Failed to delete template. Please try again.');
      }
    }
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">Loading your templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      {templates.length !=0 && (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">My Templates</h1>
        <p className="text-gray-600 text-lg">Create and manage your Instagram post templates</p>
        {templates.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">{templates.length} template{templates.length !== 1 ? 's' : ''} created</p>
        )}
      </div>
 
      {/* Error Message */}
      { error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

    
 
      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Template Card */}
        <div 
          onClick={handleCreateNew}
          className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-xl border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-[1.02] p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <FaPlus className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New</h3>
          <p className="text-gray-500 text-center text-sm">Design a new template for your Instagram posts</p>
        </div>

        {/* Template Cards */}
        {templates.map((template) => (
          <div key={template.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
            {/* Template Preview */}
            <div className=" relative aspect-square bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {template.canvas ? (
                  // If canvas data exists, you might want to render it here
                  <div className="text-center p-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500">Canvas Ready</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-xs text-gray-500">Template Draft</p>
                  </div>
                )}
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/500 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction('view', template.id);
                    }}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    title="Preview Template"
                  >
                    <FaEye className="text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction('edit', template.id);
                    }}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    title="Edit Template"
                  >
                    <FaEdit className="text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateAction('delete', template.id);
                    }}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="Delete Template"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate" title={template.name}>
                  {template.name}
                </h3>
                <span className="text-xs text-gray-500">ID: {template.id}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 text-purple-800">
                    {template.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {template.language}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Last updated: {formatRelativeDate(template.updated_at)}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleTemplateAction('edit', template.id)}
                  className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Customize
                </button>
                <button
                  onClick={() => handleTemplateAction('view', template.id)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
   </>
)}
      {/* Empty State */}
      {templates.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500 mb-6">Create your first template to get started with AI-powered Instagram posts</p>
          <button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Your First Template
          </button>
        </div>
      )}

      {/* Refresh Button */}
      {templates.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={fetchTemplates}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
          >
            {loading ? 'Refreshing...' : 'Refresh Templates'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Templates;
