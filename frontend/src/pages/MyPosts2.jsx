import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaDownload,
  FaEdit,
  FaEye,
  FaSpinner,
  FaImage,
  FaCalendarAlt,
  FaPalette,
  FaLayerGroup,
  FaPlus,
  FaRobot,
  FaHashtag
} from 'react-icons/fa';

// Move utility functions outside component to prevent recreation
const parseKeywords = (keywordsString) => {
  try {
    return JSON.parse(keywordsString || '[]');
  } catch {
    return [];
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPostThumbnail = (post) => {
  if (post.image_path) {
    return post.image_path + '&w=200&h=200&fit=crop';
  }
  
  try {
    if (post.template?.canvas) {
      const canvasData = JSON.parse(post.template.canvas);
      if (canvasData.backgroundImage) {
        return canvasData.backgroundImage;
      }
    }
  } catch (error) {
    console.error('Error parsing canvas data:', error);
  }
  
  return `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(post.aititle || post.title || 'Post')}`;
};

// Memoized Post Card Component
const PostCard = React.memo(({ post, onDownload, onView, onEdit, isDownloading }) => {
  const parsedKeywords = useMemo(() => parseKeywords(post.keywords), [post.keywords]);
  const formattedDate = useMemo(() => formatDate(post.created_at), [post.created_at]);
  const thumbnail = useMemo(() => getPostThumbnail(post), [post.image_path, post.template?.canvas, post.aititle, post.title]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col">
      {/* Post Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={thumbnail}
          alt={post.aititle || post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400/6366f1/ffffff?text=No+Preview';
          }}
        />
        
        {/* AI Badge */}
        {post.aititle && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
            <FaRobot />
            <span>AI Enhanced</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button
              onClick={() => onView(post.id)}
              className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              title="Preview Post"
            >
              <FaEye />
            </button>
            
            <button
              onClick={() => onEdit(post.user_template_id)}
              className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              title="Edit Post"
            >
              <FaEdit />
            </button>
          </div>
        </div>
      </div>

      {/* Post Info */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title Section */}
        <div className="mb-3 min-h-[3.5rem]">
          {post.aititle && (
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
              {post.aititle}
            </h3>
          )}
          
          <h4 className={`text-gray-600 line-clamp-1 leading-tight ${post.aititle ? 'text-sm' : 'text-lg font-bold text-gray-900'}`}>
            {post.aititle ? `Original: ${post.title}` : post.title}
          </h4>
        </div>
        
        {/* Summary */}
        <div className="mb-3 min-h-[2.5rem]">
          {post.summary && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {post.summary}
            </p>
          )}
        </div>
        
        {/* Keywords */}
        <div className="mb-3 min-h-[2rem]">
          {parsedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {parsedKeywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="inline-flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  <FaHashtag className="mr-1 text-xs" />
                  {keyword}
                </span>
              ))}
              {parsedKeywords.length > 3 && (
                <span className="text-xs text-gray-500">+{parsedKeywords.length - 3} more</span>
              )}
            </div>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaPalette className="text-purple-500 mr-2" />
            <span className="truncate">{post.template?.name || 'Unknown Template'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="text-pink-500 mr-2" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={() => onView(post.id)}
            disabled={isDownloading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 h-12"
          >
            {isDownloading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaDownload />
                <span>Download</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => onView(post.id)}
            className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 h-12"
          >
            <FaEye />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';

const MyPosts = ({ setPageTitle, setShowBackArrow }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const navigate = useNavigate();
  
  // Cache desktop check
  const isDesktop = useMemo(() => window.innerWidth >= 768, []);

  useEffect(() => {
    setShowBackArrow(false);
    setPageTitle("My Posts");
    fetchPosts();
  }, [setShowBackArrow, setPageTitle]);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get('/user/posts/all-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const sortedPosts = (res.data.posts || []).sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
      
      setPosts(sortedPosts);
      if (sortedPosts.length > 0) {
        // toast.success(`Found ${sortedPosts.length} posts! 🎨`);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized download function (simplified and moved to callback)
  const handleDownload = useCallback(async (post) => {
    if (downloadingIds.has(post.id)) return;
    
    setDownloadingIds(prev => new Set([...prev, post.id]));
    
    try {
      // Simplified download logic - you can implement the full canvas logic here
      // For now, just redirect to view page
      navigate(`/user/post/${post.id}`);
      
      toast.success('Redirected to post view! 📥');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to process post');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  }, [downloadingIds, navigate]);

  const handleView = useCallback((postId) => {
    navigate(`/user/post/${postId}`);
  }, [navigate]);

  const handleEdit = useCallback((templateId) => {
    navigate(`/user/templates/customize/${templateId}`);
  }, [navigate]);

  const handleCreateNew = useCallback(() => {
    navigate('/user/create-post');
  }, [navigate]);

  // Memoize posts count
  const postsCount = useMemo(() => posts.length, [posts.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <FaSpinner className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Posts</h3>
          <p className="text-gray-600 animate-pulse">Fetching your creative masterpieces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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

      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <FaLayerGroup className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Posts</h1>
                <p className="text-gray-600">{postsCount} AI-enhanced posts</p>
              </div>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 md:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
            >
              <FaPlus />
              <span className="hidden md:inline">Create New Post</span>
              <span className="md:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {postsCount === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-3xl mb-6">
              <FaImage className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start creating amazing social media posts with our AI-powered templates!
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg flex items-center space-x-3 mx-auto"
            >
              <FaPlus />
              <span>Create Your First Post</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDownload={handleDownload}
                onView={handleView}
                onEdit={handleEdit}
                isDownloading={downloadingIds.has(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MyPosts);
