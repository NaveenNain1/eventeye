import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import html2canvas from 'html2canvas-pro';

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
  FaCheck,
  FaSearch
} from 'react-icons/fa';
import QRImage from '../comps/QRImage';

const CreatedPostView = ({ setPageTitle, setShowBackArrow }) => {
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
  const [aiContent, setAIContent] = useState(null);
  const isDesktop = window.innerWidth >= 768;
const [showChangeImageModal, setChangeImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);
  // Demo AI-generated content (replace with actual API calls)
  const demoAIContent = {
    aiImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center",
    generatedText: {
      title: "Unlock Your Creative Potential",
      description: "Transform your ideas into stunning visual stories with AI-powered design tools"
    }
  };

  useEffect(() => {
    console.log("Updated aiContent:", aiContent);
  }, [aiContent]);

  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle("Generated Post");
    fetchAIContent();
  }, [id]);

  const fetchAIContent = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get(`students/certidata/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAIContent(demoAIContent);
      setTemplate(res.data.content);
      // console.log("aiContent", res.data.post);
      // console.log("aiContent", aiContent);

      if (res.data.content) {
        const canvasData = JSON.parse(res.data.content);
        const processedData = await processTemplateWithAI(canvasData, demoAIContent);
        setPreviewData(processedData);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load ai content');
    } finally {
      setIsLoading(false);
    }
  }

  const processTemplateWithAI = async (canvasData, aiContent) => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("aiContent", aiContent);
    try {
      // Replace AI placeholders with generated content
      const processedElements = canvasData.elements.map(element => {
        if (element.type === 'image' && element.placeholder) {
          return {
            ...element,
            aiImageUrl: aiContent.image_path,
            placeholder: false
          };
        }
        
        if (element.type === 'title' && element.text === 'Your Title Here') {
          return {
            ...element,
            text: aiContent.aititle
          };
        }
        
        if (element.type === 'description' && element.text === 'Your description text goes here') {
          return {
            ...element,
            text: aiContent.summary
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
    if (!canvasRef.current) return;
    
    const downloadPromise = new Promise(async (resolve, reject) => {
      try {
        // CRITICAL FIX: Handle CORS issues with images
        const container = canvasRef.current;
        const images = container.querySelectorAll('img');
        
        // Fix each image for CORS before capturing
        const imagePromises = Array.from(images).map(img => {
          return new Promise((imgResolve) => {
            if (img.src) {
              // Add cache buster to avoid cached CORS issues
              const url = new URL(img.src);
              url.searchParams.set('v', Date.now());
              
              // Set crossOrigin before changing src
              img.crossOrigin = 'anonymous';
              
              // Wait for image to load with new settings
              const newImg = new Image();
              newImg.crossOrigin = 'anonymous';
              newImg.onload = () => {
                img.src = newImg.src;
                imgResolve();
              };
              newImg.onerror = () => {
                // If CORS fails, try without crossOrigin
                img.crossOrigin = '';
                imgResolve();
              };
              newImg.src = url.toString();
            } else {
              imgResolve();
            }
          });
        });
        
        // Wait for all images to be processed
        await Promise.all(imagePromises);
        
        // Small delay to ensure images are rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture with optimized settings
        const canvas = await html2canvas(container, {
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          width: container.offsetWidth,
          height: container.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0
        });

        // Convert and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${template?.name?.replace(/[^a-z0-9]/gi, '_') || 'template'}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png', 1.0);
        
      } catch (error) {
        console.error('Download error:', error);
        reject(error);
      }
    });

    toast.promise(downloadPromise, {
      loading: 'Capturing your design...',
      success: 'Template downloaded! 📥',
      error: 'Failed to download. Trying alternative method...'
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Certificate</h3>
          <p className="text-gray-600 animate-pulse">Validating Certificate...</p>
        </div>
      </div>
    );
  }
const parseKeywords = (keywords) => {
  // If keywords is an array, return as is
  if (Array.isArray(keywords)) return keywords;
  // If it's a string, split by comma
  if (typeof keywords === 'string') return keywords.split(',').map(k => k.trim());
  // Otherwise, return empty array
  return [];
};

const CopiorMobile = ({ text, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setCopied(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-3">
            <span className="font-semibold text-gray-800 mb-1">{title}</span>
            <div className="w-full     bg-white border border-blue-200 rounded-xl shadow px-4 py-3">
                <span className="flex-1 text-gray-700 break-all">{text}</span>
                <button
                    onClick={handleCopy}
                    className={`ml-3 px-3 py-2 float-end rounded-lg font-medium transition-colors ${
                        copied
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
                    } flex items-center space-x-2`}
                >
                    {copied ? <FaCheck /> : <FaCopy />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
            </div>
        </div>
    );
};

const Copior = ({ text, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setCopied(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-3">
            <span className="font-semibold text-gray-800 mb-1">{title}</span>
            <div className="w-full flex items-center bg-white border border-blue-200 rounded-xl shadow px-4 py-3">
                <span className="flex-1 text-gray-700 break-all">{text}</span>
                <button
                    onClick={handleCopy}
                    className={`ml-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                        copied
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200"
                    } flex items-center space-x-2`}
                >
                    {copied ? <FaCheck /> : <FaCopy />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
            </div>
        </div>
    );
};
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
                onClick={() => navigate(`/user/templates/customize/${aiContent.user_template_id}`)}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <FaEdit className="inline mr-2" />
                Edit Template
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
             <div className="flex space-x-3 mt-5">
              <button
                onClick={()=>setChangeImageModal(true)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
              >
                <FaMagic />
                <span>Change Image</span>
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
          <div className="p-1 mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FaPalette className="text-purple-500 mr-2" />
                  {template?.name || 'Your Template'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  Made with &nbsp;<FaHeart className="text-red-500" />&nbsp; in India
                   
                </div>
              </div>
              
              {previewData && (
                <div className='overflow-x-auto'>
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
                            className="w-full h-full   items-center justify-center text-center px-2 py-1"
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
                            <span
                              dangerouslySetInnerHTML={{
                                __html: String(element.text ?? '')
                                  .replaceAll('&lt;sec&gt;', `<span style="color:${element.secondaryColor}">`)
                                  .replaceAll('&lt;/sec&gt;', `</span>`)
                                  .replaceAll('<sec>', `<span style="color:${element.secondaryColor}">`)
                                  .replaceAll('</sec>', `</span>`)
                              }}
                            />
                          </div>
                        )}

                        {element.type === 'image' && (
                          <div className="w-full h-full  overflow-hidden shadow-lg">
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

                        {/* NEW: Custom Image Rendering - NO BUTTONS, JUST DISPLAY */}
                        {element.type === 'custom-image' && (
                          <div className="w-full h-full  overflow-hidden shadow-lg">
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="min-h-screen flex justify-center align-middle">
        
          {/* Header */}
          {/* <div className="bg-white/95 backdrop-blur-lg border-b border-white/20 p-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                  <FaEye className="text-purple-500 mr-3" />
                  Generated Post
                </h1>
                <p className="text-gray-600">{template?.name || 'Your Amazing Post'}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={()=>setChangeImageModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <FaMagic />
                  <span>Change Image</span>
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
          </div> */}

          {/* Main Content */}
<div className='flex justify-center py-10 px-4'>
    
<div>
            <div >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaPalette className="text-purple-500 mr-3" />
                    Your Certificate  
                  </h2>
                  {/* <p className="text-gray-600 mt-1">AI-enhanced template ready for use</p> */}
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
                            className="w-full h-full   items-center justify-center text-center px-2 py-1"
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
                            <span
                              dangerouslySetInnerHTML={{
                                __html: String(element.text ?? '')
                                  .replaceAll('&lt;sec&gt;', `<span style="color:${element.secondaryColor}">`)
                                  .replaceAll('&lt;/sec&gt;', `</span>`)
                                  .replaceAll('<sec>', `<span style="color:${element.secondaryColor}">`)
                                  .replaceAll('</sec>', `</span>`)
                              }}
                            />
                          </div>
                        )}

                        {element.type === 'image' && (
                          <div >
                            {element.aiImageUrl ? (
                              <img
                                src={element.aiImageUrl}
                                alt="AI Generated Content"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div >
                                {/* <div className="text-center">
                                  <FaMagic className="text-gray-400 text-3xl mx-auto mb-2" />
                                  <span className="text-gray-500 text-sm">AI Content</span>
                                </div> */}
                                  <QRImage text='Nitish Here'  />
                              </div>
                            )}
                          </div>
                        )}
                        

                        {/* NEW: Custom Image Rendering - NO BUTTONS, JUST DISPLAY */}
                        {element.type === 'custom-image' && (
                          <div className="w-full h-full  overflow-hidden shadow-lg">
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
            {/* Share */}
            <br/>
<div className="flex justify-center space-x-4">
                {/* <button
                  onClick={()=>setChangeImageModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
                >
                  <FaMagic />
                  <span>Change Image</span>
                </button> */}
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
            {/* Share end */}
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


      {/* Change Image Modal */}      {showChangeImageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white  rounded-3xl  ${!isDesktop && `${Array.isArray(aiContent?.searchImages) && aiContent.searchImages.length > 0 ? ( ' h-[80vh] overflow-x-auto bottom-0' ):('')}`}  max-w sm:w-[60%] shadow-2xl border border-white/20`} >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaMagic className="text-purple-500 mr-3" />
                Change Image
              </h3>
              <p className="text-gray-600 mt-1">Select a new image for your template</p>
            </div>
            
            <div className="p-6 space-y-4">
             
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                // Add your search logic here (e.g., onChange handler)
              />
              <button
                className="flex justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition-all"
                // Add your search trigger logic here (e.g., onClick handler)
                onClick={async () => {
                  if (!searchQuery.trim()) {
                    toast.error('Please enter a search query');
                    return;
                  }
                  setIsSearching(true);
                  try {
                    // Example API call to Unsplash (replace with your actual API and key)
                    const token = localStorage.getItem('token');
                    const response = await axiosClient.get('user/unsplash/search', {
                      params: { search_query: searchQuery, per_page: 12, images:12 },
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    });
                    
                    const imageUrls = response.data.images.map(img => img);
                    setAIContent({
                      ...aiContent,
                      searchImages: imageUrls,
                      selectedImage: null
                    });
                  } catch (error) {
                    console.error('Image search error:', error);
                    toast.error('Failed to fetch images. Try again.');
                  } finally {
                    setIsSearching(false);
                  }
                }}
              >
                {isSearching ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <FaSearch className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {isSearching ? 'Searching...' : 'Search'}
                </span>
                
              </button>
            </div>
            {aiContent?.selectedImage && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={async() => {
                    const token = localStorage.getItem('token');
                    // Set the selected image in the previewData (replace image in template)
                   const response = await axiosClient.get('user/template/post-generated/update-img/'+aiContent.id, {
                      params: { image_path:aiContent.selectedImage },
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    });
                    navigate(0);
                    
                    if (previewData) {

                      const updatedElements = previewData.elements.map(el =>
                        el.type === 'image'
                          ? { ...el, aiImageUrl: aiContent.selectedImage }
                          : el
                      );
                      setPreviewData({ ...previewData, elements: updatedElements });
                      setChangeImageModal(false);
                      toast.success('Image updated!');
                    }
                  }}
                >
                  Set Image
                </button>
              </div>
            )}
            {/* Image Search Results Collage */}
            <div className="w-full overflow-x-auto py-6">
              {/* Example: Replace with your actual search results */}
              <div className={`grid ${!isDesktop ? 'grid-cols-2' : 'grid-cols-4'}  gap-4`}>
                {Array.isArray(aiContent?.searchImages) && aiContent.searchImages.length > 0 ? (
                  aiContent.searchImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        aiContent.selectedImage === imgUrl
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setAIContent({ ...aiContent, selectedImage: imgUrl })}
                    >
                      <img
                        src={imgUrl+"&w=500&fit=strech"} // Resize for performance
                        alt={`Search result ${idx + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      
                      {aiContent.selectedImage === imgUrl && (
                        <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Selected</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-500 py-8">
                    No images found. Try searching!
                  </div>
                )}
              </div>

            </div>

            {/* Set Image Button */}
            {aiContent?.selectedImage && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={async() => {
                    const token = localStorage.getItem('token');
                    // Set the selected image in the previewData (replace image in template)
                   const response = await axiosClient.get('user/template/post-generated/update-img/'+aiContent.id, {
                      params: { image_path:aiContent.selectedImage },
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    });
                    navigate(0);
                    
                    if (previewData) {

                      const updatedElements = previewData.elements.map(el =>
                        el.type === 'image'
                          ? { ...el, aiImageUrl: aiContent.selectedImage }
                          : el
                      );
                      setPreviewData({ ...previewData, elements: updatedElements });
                      setChangeImageModal(false);
                      toast.success('Image updated!');
                    }
                  }}
                >
                  Set Image
                </button>
              </div>
            )}
  </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setChangeImageModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}  
    </div>



  );
};

export default CreatedPostView;
