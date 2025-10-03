import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaUpload, 
  FaFont, 
  FaImage, 
  FaSave, 
  FaCog,
  FaTimes,
  FaExpand,
  FaSpinner,
  FaMagic,
  FaPalette,
  FaLayerGroup,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import {WandSparkles} from 'lucide-react'
import TemplateModal from '../comps/TemplateModal';
// Throttle utility function for performance optimization
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const CustomizeTemplate = ({ setPageTitle, setShowBackArrow }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  

 
  // NEW: Custom image upload states
  const [customImages, setCustomImages] = useState([]);
  const [selectedCustomImage, setSelectedCustomImage] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const customImageInputRef = useRef(null); // NEW: Custom image input ref
  const dragStateRef = useRef({ isDragging: false });

  const isDesktop = window.innerWidth >= 768;


     const [aiTemplate, setAiTemplate] = useState(false);
  const [ai_temp_img, set_ai_temp] = useState('https://plus.unsplash.com/premium_photo-1759432614458-1a85120c66d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const [ai_template_loading, set_ai_template_loading] = useState(false);

  const [prompt,setPrompt]=useState('')
  const Generate_with_AI = async()=>{
set_ai_template_loading(true);
setAiTemplate(true)

    try {

      // const token = localStorage.getItem('token');
    const res = await axiosClient.post(`generate-gen`, {
      prompt: prompt,
    });
      set_ai_temp('data:image/png;base64,'+res.data.base64)
     
    } catch (error) {
      console.error(error);
      toast.error('Failed to load APIs');
    } finally {
     set_ai_template_loading(false);
    }
  }
  
const OpenCustomize = async () => {
  // Use the base64 image from ai_temp_img as a custom image and set as background
  setIsUploading(true);
  const img = new window.Image();
  img.onload = () => {
    // Keep max width/height 350px, but preserve aspect ratio
    const maxSize = 700;
    let width = img.width;
    let height = img.height;
    if (width > height) {
      if (width > maxSize) {
        height = Math.round((height / width) * maxSize);
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = Math.round((width / height) * maxSize);
        height = maxSize;
      }
    }

    const newCustomImage = {
      id: Date.now() + Math.random(),
      src: ai_temp_img,
      name: 'AI Generated Image',
      width,
      height
    };
    setCustomImages(prev => [...prev, newCustomImage]);
    setBackgroundImage(ai_temp_img);
    setCanvasSize({ width, height });
    setIsUploading(false);
    toast.success('AI image added as custom image and background! 🖼️');
  };
  img.src = ai_temp_img;
};

  const regenertateAI_Temp = async()=>{
set_ai_template_loading(true);
setAiTemplate(true)

    try {

      // const token = localStorage.getItem('token');
    const res = await axiosClient.post(`generate-gen`, {
      prompt: prompt,
      unique:1
    });
      set_ai_temp('data:image/png;base64,'+res.data.base64)
     
    } catch (error) {
      console.error(error);
      toast.error('Failed to load APIs');
    } finally {
     set_ai_template_loading(false);
    }
  }

  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle("Customize Template");
    fetchTemplate();

    // Prevent scroll during drag on mobile
    const preventScroll = (e) => {
      if (dragStateRef.current.isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [id]);

  const fetchTemplate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get(`user/template/temp/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTemplate(res.data.data);
      if (res.data.data.canvas) {
        const canvasData = JSON.parse(res.data.data.canvas);
        console.log(canvasData);
        setElements(canvasData.elements || []);
        setCustomImages(canvasData.customImages || []); // NEW: Load custom images
        if (canvasData.backgroundImage) {
          setBackgroundImage(canvasData.backgroundImage);
          setCanvasSize(canvasData.canvasSize || { width: 400, height: 400 });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  
  // NEW: Custom image upload handler
  const handleCustomImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const newCustomImage = {
              id: Date.now() + Math.random(),
              src: event.target.result,
              name: file.name,
              width: Math.min(img.width, 150),
              height: Math.min(img.height, 150)
            };
            
            setCustomImages(prev => [...prev, newCustomImage]);
            toast.success(`Custom image "${file.name}" uploaded! 🖼️`);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    e.target.value = '';
  };

  // NEW: Add custom image to canvas
  const addCustomImageToCanvas = (customImg) => {
    const newElement = {
      id: Date.now(),
      type: 'custom-image',
      x: 20,
      y: 20,
      width: customImg.width,
      height: customImg.height,
      customImageSrc: customImg.src,
      customImageName: customImg.name
    };
    
    setElements(prev => [...prev, newElement]);
    toast.success('Custom image added to canvas! ✨');
  };

  // NEW: Delete custom image
  const deleteCustomImage = (customImageId) => {
    setCustomImages(prev => prev.filter(img => img.id !== customImageId));
    // Also remove from canvas if it exists
    setElements(prev => prev.filter(el => !(el.type === 'custom-image' && el.customImageSrc === customImages.find(img => img.id === customImageId)?.src)));
    toast.success('Custom image deleted! 🗑️');
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          
          if (isDesktop) {
            // Desktop: Keep original logic - max 500px width
            const maxWidth = 500;
            if (width > maxWidth) {
              const aspectRatio = width / height;
              width = maxWidth;
              height = width / aspectRatio;
            }
          } else {
            // Mobile: Fit exactly within card width minus padding
            const cardWidth = window.innerWidth - 64; // Screen width - padding
            if (width > cardWidth) {
              const aspectRatio = width / height;
              width = cardWidth;
              height = width / aspectRatio;
            }
          }
          
          // Simulate loading for better UX
          setTimeout(() => {
            setBackgroundImage(e.target.result);
            setCanvasSize({ width: Math.round(width), height: Math.round(height) });
            setIsUploading(false);
            toast.success('Background uploaded successfully! 🎉');
          }, 1500);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e, elementType, elementData) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: elementType,
      data: elementData
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!dragData) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left - 50, canvasSize.width - 100));
      const y = Math.max(0, Math.min(e.clientY - rect.top - 20, canvasSize.height - 40));

      const newElement = {
        id: Date.now(),
        type: dragData.type,
        x,
        y,
        ...dragData.data,
      };

      setElements(prev => [...prev, newElement]);
      toast.success('Element added to canvas! ✨');
    } catch (error) {
      console.error('Error parsing drop data:', error);
      toast.error('Failed to add element');
    }
  };

  const addElement = (type) => {
    let newElement = {
      id: Date.now(),
      type,
      x: 20,
      y: 20,
    };

    switch (type) {
      case 'title':
        newElement = {
          ...newElement,
          text: 'Your Title Here',
          fontSize: isDesktop ? 28 : 22,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          color: '#000000',
          width: isDesktop ? 250 : 200,
          height: isDesktop ? 50 : 40,
        };
        break;
      case 'description':
        newElement = {
          ...newElement,
          text: 'Your description text goes here',
          fontSize: isDesktop ? 18 : 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          primaryColor: '#333333',
          secondaryColor: '#666666',
          width: isDesktop ? 280 : 220,
          height: isDesktop ? 80 : 60,
        };
        break;
      case 'image':
        newElement = {
          ...newElement,
          width: isDesktop ? 150 : 120,
          height: isDesktop ? 150 : 120,
          placeholder: true,
        };
        break;
    }

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} element added! 🎨`);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      setShowProperties(false);
    }
  };

  const handleElementClick = useCallback((element, e) => {
    e.stopPropagation();
    setSelectedElement(element);
    if (isDesktop) {
      setShowProperties(true);
    }
  }, [isDesktop]);

  const handleSettingsClick = useCallback((element, e) => {
    e.stopPropagation();
    setSelectedElement(element);
    setShowProperties(true);
  }, []);

  // Optimized throttled update function
  const throttledUpdateElement = useMemo(
    () => throttle((id, updates) => {
      setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
      setSelectedElement(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
    }, 16), // 60fps
    []
  );

  const updateElement = useCallback((id, updates) => {
    throttledUpdateElement(id, updates);
  }, [throttledUpdateElement]);

  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
    setShowProperties(false);
    toast.success('Element removed! 🗑️');
  }, []);

  // Optimized drag handler
  const handleSmoothDrag = useCallback((id, clientX, clientY) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    const x = Math.max(0, Math.min(clientX - rect.left - element.width/2, canvasSize.width - element.width));
    const y = Math.max(0, Math.min(clientY - rect.top - element.height/2, canvasSize.height - element.height));
    
    // Direct DOM manipulation for immediate visual feedback
    const elementNode = document.querySelector(`[data-element-id="${id}"]`);
    if (elementNode) {
      elementNode.style.left = `${x}px`;
      elementNode.style.top = `${y}px`;
    }
  }, [elements, canvasSize]);

  const handleResize = useCallback((id, newWidth, newHeight) => {
    const maxWidth = canvasSize.width - 20;
    const maxHeight = canvasSize.height - 20;
    const minSize = 30;
    
    const width = Math.max(minSize, Math.min(newWidth, maxWidth));
    const height = Math.max(minSize, Math.min(newHeight, maxHeight));
    
    updateElement(id, { width, height });
  }, [canvasSize, updateElement]);

  const saveTemplate = async () => {
    const savePromise = async () => {
      const token = localStorage.getItem('token');
      const canvasData = {
        elements,
        backgroundImage,
        canvasSize,
        customImages, // NEW: Include custom images in save data
        version: "1.0"
      };
      
      await axiosClient.post(`user/template/temp/${id}`, {
        content: JSON.stringify(canvasData)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    toast.promise(
      savePromise(),
      {
        loading: 'Saving template...',
        success: 'Template saved successfully! 💾',
        error: 'Failed to save template 😞'
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Canvas</h3>
          <p className="text-gray-600 animate-pulse">Preparing your creative workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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

      {/* Upload Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-orange-900/90 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <FaSpinner className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing Your Image</h3>
            <p className="text-gray-600 mb-4">Creating the perfect canvas for your design...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {!isDesktop && (
        <div className="w-full">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-lg border-b border-white/20 p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-gray-900 flex items-center">
                <FaPalette className="text-purple-500 mr-2" />
                {template?.name || 'Template'}
              </h1>
              <button
                onClick={saveTemplate}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <FaSave className="inline mr-2" />
                Save
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Background Upload */}
            {!backgroundImage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                    <FaUpload className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Background</h2>
                  <p className="text-gray-600">Start creating your masterpiece</p>
                </div>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all transform hover:scale-[1.02]"
                >
                  <FaUpload className="mx-auto text-3xl text-purple-500 mb-4" />
                  <p className="text-gray-700 font-semibold text-lg">Tap to upload image</p>
                  <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}

            {/* Add Elements */}
            {backgroundImage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <FaLayerGroup className="text-purple-500 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Add Elements</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => addElement('title')}
                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                      <FaFont className="text-white text-lg" />
                    </div>
                    <span className="text-sm font-semibold text-purple-800">Title</span>
                  </button>
                  
                  <button
                    onClick={() => addElement('description')}
                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 hover:border-pink-400 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                      <FaFont className="text-white text-lg" />
                    </div>
                    <span className="text-sm font-semibold text-pink-800">Text</span>
                  </button>
                  
                  <button
                    onClick={() => addElement('image')}
                    className="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                      <FaImage className="text-white text-lg" />
                    </div>
                    <span className="text-sm font-semibold text-orange-800">Image</span>
                  </button>
                </div>
              </div>
            )}

            {/* NEW: Custom Images Section */}
            {backgroundImage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaImage className="text-green-500 mr-3" />
                    <h3 className="text-lg font-bold text-gray-900">Custom Images</h3>
                  </div>
                  <button
                    onClick={() => customImageInputRef.current?.click()}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <FaUpload />
                    <span>Upload</span>
                  </button>
                </div>
                
                {customImages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                    <FaImage className="mx-auto text-3xl text-gray-400 mb-3" />
                    <p className="text-gray-500">No custom images uploaded</p>
                    <p className="text-sm text-gray-400 mt-1">Upload images to use in your design</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {customImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-green-400 transition-all">
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="absolute inset-0    items-center justify-center opacity-100 top-0"
                        style={{top:-16,left:-16}} 
                        >
                          <div className="flex space-x-2">
                            <button
                              onClick={() => addCustomImageToCanvas(img)}
                              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                              title="Add to Canvas"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                            <button
                              onClick={() => deleteCustomImage(img.id)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                              title="Delete Image"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 truncate">{img.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Canvas */}
            {backgroundImage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <FaMagic className="text-purple-500 mr-2" />
                    Your Canvas
                  </h3>
                  <span className="text-sm text-gray-500">{canvasSize.width}×{canvasSize.height}</span>
                </div>
                
                <div 
                  ref={canvasRef}
                  className="relative border-2 border-gray-200 rounded-2xl overflow-visible shadow-lg mx-auto"
                  style={{ 
                    width: canvasSize.width,
                    height: canvasSize.height
                  }}
                  onClick={handleCanvasClick}
                >
                  <img
                    src={backgroundImage}
                    alt="Background"
                    className="w-full h-full object-cover pointer-events-none select-none rounded-xl"
                    draggable={false}
                  />

                  {elements.map((element) => (
                    <MobileCanvasElement
                      key={element.id}
                      element={element}
                      selectedElement={selectedElement}
                      onElementClick={handleElementClick}
                      onSettingsClick={handleSettingsClick}
                      onDelete={deleteElement}
                      onDrag={handleSmoothDrag}
                      onResize={handleResize}
                      canvasSize={canvasSize}
                      dragStateRef={dragStateRef}
                      updateElement={updateElement}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-purple-600 hover:text-purple-800 underline font-medium"
                  >
                    Change Background Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="flex ">
          {/* Show Full Screen Upload UI when no background */}
          {!backgroundImage ? (
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              
              <div className="text-center max-w-2xl px-8 relative z-10">
                {/* Main Upload Area */}
                <div className="mb-12">
                  {/* <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-8 shadow-2xl animate-pulse">
                    <FaUpload className="text-white text-4xl" />
                  </div> */}
                  <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                    Create Your Template
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Transform your ideas into stunning Instagram posts with our AI-powered design canvas
                  </p>
                </div>

                {/* Upload Zone */}
          <div className="space-y-8">
  
  {/* AI prompt box (full width) */}
  <div className="group border-4 border-dashed border-purple-300 rounded-3xl p-8 md:p-16 bg-white/60 backdrop-blur-sm hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:via-pink-50 hover:to-orange-50 transition-all duration-300 hover:shadow-2xl w-full">
    <div className="flex flex-col items-stretch">
      <div className="w-20 h-20 self-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
        <WandSparkles className="text-white text-2xl" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">AI: Generate certificate template</h3>
      <p className="text-gray-600 text-lg mb-6 text-center">Describe the style, fields, and branding</p>

      <div className="space-y-4">
        <textarea
          className="w-full min-h-[140px] rounded-2xl border border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/60 outline-none p-4 text-gray-800 placeholder-gray-400 transition"
          placeholder="e.g., Royal blue theme, gold accents, serif headings, include Recipient Name, Course Title, Date, Director Signature, QR code bottom-right"
           value={prompt}
           onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex items-center justify-between">
          {/* <div className="text-xs text-gray-500">
            Tip: Mention colors, fonts, logos, margins, and elements like seals or QR codes.
          </div> */}
          <div 
          style={{
                display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%'
          }}
          >
            {/* <button
              onClick={() => setPrompt('Minimal monochrome, large serif title, subtle border, center seal, QR bottom-right')}
              className="px-3 py-2 text-sm rounded-xl border border-purple-200 text-purple-700 bg-white/70 hover:bg-purple-50 transition"
            >
              Suggest
            </button> */}
             
            <button
              onClick={Generate_with_AI}
              // onClick={() => setAiTemplate(true)}

              className="inline-flex self-center items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition"
            >
              <WandSparkles className="text-white" />
              Magic Generate
            </button>
            
          </div>
        </div>
      </div>

      {/* Optional: quick chips */}
      {/* <div className="mt-6 flex flex-wrap gap-2">
        {[
          'Royal Blue + Gold',
          'Minimal Monochrome',
          'Classic Serif',
          'Modern Sans',
          'With Seal Badge',
          'QR + Signature',
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => setPrompt((p) => (p ? p + ' | ' + chip : chip))}
            className="text-sm px-3 py-1.5 rounded-full border border-purple-200 text-purple-700 bg-white/70 hover:bg-purple-50 transition"
          >
            {chip}
          </button>
        ))}
      </div> */}
    </div>
  </div>

  <div className="flex items-center my-8">
    <div className="flex-grow h-px bg-gray-300" />
    <span className="mx-4 text-gray-500 font-semibold text-lg">OR</span>
    <div className="flex-grow h-px bg-gray-300" />
  </div>
  
{/* Upload box (full width) */}
  <div 
    onClick={() => fileInputRef.current?.click()}
    className="group border-4 border-dashed border-purple-300 rounded-3xl p-16 cursor-pointer hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:via-pink-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-white/60 backdrop-blur-sm w-full"
  >
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
        <FaUpload className="text-white text-2xl" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Drop your image here</h3>
      <p className="text-gray-600 text-lg mb-4">or click to browse your files</p>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          PNG, JPG, WEBP
        </span>
        <span className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Up to 10MB
        </span>
        <span className="flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          High Quality
        </span>
      </div>
    </div>
  </div>



</div>


 <TemplateModal
        open={aiTemplate}
        onClose={() => setAiTemplate(false)}
        imgSrc={ai_temp_img}
        onCustomize={() => {
         OpenCustomize()
           
        }}
        onRegenerate={()=>regenertateAI_Temp()}
        loading={ai_template_loading}
      />
{/*  */}

              </div>
            </div>
          ) : (
            <>
              {/* Left Sidebar - Elements */}
              <div className="w-80 bg-white/90 backdrop-blur-lg border-r border-white/20 shadow-xl">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaLayerGroup className="text-purple-500 mr-3" />
                    Design Elements
                  </h2>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FaFont className="text-purple-500 mr-2" />
                      Text Elements
                    </h3>
                    <div className="space-y-3">
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'title', {
                          text: 'Your Title Here',
                          fontSize: 28,
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          color: '#000000',
                          width: 250,
                          height: 50,
                        })}
                        className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 cursor-grab hover:border-purple-400 hover:shadow-lg transition-all active:cursor-grabbing select-none transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaFont className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Main Title</p>
                            <p className="text-xs text-gray-600">Eye-catching headlines</p>
                          </div>
                        </div>
                      </div>

                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'description', {
                          text: 'Your description text goes here',
                          fontSize: 18,
                          fontFamily: 'Arial',
                          fontWeight: 'normal',
                          primaryColor: '#333333',
                          secondaryColor: '#666666',
                          width: 280,
                          height: 80,
                        })}
                        className="group p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 cursor-grab hover:border-pink-400 hover:shadow-lg transition-all active:cursor-grabbing select-none transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-md">
                            <FaFont className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Description</p>
                            <p className="text-xs text-gray-600">Dual-color body text</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FaImage className="text-orange-500 mr-2" />
                      Media Elements
                    </h3>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'image', {
                        width: 150,
                        height: 150,
                        placeholder: true,
                      })}
                      className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 cursor-grab hover:border-orange-400 hover:shadow-lg transition-all active:cursor-grabbing select-none transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shadow-md">
                          <FaImage className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">AI Image</p>
                          <p className="text-xs text-gray-600">Resizable placeholder</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Custom Images Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <FaImage className="text-green-500 mr-2" />
                        Custom Images
                      </h3>
                      <button
                        onClick={() => customImageInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        Upload
                      </button>
                    </div>
                    
                    {customImages.length === 0 ? (
                      <div 
                        onClick={() => customImageInputRef.current?.click()}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all text-center"
                      >
                        <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload custom images</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {customImages.map((img) => (
                          <div
                            key={img.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'custom-image', {
                              width: img.width,
                              height: img.height,
                              customImageSrc: img.src,
                              customImageName: img.name
                            })}
                            className="group p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 cursor-grab hover:border-green-400 hover:shadow-lg transition-all active:cursor-grabbing select-none transform hover:scale-[1.02] relative"
                          >
                            <div className="flex items-center">
                              <img 
                                src={img.src} 
                                alt={img.name}
                                className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{img.name}</p>
                                <p className="text-xs text-gray-600">{img.width}×{img.height}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCustomImage(img.id);
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center - Canvas */}
              <div className="flex-1 flex flex-col">
                <div className="bg-white/95 backdrop-blur-lg border-b border-white/20 p-6 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <FaPalette className="text-purple-500 mr-3" />
                      {template?.name || 'Template Designer'}
                    </h1>
                    <button
                      onClick={saveTemplate}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold"
                    >
                      <FaSave className="inline mr-2" />
                      Save Template
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex justify-center">
                    <div
                      ref={canvasRef}
                      className={`relative border-2 ${isDragOver ? 'border-purple-400 bg-purple-50 shadow-2xl scale-105' : 'border-gray-300'} rounded-2xl overflow-visible shadow-xl transition-all duration-300 bg-white`}
                      style={{ width: canvasSize.width, height: canvasSize.height }}
                      onClick={handleCanvasClick}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <img
                        src={backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover pointer-events-none select-none rounded-xl"
                        draggable={false}
                      />

                      {isDragOver && (
                        <div className="absolute inset-0 border-4 border-dashed border-purple-400 bg-purple-100 bg-opacity-50 flex items-center justify-center pointer-events-none z-5">
                          <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border border-purple-200 animate-bounce">
                            <p className="text-purple-600 font-bold text-xl flex items-center">
                              <FaMagic className="mr-2" />
                              Drop element here
                            </p>
                          </div>
                        </div>
                      )}

                      {elements.map((element) => (
                        <DesktopCanvasElement
                          key={element.id}
                          element={element}
                          selectedElement={selectedElement}
                          onElementClick={handleElementClick}
                          onSettingsClick={handleSettingsClick}
                          onDelete={deleteElement}
                          onDrag={handleSmoothDrag}
                          onResize={handleResize}
                          canvasSize={canvasSize}
                          updateElement={updateElement}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-purple-600 hover:text-purple-800 underline font-medium"
                    >
                      Change Background Image
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Properties */}
              {showProperties && selectedElement && (
                <div className="w-80 bg-white/95 backdrop-blur-lg border-l border-white/20 shadow-xl z-10">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <FaCog className="text-purple-500 mr-2" />
                      Properties
                    </h3>
                    <button
                      onClick={() => setShowProperties(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto">
                    <PropertiesPanel 
                      element={selectedElement} 
                      updateElement={updateElement}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Mobile Properties Modal */}
      {!isDesktop && showProperties && selectedElement && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[75vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaCog className="text-purple-500 mr-2" />
                Element Settings
              </h3>
              <button
                onClick={() => setShowProperties(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <PropertiesPanel 
                element={selectedElement} 
                updateElement={updateElement}
              />
              
              {/* Mobile action buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    deleteElement(selectedElement.id);
                    setShowProperties(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                >
                  <FaTimes />
                  <span>Remove</span>
                </button>
                <button
                  onClick={() => setShowProperties(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        className="hidden"
      />
      
      {/* NEW: Custom Image Upload Input */}
      <input
        ref={customImageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleCustomImageUpload}
        className="hidden"
      />
    </div>
  );
};

// Optimized Mobile Canvas Element with no lag
const MobileCanvasElement = React.memo(({ 
  element, 
  selectedElement, 
  onElementClick, 
  onSettingsClick, 
  onDelete, 
  onDrag, 
  onResize,
  canvasSize,
  dragStateRef,
  updateElement
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: element.x, y: element.y });

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStateRef.current.isDragging = true;
    
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
    elementPos.current = { x: element.x, y: element.y };
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (e.touches[0]) {
        const deltaX = e.touches[0].clientX - dragStartPos.current.x;
        const deltaY = e.touches[0].clientY - dragStartPos.current.y;
        
        const newX = Math.max(0, Math.min(elementPos.current.x + deltaX, canvasSize.width - element.width));
        const newY = Math.max(0, Math.min(elementPos.current.y + deltaY, canvasSize.height - element.height));
        
        // Direct DOM manipulation for smooth visual feedback
        const elementNode = document.querySelector(`[data-element-id="${element.id}"]`);
        if (elementNode) {
          elementNode.style.left = `${newX}px`;
          elementNode.style.top = `${newY}px`;
        }
      }
    };
    
    const handleTouchEnd = (e) => {
      setIsDragging(false);
      dragStateRef.current.isDragging = false;
      
      // Update state only once at the end
      if (e.changedTouches && e.changedTouches[0]) {
        const deltaX = e.changedTouches[0].clientX - dragStartPos.current.x;
        const deltaY = e.changedTouches[0].clientY - dragStartPos.current.y;
        
        const newX = Math.max(0, Math.min(elementPos.current.x + deltaX, canvasSize.width - element.width));
        const newY = Math.max(0, Math.min(elementPos.current.y + deltaY, canvasSize.height - element.height));
        
        updateElement(element.id, { x: newX, y: newY });
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [element, canvasSize, updateElement, dragStateRef]);

  const handleResizeTouchStart = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startTouch = e.touches[0];
    const startWidth = element.width;
    const startHeight = element.height;
    
    const handleResizeTouchMove = (e) => {
      e.preventDefault();
      if (e.touches[0]) {
        const deltaX = e.touches[0].clientX - startTouch.clientX;
        const deltaY = e.touches[0].clientY - startTouch.clientY;
        
        const newWidth = Math.max(30, Math.min(startWidth + deltaX, canvasSize.width - element.x));
        const newHeight = Math.max(30, Math.min(startHeight + deltaY, canvasSize.height - element.y));
        
        // Direct DOM manipulation for visual feedback
        const elementNode = document.querySelector(`[data-element-id="${element.id}"]`);
        if (elementNode) {
          elementNode.style.width = `${newWidth}px`;
          elementNode.style.height = `${newHeight}px`;
        }
      }
    };
    
    const handleResizeTouchEnd = (e) => {
      // Update state only at the end
      if (e.changedTouches && e.changedTouches[0]) {
        const deltaX = e.changedTouches[0].clientX - startTouch.clientX;
        const deltaY = e.changedTouches[0].clientY - startTouch.clientY;
        
        const newWidth = Math.max(30, Math.min(startWidth + deltaX, canvasSize.width - element.x));
        const newHeight = Math.max(30, Math.min(startHeight + deltaY, canvasSize.height - element.y));
        
        updateElement(element.id, { width: newWidth, height: newHeight });
      }
      
      document.removeEventListener('touchmove', handleResizeTouchMove);
      document.removeEventListener('touchend', handleResizeTouchEnd);
    };
    
    document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
    document.addEventListener('touchend', handleResizeTouchEnd);
  }, [element, canvasSize, updateElement]);

  return (
    <div
      data-element-id={element.id}
      className={`absolute transition-none ${
        selectedElement?.id === element.id 
          ? 'ring-2 ring-purple-500 ring-opacity-70 shadow-lg' 
          : ''
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        className="w-full h-full touch-manipulation"
        onClick={(e) => onElementClick(element, e)}
        onTouchStart={handleTouchStart}
      >
        {(element.type === 'title' || element.type === 'description') && (
          <div
            className="w-full h-full flex items-center justify-center text-center px-2 py-1"
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
          <div className="w-full h-full bg-gray-200 bg-opacity-90 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-400 backdrop-blur-sm">
            <div className="text-center">
              <FaImage className="text-gray-600 text-xl mx-auto mb-2" />
              <span className="text-xs text-gray-600 block font-medium">AI Image</span>
              <span className="text-xs text-gray-500 block">{element.width}×{element.height}</span>
            </div>
          </div>
        )}

        {/* NEW: Custom Image Rendering */}
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

      {/* Enhanced Action Buttons for Mobile */}
      {selectedElement?.id === element.id && (
        <>
          <button
            onClick={(e) => onSettingsClick(element, e)}
            className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-20"
          >
            <FaCog className="text-sm" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-20"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Enhanced Resize Handle for Mobile */}
          <div
            className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 cursor-se-resize z-20 flex items-center justify-center rounded-tl-2xl shadow-lg touch-manipulation"
            onTouchStart={handleResizeTouchStart}
          >
            <FaExpand className="text-white text-sm" />
          </div>
        </>
      )}
    </div>
  );
});

// Optimized Desktop Canvas Element
const DesktopCanvasElement = React.memo(({ 
  element, 
  selectedElement, 
  onElementClick, 
  onSettingsClick, 
  onDelete, 
  onDrag, 
  onResize,
  canvasSize,
  updateElement
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: element.x, y: element.y });

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementPos.current = { x: element.x, y: element.y };
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const newX = Math.max(0, Math.min(elementPos.current.x + deltaX, canvasSize.width - element.width));
      const newY = Math.max(0, Math.min(elementPos.current.y + deltaY, canvasSize.height - element.height));
      
      // Direct DOM manipulation for smooth visual feedback
      const elementNode = document.querySelector(`[data-element-id="${element.id}"]`);
      if (elementNode) {
        elementNode.style.left = `${newX}px`;
        elementNode.style.top = `${newY}px`;
      }
    };
    
    const handleMouseUp = (e) => {
      setIsDragging(false);
      
      // Update state only once at the end
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const newX = Math.max(0, Math.min(elementPos.current.x + deltaX, canvasSize.width - element.width));
      const newY = Math.max(0, Math.min(elementPos.current.y + deltaY, canvasSize.height - element.height));
      
      updateElement(element.id, { x: newX, y: newY });
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, canvasSize, updateElement]);

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    
    const handleResizeMove = (e) => {
      const newWidth = Math.max(30, Math.min(startWidth + (e.clientX - startX), canvasSize.width - element.x));
      const newHeight = Math.max(30, Math.min(startHeight + (e.clientY - startY), canvasSize.height - element.y));
      
      // Direct DOM manipulation for visual feedback
      const elementNode = document.querySelector(`[data-element-id="${element.id}"]`);
      if (elementNode) {
        elementNode.style.width = `${newWidth}px`;
        elementNode.style.height = `${newHeight}px`;
      }
    };
    
    const handleResizeEnd = (e) => {
      // Update state only at the end
      const newWidth = Math.max(30, Math.min(startWidth + (e.clientX - startX), canvasSize.width - element.x));
      const newHeight = Math.max(30, Math.min(startHeight + (e.clientY - startY), canvasSize.height - element.y));
      
      updateElement(element.id, { width: newWidth, height: newHeight });
      
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [element, canvasSize, updateElement]);

  return (
    <div
      data-element-id={element.id}
      className={`absolute transition-none ${
        selectedElement?.id === element.id 
          ? 'ring-2 ring-purple-500 ring-opacity-70 shadow-lg' 
          : ''
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        className="w-full h-full"
        onClick={(e) => onElementClick(element, e)}
        onMouseDown={handleMouseDown}
      >
        {(element.type === 'title' || element.type === 'description') && (
          <div
            className="w-full h-full flex items-center justify-center text-center px-2 py-1"
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
          <div className="w-full h-full bg-gray-200 bg-opacity-90 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-400 backdrop-blur-sm">
            <div className="text-center">
              <FaImage className="text-gray-600 text-xl mx-auto mb-2" />
              <span className="text-xs text-gray-600 block font-medium">AI Image</span>
              <span className="text-xs text-gray-500 block">{element.width}×{element.height}</span>
            </div>
          </div>
        )}

        {/* NEW: Custom Image Rendering */}
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

      {/* Action Buttons */}
      {selectedElement?.id === element.id && (
        <>
          <button
            onClick={(e) => onSettingsClick(element, e)}
            className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-20"
          >
            <FaCog className="text-xs" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-20"
          >
            <FaTimes className="text-xs" />
          </button>

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 cursor-se-resize z-20 flex items-center justify-center rounded-tl-lg shadow-md"
            onMouseDown={handleResizeStart}
          >
            <FaExpand className="text-white text-xs" />
          </div>
        </>
      )}
    </div>
  );
});

// Enhanced Properties Panel
const PropertiesPanel = React.memo(({ element, updateElement }) => {
  if (!element) return null;

  return (
    <div className="space-y-6">
      {(element.type === 'title' || element.type === 'description') && (
        <>
          <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FaFont className="mr-2 text-purple-500" />
              Font Size: {element.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="48"
              value={element.fontSize}
              onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
              className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>48px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
              <select
                value={element.fontFamily}
                onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              >
                <option disabled={true}>Sans-serif</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Verdana">Verdana</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Impact">Impact</option>
                <option value="Gill Sans">Gill Sans</option>

                <option disabled={true}>Serif</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Garamond">Garamond</option>
                <option value="Palatino Linotype">Palatino Linotype</option>
                <option value="Book Antiqua">Book Antiqua</option>
                <option value="Lucida Bright">Lucida Bright</option>

                <option disabled={true}>Monospace</option>
                <option value="Courier New">Courier New</option>
                <option value="Lucida Console">Lucida Console</option>
                <option value="Monaco">Monaco</option>
                <option value="Consolas">Consolas</option>

                <option disabled={true}>Cursive</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Brush Script MT">Brush Script MT</option>

                <option disabled={true}>Fantasy</option>
                <option value="Papyrus">Papyrus</option>
                <option value="Copperplate">Copperplate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Font Weight</label>
              <select
                value={element.fontWeight}
                onChange={(e) => updateElement(element.id, { fontWeight: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              >
                <option value="300">Light</option>
                <option value="normal">Normal</option>
                <option value="600">Semi Bold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>

          {element.type === 'title' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FaPalette className="mr-2 text-purple-500" />
                Text Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={element.color}
                  onChange={(e) => updateElement(element.id, { color: e.target.value })}
                  className="w-full h-14 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-3 py-1 rounded-b-xl border-t">
                  <span className="text-xs text-gray-600 font-mono">{element.color}</span>
                </div>
              </div>
            </div>
          )}

          {element.type === 'description' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaPalette className="mr-2 text-purple-500" />
                  Primary Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={element.primaryColor}
                    onChange={(e) => updateElement(element.id, { primaryColor: e.target.value })}
                    className="w-full h-14 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-3 py-1 rounded-b-xl border-t">
                    <span className="text-xs text-gray-600 font-mono">{element.primaryColor}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Secondary Color</label>
                <div className="relative">
                  <input
                    type="color"
                    value={element.secondaryColor}
                    onChange={(e) => updateElement(element.id, { secondaryColor: e.target.value })}
                    className="w-full h-14 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-3 py-1 rounded-b-xl border-t">
                    <span className="text-xs text-gray-600 font-mono">{element.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {element.type === 'image' && (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 rounded-2xl border border-orange-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <FaExpand className="mr-2 text-orange-500" />
              Image Dimensions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Width (px)</label>
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={element.width}
                  onChange={(e) => updateElement(element.id, { width: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Height (px)</label>
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={element.height}
                  onChange={(e) => updateElement(element.id, { height: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Custom Image Properties */}
      {element.type === 'custom-image' && (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl border border-green-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <FaImage className="mr-2 text-green-500" />
              Custom Image Properties
            </h4>
            
            <div className="mb-4">
              <img 
                src={element.customImageSrc} 
                alt={element.customImageName}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <p className="text-xs text-gray-600 mt-2 text-center">{element.customImageName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Width (px)</label>
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={element.width}
                  onChange={(e) => updateElement(element.id, { width: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Height (px)</label>
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={element.height}
                  onChange={(e) => updateElement(element.id, { height: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center mb-2">
          <FaMagic className="text-blue-500 mr-2" />
          <span className="text-sm font-semibold text-blue-900">Pro Tip</span>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          Use the resize handle (bottom-right corner) for visual resizing, or input exact dimensions above for precision.
        </p>
      </div>



    </div>
  );
});

export default CustomizeTemplate;
