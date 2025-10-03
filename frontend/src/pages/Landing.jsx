import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('creators');
  const [activePricingTab, setActivePricingTab] = useState('monthly');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const instagramGradient = "bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500";
  const instagramButton = "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500";
  const instagramText = "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const navigationItems = [
    { 
      name: 'Platform', 
      href: 'platform', 
      dropdown: [
        { name: 'Features', action: () => scrollToSection('features') },
        { name: 'Templates', action: () => scrollToSection('templates') },
        { name: 'AI Engine', action: () => scrollToSection('ai-engine') },
        { name: 'Integrations', action: () => scrollToSection('integrations') }
      ]
    },
    { 
      name: 'Solutions', 
      href: 'solutions', 
      dropdown: [
        { name: 'For Creators', action: () => { setActiveTab('creators'); scrollToSection('solutions'); } },
        { name: 'For Businesses', action: () => { setActiveTab('businesses'); scrollToSection('solutions'); } },
        { name: 'For Agencies', action: () => { setActiveTab('agencies'); scrollToSection('solutions'); } },
        { name: 'For Enterprise', action: () => { setActiveTab('enterprise'); scrollToSection('solutions'); } }
      ]
    },
    { 
      name: 'Resources', 
      href: 'resources', 
      dropdown: [
        { name: 'Blog', action: () => scrollToSection('blog') },
        { name: 'Help Center', action: () => scrollToSection('help') },
        { name: 'Case Studies', action: () => scrollToSection('case-studies') },
        { name: 'API Docs', action: () => scrollToSection('api-docs') }
      ]
    },
    { name: 'Pricing', href: 'pricing' },
  ];

  const steps = [
    {
      id: 1,
      title: "Create Post Template",
      subtitle: "Drag & Drop Design",
      icon: "🎨",
      description: "Design stunning post layouts with our Instagram-inspired visual editor. 500+ templates optimized for maximum engagement.",
      color: "from-purple-500 to-pink-500",
      features: ["500+ Templates", "Drag & Drop", "Brand Kit", "Auto-resize"]
    },
    {
      id: 2,
      title: "Select Your Niche",
      subtitle: "Choose Category",
      icon: "🎯",
      description: "Pick from 50+ trending niches with AI-driven insights and competitor analysis for optimal content strategy.",
      color: "from-pink-500 to-orange-500",
      features: ["50+ Niches", "Trend Analysis", "Competitor Insights", "Optimal Timing"]
    },
    {
      id: 3,
      title: "Click Generate Post",
      subtitle: "AI Magic Happens",
      icon: "✨",
      description: "Our GPT-4 powered AI creates viral-ready content optimized for your specific niche and audience.",
      color: "from-orange-500 to-yellow-500",
      features: ["GPT-4 Powered", "Viral Optimization", "Brand Voice", "Multi-variant"]
    },
    {
      id: 4,
      title: "Complete Post Ready",
      subtitle: "Image, Title, Caption & Keywords",
      icon: "🚀",
      description: "Get professional posts with AI-generated images, engaging captions, strategic hashtags, and one-click copy functionality.",
      color: "from-yellow-500 to-pink-500",
      features: ["AI Images", "Smart Captions", "Strategic Hashtags", "One-click Copy"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "1.2M followers",
      image: "/api/placeholder/60/60",
      quote: "EventEye AI helped me grow from 100K to 1.2M followers in just 6 months. The content is always on-brand and engaging!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      company: "TechFlow Inc.",
      image: "/api/placeholder/60/60",
      quote: "Our engagement rates increased by 340% after switching to EventEye AI. The AI understands our brand voice perfectly.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Agency Owner",
      company: "Creative Studios",
      image: "/api/placeholder/60/60",
      quote: "Managing 50+ client accounts became effortless. We save 20+ hours weekly while delivering better results.",
      rating: 5
    }
  ];

  const pricingPlans = {
    monthly: [
      {
        name: "Starter",
        price: "$0",
        period: "/month",
        description: "Perfect for testing the waters",
        features: [
          "10 AI posts per month",
          "Basic templates",
          "Standard AI generation",
          "Community support",
          "Basic analytics"
        ],
        cta: "Get Started Free",
        popular: false,
        action: () => navigate('/login')
      },
      {
        name: "Creator",
        price: "$29",
        period: "/month",
        description: "For serious content creators",
        features: [
          "100 AI posts per month",
          "Premium templates",
          "Advanced AI generation",
          "Priority support",
          "Detailed analytics",
          "Brand kit integration",
          "Scheduling tools"
        ],
        cta: "Start Free Trial",
        popular: true,
        action: () => navigate('/login')
      },
      {
        name: "Business",
        price: "$89",
        period: "/month",
        description: "For growing businesses",
        features: [
          "500 AI posts per month",
          "All premium features",
          "Team collaboration",
          "Custom brand training",
          "API access",
          "Advanced analytics",
          "Multi-platform publishing",
          "White-label options"
        ],
        cta: "Start Free Trial",
        popular: false,
        action: () => navigate('/login')
      }
    ],
    yearly: [
      {
        name: "Starter",
        price: "$0",
        period: "/month",
        description: "Perfect for testing the waters",
        features: [
          "10 AI posts per month",
          "Basic templates",
          "Standard AI generation",
          "Community support",
          "Basic analytics"
        ],
        cta: "Get Started Free",
        popular: false,
        action: () => navigate('/login')
      },
      {
        name: "Creator",
        price: "$24",
        period: "/month",
        yearlyPrice: "$288/year",
        savings: "Save $60",
        description: "For serious content creators",
        features: [
          "100 AI posts per month",
          "Premium templates",
          "Advanced AI generation",
          "Priority support",
          "Detailed analytics",
          "Brand kit integration",
          "Scheduling tools"
        ],
        cta: "Start Free Trial",
        popular: true,
        action: () => navigate('/login')
      },
      {
        name: "Business",
        price: "$72",
        period: "/month",
        yearlyPrice: "$864/year",
        savings: "Save $204",
        description: "For growing businesses",
        features: [
          "500 AI posts per month",
          "All premium features",
          "Team collaboration",
          "Custom brand training",
          "API access",
          "Advanced analytics",
          "Multi-platform publishing",
          "White-label options"
        ],
        cta: "Start Free Trial",
        popular: false,
        action: () => navigate('/login')
      }
    ]
  };

  const solutionTabs = {
    creators: {
      title: "Perfect for Content Creators",
      description: "Everything you need to create viral content and grow your following",
      features: [
        { icon: "🎨", title: "Unlimited Templates", desc: "Access 500+ professionally designed templates" },
        { icon: "📈", title: "Growth Analytics", desc: "Track your content performance and optimize" },
        { icon: "🤖", title: "AI Assistant", desc: "Get personalized content suggestions" },
        { icon: "📱", title: "Mobile App", desc: "Create and publish on the go" }
      ],
      cta: { text: "Start Creating", action: () => navigate('/login') }
    },
    businesses: {
      title: "Scale Your Business Content",
      description: "Professional tools for businesses to maintain consistent brand presence",
      features: [
        { icon: "👥", title: "Team Collaboration", desc: "Work together with your marketing team" },
        { icon: "🎯", title: "Brand Management", desc: "Maintain consistent brand voice and style" },
        { icon: "📊", title: "Advanced Analytics", desc: "Deep insights into content performance" },
        { icon: "🔗", title: "Multi-platform", desc: "Publish across all social platforms" }
      ],
      cta: { text: "Start Business Trial", action: () => navigate('/login') }
    },
    agencies: {
      title: "Built for Marketing Agencies",
      description: "Manage multiple clients and scale your agency operations efficiently",
      features: [
        { icon: "🏢", title: "Client Management", desc: "Separate workspaces for each client" },
        { icon: "📋", title: "Approval Workflows", desc: "Client review and approval process" },
        { icon: "💰", title: "White Label", desc: "Branded platform for your agency" },
        { icon: "📈", title: "Client Reporting", desc: "Professional reports for clients" }
      ],
      cta: { text: "Book Agency Demo", action: () => navigate('/login') }
    },
    enterprise: {
      title: "Enterprise-Grade Solutions",
      description: "Custom solutions for large organizations with advanced needs",
      features: [
        { icon: "🔒", title: "Enterprise Security", desc: "SOC 2 compliance and advanced security" },
        { icon: "🛠️", title: "Custom Integrations", desc: "Connect with your existing tools" },
        { icon: "👨‍💼", title: "Dedicated Support", desc: "Dedicated customer success manager" },
        { icon: "🎯", title: "Custom Training", desc: "AI trained on your specific content" }
      ],
      cta: { text: "Contact Sales", action: () => navigate('/login') }
    }
  };

  const faqs = [
    {
      question: "How does the AI content generation work?",
      answer: "Our AI uses advanced language models trained on millions of successful social media posts. It analyzes your niche, brand voice, and current trends to generate engaging content that resonates with your audience."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Absolutely! All generated content is fully editable. You can modify text, swap images, adjust colors, and fine-tune everything to match your brand perfectly."
    },
    {
      question: "What social media platforms do you support?",
      answer: "We support all major platforms including Instagram, Facebook, Twitter, LinkedIn, TikTok, Pinterest, and more. Content is automatically optimized for each platform's specifications."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      } border-b border-gray-200`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => scrollToSection('hero')} className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${instagramGradient} rounded-2xl p-0.5`}>
                <div className="bg-white rounded-xl w-full h-full flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">EE</span>
                </div>
              </div>
              <span className="text-2xl font-black text-gray-900">EventEye AI</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  <button 
                    onClick={() => {
                      if (item.dropdown) {
                        setOpenDropdown(openDropdown === item.name ? null : item.name);
                      } else {
                        scrollToSection(item.href);
                      }
                    }}
                    className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <svg className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && openDropdown === item.name && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 mt-2 py-2 z-50">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => {
                            subItem.action();
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/login')}
                className={`${instagramButton} text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105`}
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <button 
                      onClick={() => {
                        if (item.dropdown) {
                          setOpenDropdown(openDropdown === item.name ? null : item.name);
                        } else {
                          scrollToSection(item.href);
                        }
                      }}
                      className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
                    >
                      <span>{item.name}</span>
                      {item.dropdown && (
                        <svg className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    {item.dropdown && openDropdown === item.name && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => {
                              subItem.action();
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left text-gray-600 hover:text-gray-800 py-1 text-sm"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/login')}
                    className={`${instagramButton} text-white px-6 py-3 rounded-full font-semibold w-full`}
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-8 border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-gray-700 font-medium text-sm">Used by 50,000+ creators worldwide</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Create Bulk Certificates with
            <span className={`${instagramText} block`}>
              AI in 4 Simple Steps
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            From drag-and-drop templates to AI-generated content with QR Code, titles, Ranks etc.
            Create share-ready certificates in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => navigate('/login')}
              className={`${instagramButton} text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}
            >
              <span>Start Creating Free</span>
              <span>✨</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>Watch Demo</span>
              <span>▶️</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 sm:gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl   p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-black text-gray-900 mb-2">2.5M+</div>
              <div className="text-gray-600 font-medium">Posts Created</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-black text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl font-black text-gray-900 mb-2">340%</div>
              <div className="text-gray-600 font-medium">Engagement Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven 4-step process that creates viral content in minutes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Steps List */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-start space-x-6 p-6 rounded-3xl transition-all cursor-pointer ${
                    currentStep === index 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                      <div className={`text-sm font-bold ${instagramText} uppercase tracking-wider`}>
                        Step {step.id}
                      </div>
                    </div>
                    <p className="text-purple-600 font-bold text-sm mb-3">{step.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.features.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Preview */}
            <div className="relative">
              <div className={`absolute inset-0 ${instagramGradient} rounded-3xl blur-xl opacity-20`}></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl bg-gradient-to-r ${steps[currentStep].color} shadow-lg`}>
                    {steps[currentStep].icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{steps[currentStep].title}</h3>
                  <p className={`font-bold ${instagramText}`}>{steps[currentStep].subtitle}</p>
                </div>

                {/* Dynamic Demo Content */}
                <div className="mb-8">
                  {/* Step 1: Template Builder */}
                  {currentStep === 0 && (
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-purple-300">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="h-16 bg-white rounded-xl shadow-sm border-2 border-purple-200 flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">📷 Image</span>
                        </div>
                        <div className="h-16 bg-white rounded-xl shadow-sm border-2 border-pink-200 flex items-center justify-center">
                          <span className="text-pink-600 font-semibold text-sm">📝 Title</span>
                        </div>
                      </div>
                      <div className="h-12 bg-white rounded-xl shadow-sm border-2 border-orange-200 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">🏷️ Hashtags</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Niche Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      {['🔥 Tech & AI', '💼 Business', '🎮 Gaming', '🍔 Food'].map((niche, idx) => (
                        <div 
                          key={idx}
                          className={`p-4 rounded-xl font-semibold transition-all cursor-pointer ${
                            idx === 0 
                              ? `${instagramButton} text-white shadow-lg` 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {niche}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Step 3: AI Generation */}
                  {currentStep === 2 && (
                    <div className={`${instagramGradient} text-white p-8 rounded-2xl`}>
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="font-bold text-lg">AI Processing...</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/20 rounded-xl p-3">
                          <div className="text-sm">Analyzing trending content...</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3">
                          <div className="text-sm">Generating viral-ready copy...</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3">
                          <div className="text-sm">Creating stunning visuals...</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 4: Final Result */}
                  {currentStep === 3 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-1 border-2 border-yellow-300">
                      <div className="bg-white rounded-xl p-6">
                        <div className="h-32 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl mb-4 flex items-center justify-center border-2 border-yellow-300">
                          <span className="text-orange-700 font-bold">🎨 AI Generated Image</span>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                          <div className="h-4 bg-gray-200 rounded-full w-4/5"></div>
                          <div className="h-4 bg-gray-200 rounded-full w-3/5"></div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {['#viral', '#trending', '#ai', '#content'].map((tag) => (
                            <span key={tag} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => navigate('/login')}
                          className={`${instagramButton} text-white px-4 py-2 rounded-full text-sm font-bold mt-4 w-full`}
                        >
                          📋 Copy All Content
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center space-x-3">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === currentStep 
                          ? `${instagramGradient} w-8` 
                          : 'bg-gray-300 w-3 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Built for Every Creator</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a solo creator or enterprise team, we have the perfect solution
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm">
              {Object.keys(solutionTabs).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab 
                      ? `${instagramButton} text-white shadow-lg` 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{solutionTabs[activeTab].title}</h3>
              <p className="text-lg text-gray-600">{solutionTabs[activeTab].description}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {solutionTabs[activeTab].features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${instagramGradient} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button 
                onClick={solutionTabs[activeTab].cta.action}
                className={`${instagramButton} text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105`}
              >
                {solutionTabs[activeTab].cta.text}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Loved by Creators Worldwide</h2>
            <p className="text-xl text-gray-600">See what our users are saying</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-2xl font-medium text-gray-900 mb-6 italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[activeTestimonial].role}</div>
                    <div className="text-purple-600 font-semibold text-sm">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? `${instagramGradient} w-8` 
                      : 'bg-gray-300 w-3 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 mb-8">Start free, scale as you grow</p>
            
            {/* Pricing Toggle */}
            <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setActivePricingTab('monthly')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  activePricingTab === 'monthly' 
                    ? `${instagramButton} text-white shadow-lg` 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setActivePricingTab('yearly')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  activePricingTab === 'yearly' 
                    ? `${instagramButton} text-white shadow-lg` 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans[activePricingTab].map((plan, index) => (
              <div 
                key={plan.name}
                className={`relative bg-white rounded-3xl shadow-xl border-2 p-8 ${
                  plan.popular ? 'border-purple-500 transform scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`${instagramButton} text-white px-6 py-2 rounded-full text-sm font-bold`}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 font-semibold">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-600 font-semibold text-sm mt-2">{plan.savings}</div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={plan.action}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    plan.popular
                      ? `${instagramButton} text-white hover:shadow-lg transform hover:scale-105`
                      : 'border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
            <button 
              onClick={() => navigate('/login')}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Need a custom enterprise solution? Contact our sales team →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about EventEye AI</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <svg 
                    className={`w-6 h-6 text-gray-400 transition-transform ${activeFAQ === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button 
              onClick={() => navigate('/login')}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Contact our support team →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-20 ${instagramGradient} text-white`}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">Ready to Go Viral?</h2>
          <p className="text-xl mb-12 opacity-90">
            Join 50,000+ creators who are already creating viral content with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-purple-600 px-10 py-4 rounded-full font-black text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-10 py-4 rounded-full font-black text-xl hover:bg-white hover:text-purple-600 transition-all"
            >
              Book a Demo
            </button>
          </div>

          <p className="text-white/80 mt-6 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <button onClick={() => scrollToSection('hero')} className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 ${instagramGradient} rounded-2xl p-0.5`}>
                  <div className="bg-white rounded-xl w-full h-full flex items-center justify-center">
                    <span className={`font-bold text-lg ${instagramText}`}>P</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-gray-900">EventEye AI</span>
              </button>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The world's most advanced AI-powered content creation platform. Create viral Instagram posts in minutes, not hours.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Instagram' },
                  { name: 'Twitter' },
                  { name: 'LinkedIn' },
                  { name: 'YouTube' }
                ].map((social) => (
                  <button 
                    key={social.name}
                    onClick={() => navigate('/login')}
                    className={`w-10 h-10 ${instagramGradient} rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all transform hover:scale-110`}
                  >
                    {social.name.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <div className="space-y-3 text-gray-600">
                <button onClick={() => scrollToSection('features')} className="block hover:text-gray-900 transition-colors">Features</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Templates</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Integrations</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">API</button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Solutions</h4>
              <div className="space-y-3 text-gray-600">
                <button onClick={() => { setActiveTab('creators'); scrollToSection('solutions'); }} className="block hover:text-gray-900 transition-colors">For Creators</button>
                <button onClick={() => { setActiveTab('businesses'); scrollToSection('solutions'); }} className="block hover:text-gray-900 transition-colors">For Businesses</button>
                <button onClick={() => { setActiveTab('agencies'); scrollToSection('solutions'); }} className="block hover:text-gray-900 transition-colors">For Agencies</button>
                <button onClick={() => { setActiveTab('enterprise'); scrollToSection('solutions'); }} className="block hover:text-gray-900 transition-colors">Enterprise</button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
              <div className="space-y-3 text-gray-600">
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Blog</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Help Center</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Case Studies</button>
                <button onClick={() => navigate('/login')} className="block hover:text-gray-900 transition-colors">Contact</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2025 EventEye AI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <button onClick={() => navigate('/login')} className="hover:text-gray-900 transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/login')} className="hover:text-gray-900 transition-colors">Terms of Service</button>
              <button onClick={() => navigate('/login')} className="hover:text-gray-900 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
