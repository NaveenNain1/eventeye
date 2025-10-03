import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaDownload, 
  FaShare, 
  FaEdit,
  FaSpinner,
  FaMagic,
  FaPalette,
  FaEye,
  FaHeart,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaCheck
} from 'react-icons/fa';


const TemplatePreview = ({ setPageTitle, setShowBackArrow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const downloadRef = useRef(null);

  const isDesktop = window.innerWidth >= 768;

  // Demo AI-generated content (replace with actual API calls)
  const demoAIContent = {
    aiImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center",
    generatedText: {
      title: "Unlock Your Creative Potential",
      description: "Transform your ideas into stunning visual stories with AI-powered design tools"
    }
  };

  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle("Template Preview");
    fetchTemplatePreview();
  }, [id]);

  const fetchTemplatePreview = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get(`user/template/temp/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTemplate(res.data.data);
      
      // Parse template data and replace AI placeholders
      if (res.data.data.canvas) {
        const canvasData = JSON.parse(res.data.data.canvas);
        const processedData = await processTemplateWithAI(canvasData);
        setPreviewData(processedData);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template preview');
    } finally {
      setIsLoading(false);
    }
  };

  const processTemplateWithAI = async (canvasData) => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Replace AI placeholders with generated content
      const processedElements = canvasData.elements.map(element => {
        if (element.type === 'image' && element.placeholder) {
          return {
            ...element,
            aiImageUrl: demoAIContent.aiImage,
            placeholder: false
          };
        }
        
        if (element.type === 'title' && element.text === 'Your Title Here') {
          return {
            ...element,
            text: demoAIContent.generatedText.title
          };
        }
        
        if (element.type === 'description' && element.text === 'Your description text goes here') {
          return {
            ...element,
            text: demoAIContent.generatedText.description
          };
        }
        
        return element;
      });

      setIsGenerating(false);
      toast.success('AI content generated successfully! ✨');
      
      return {
        ...canvasData,
        elements: processedElements
      };
    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate AI content');
      return canvasData;
    }
  };

  const downloadTemplate = async () => {
    if (!canvasRef.current || !previewData) return;
    
    const downloadPromise = new Promise((resolve, reject) => {
      try {
        // Create a temporary canvas for high-quality export
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match preview exactly (2x for higher quality)
        const scale = 2;
        canvas.width = previewData.canvasSize.width * scale;
        canvas.height = previewData.canvasSize.height * scale;
        
        // Scale context for high quality while maintaining proportions
        ctx.scale(scale, scale);
        
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        let loadedImages = 0;
        const totalImages = 1 + 
          previewData.elements.filter(el => el.type === 'image' && el.aiImageUrl).length +
          previewData.elements.filter(el => el.type === 'custom-image' && el.customImageSrc).length; // Include custom images
        
        const checkComplete = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            // All images loaded, now draw everything
            drawCompleteTemplate();
          }
        };
        
        const drawCompleteTemplate = () => {
          // Clear canvas
          ctx.clearRect(0, 0, previewData.canvasSize.width, previewData.canvasSize.height);
          
          // Draw background first
          if (backgroundImg.complete) {
            ctx.drawImage(backgroundImg, 0, 0, previewData.canvasSize.width, previewData.canvasSize.height);
          }
          
          // Draw all elements in order
          previewData.elements.forEach(element => {
            if (element.type === 'title' || element.type === 'description') {
              // Set up text styling exactly as in preview
              ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
              ctx.fillStyle = element.type === 'description' ? element.primaryColor : element.color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Add text shadow for better readability (matching preview)
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
              ctx.shadowBlur = 4;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
              
              // Calculate text position exactly as in preview (centered)
              const textX = element.x + element.width / 2;
              const textY = element.y + element.height / 2;
              
              // Handle text wrapping for long text
              const words = element.text.split(' ');
              const maxWidth = element.width - 8; // Account for padding
              let line = '';
              let lines = [];
              
              for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                
                if (testWidth > maxWidth && n > 0) {
                  lines.push(line);
                  line = words[n] + ' ';
                } else {
                  line = testLine;
                }
              }
              lines.push(line);
              
              // Draw each line
              const lineHeight = element.fontSize * 1.2;
              const totalTextHeight = lines.length * lineHeight;
              const startY = textY - totalTextHeight / 2 + lineHeight / 2;
              
              lines.forEach((line, index) => {
                ctx.fillText(line.trim(), textX, startY + index * lineHeight);
              });
              
              // Reset shadow
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }
            
            if (element.type === 'image' && element.aiImageUrl) {
              const imgElement = aiImages.find(img => img.src === element.aiImageUrl);
              if (imgElement && imgElement.complete) {
                // Save context for clipping
                ctx.save();
                
                // Create rounded rectangle clipping path (matching preview)
                const radius = 12; // Match the rounded-xl class
                ctx.beginPath();
                ctx.roundRect(element.x, element.y, element.width, element.height, radius);
                ctx.clip();
                
                // Draw the image
                ctx.drawImage(imgElement, element.x, element.y, element.width, element.height);
                
                // Restore context
                ctx.restore();
              }
            }
            
            // Handle custom images in download
            if (element.type === 'custom-image' && element.customImageSrc) {
              const customImgElement = customImages.find(img => img.src === element.customImageSrc);
              if (customImgElement && customImgElement.complete) {
                // Save context for clipping
                ctx.save();
                
                // Create rounded rectangle clipping path (matching preview)
                const radius = 12; // Match the rounded-xl class
                ctx.beginPath();
                ctx.roundRect(element.x, element.y, element.width, element.height, radius);
                ctx.clip();
                
                // Draw the custom image
                ctx.drawImage(customImgElement, element.x, element.y, element.width, element.height);
                
                // Restore context
                ctx.restore();
              }
            }
          });
          
          // Export as high-quality image
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${template?.name?.replace(/[^a-z0-9]/gi, '_') || 'template'}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            resolve();
          }, 'image/png', 1.0); // Maximum quality
        };
        
        // Load background image
        const backgroundImg = new Image();
        backgroundImg.crossOrigin = 'anonymous';
        backgroundImg.onload = checkComplete;
        backgroundImg.onerror = () => reject(new Error('Failed to load background image'));
        backgroundImg.src = previewData.backgroundImage;
        
        // Load all AI images
        const aiImages = [];
        previewData.elements.forEach(element => {
          if (element.type === 'image' && element.aiImageUrl) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = checkComplete;
            img.onerror = checkComplete; // Continue even if AI image fails
            img.src = element.aiImageUrl;
            aiImages.push(img);
          }
        });
        
        // Load all custom images for download
        const customImages = [];
        previewData.elements.forEach(element => {
          if (element.type === 'custom-image' && element.customImageSrc) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = checkComplete;
            img.onerror = checkComplete; // Continue even if custom image fails
            img.src = element.customImageSrc;
            customImages.push(img);
          }
        });
        
        // If no images to load, check if we're ready
        if (aiImages.length === 0 && customImages.length === 0) {
          // Only background image to load
        }
        
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(downloadPromise, {
      loading: 'Preparing your masterpiece...',
      success: 'Template downloaded! 📥',
      error: 'Failed to download template. Please try again.'
    });
  };

  const shareTemplate = async (platform) => {
    const shareUrl = `${window.location.origin}/template/${id}`;
    const shareText = `Check out this amazing template: ${template?.name || 'Custom Template'}`;
    
    const shareLinks = {
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard! 📋');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    } else if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      toast.success(`Sharing on ${platform}! 🚀`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <FaSpinner className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Preview</h3>
          <p className="text-gray-600 animate-pulse">Preparing your masterpiece...</p>
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

      {/* AI Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-orange-900/90 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <FaMagic className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Magic in Progress</h3>
            <p className="text-gray-600 mb-4">Generating stunning content for your template...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {!isDesktop && (
        <div className="w-full">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-lg border-b border-white/20 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold text-gray-900 flex items-center">
                <FaEye className="text-purple-500 mr-2" />
                Preview
              </h1>
              <button
                onClick={() => navigate(`/user/templates/customize/${id}`)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={downloadTemplate}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
              >
                <FaDownload />
                <span>Download</span>
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
              >
                <FaShare />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Template Preview */}
          <div className="p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FaPalette className="text-purple-500 mr-2" />
                  {template?.name || 'Your Template'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaHeart className="text-red-500" />
                  <span>42 likes</span>
                </div>
              </div>
              
              {previewData && (
                <div 
                  ref={canvasRef}
                  className="relative border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg mx-auto"
                  style={{ 
                    width: previewData.canvasSize.width,
                    height: previewData.canvasSize.height
                  }}
                >
                  <img
                    src={previewData.backgroundImage}
                    alt="Template Background"
                    className="w-full h-full object-cover"
                  />

                  {previewData.elements.map((element) => (
                    <div
                      key={element.id}
                      className="absolute"
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                      }}
                    >
                      {(element.type === 'title' || element.type === 'description') && (
                        <div
                          className="w-full h-full  items-center justify-center text-center px-2 py-1"
                          style={{
                            fontSize: `${element.fontSize}px`,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            color: element.type === 'description' ? element.primaryColor : element.color,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            wordWrap: 'break-word',
                            lineHeight: '1.2',
                          }}
                        >
                          {element.text}
                        </div>
                      )}

                      {element.type === 'image' && (
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                          {element.aiImageUrl ? (
                            <img
                              src={element.aiImageUrl}
                              alt="AI Generated"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaMagic className="text-gray-400 text-2xl" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Custom Image Rendering - NO BUTTONS, JUST DISPLAY */}
                      {element.type === 'custom-image' && (
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={element.customImageSrc}
                            alt={element.customImageName || 'Custom Image'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="min-h-screen">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-lg border-b border-white/20 p-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                  <FaEye className="text-purple-500 mr-3" />
                  Template Preview
                </h1>
                <p className="text-gray-600">{template?.name || 'Your Amazing Template'}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(`/user/templates/customize/${id}`)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Template</span>
                </button>
                <button
                  onClick={downloadTemplate}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto p-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaPalette className="text-purple-500 mr-3" />
                    Final Design
                  </h2>
                  <p className="text-gray-600 mt-1">AI-enhanced template ready for use</p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                   Made with&nbsp; <FaHeart className="text-red-500" /> &nbsp;in India
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                {previewData && (
                  <div 
                    ref={canvasRef}
                    className="relative border-2 border-gray-300 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ 
                      width: previewData.canvasSize.width,
                      height: previewData.canvasSize.height
                    }}
                  >
                    <img
                      ref={downloadRef}
                      src={previewData.backgroundImage}
                      alt="Template Background"
                      className="w-full h-full object-cover"
                    />

                    {previewData.elements.map((element) => (
                      <div
                        key={element.id}
                        className="absolute pointer-events-none"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                        }}
                      >
                        {(element.type === 'title' || element.type === 'description') && (
                          <div
                            className="w-full h-full  items-center justify-center text-center px-2 py-1"
                            style={{
                              fontSize: `${element.fontSize}px`,
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              color: element.type === 'description' ? element.primaryColor : element.color,
                              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                              wordWrap: 'break-word',
                              lineHeight: '1.2',
                            }}
                          >
                            {element.text}
                          </div>
                        )}

                        {element.type === 'image' && (
                          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                            {element.aiImageUrl ? (
                              <img
                                src={element.aiImageUrl}
                                alt="AI Generated Content"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <FaMagic className="text-gray-400 text-3xl mx-auto mb-2" />
                                  <span className="text-gray-500 text-sm">AI Content</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Custom Image Rendering - NO BUTTONS, JUST DISPLAY */}
                        {element.type === 'custom-image' && (
                          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={element.customImageSrc}
                              alt={element.customImageName || 'Custom Image'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/20">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaShare className="text-purple-500 mr-3" />
                Share Template
              </h3>
              <p className="text-gray-600 mt-1">Let others see your amazing design</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => shareTemplate('facebook')}
                  className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-all transform hover:scale-105"
                >
                  <FaFacebook className="text-blue-600 text-xl" />
                  <span className="font-semibold text-blue-800">Facebook</span>
                </button>
                
                <button
                  onClick={() => shareTemplate('twitter')}
                  className="flex items-center justify-center space-x-3 p-4 bg-sky-50 hover:bg-sky-100 rounded-2xl border border-sky-200 transition-all transform hover:scale-105"
                >
                  <FaTwitter className="text-sky-600 text-xl" />
                  <span className="font-semibold text-sky-800">Twitter</span>
                </button>
                
                <button
                  onClick={() => shareTemplate('linkedin')}
                  className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-all transform hover:scale-105"
                >
                  <FaLinkedin className="text-blue-700 text-xl" />
                  <span className="font-semibold text-blue-800">LinkedIn</span>
                </button>
                
                <button
                  onClick={() => shareTemplate('instagram')}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl border border-purple-200 transition-all transform hover:scale-105"
                >
                  <FaInstagram className="text-purple-600 text-xl" />
                  <span className="font-semibold text-purple-800">Instagram</span>
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => shareTemplate('copy')}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-all transform hover:scale-105"
                >
                  {copied ? <FaCheck className="text-green-600 text-lg" /> : <FaCopy className="text-gray-600 text-lg" />}
                  <span className="font-semibold text-gray-800">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;
