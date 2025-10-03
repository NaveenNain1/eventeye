import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaCreditCard, 
  FaBolt, 
  FaCheck, 
  FaFire, 
  FaRocket,
  FaCrown,
  FaSpinner,
  FaArrowRight,
  FaFont,
  FaImage
} from 'react-icons/fa';

const BuyCredits = ({ setPageTitle, setShowBackArrow }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userCredits, setUserCredits] = useState('--');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Buy Credits");
    setShowBackArrow(true);
    fetchUserCredits();
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchUserCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get('/user/credits/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCredits(response.data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
      toast.error('Failed to fetch current balance');
    }
  };

  const creditPlans = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: 249,
      originalPrice: 14.99,
      discount: '33%',
      popular: false,
      color: 'from-blue-500 to-cyan-500',
      icon: FaBolt,
      features: [
        '50 AI-generated templates',
        'Basic customization',
        'Standard quality images',
        '24/7 email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      credits: 150,
      price: 24.99,
      originalPrice: 39.99,
      discount: '38%',
      popular: true,
      color: 'from-purple-500 to-pink-500',
      icon: FaRocket,
      features: [
        '150 AI-generated templates',
        'Advanced customization',
        'High quality images',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 500,
      price: 79.99,
      originalPrice: 124.99,
      discount: '36%',
      popular: false,
      color: 'from-orange-500 to-red-500',
      icon: FaCrown,
      features: [
        '500 AI-generated templates',
        'Premium customization',
        '4K quality images',
        'Dedicated support'
      ]
    }
  ];

  const handlePurchase = async (plan) => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setSelectedPlan(plan);
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Step 1: Create order using GET request with query parameters (matching your backend)
      const orderResponse = await axiosClient.get('/user/credits/createOrder', {
        params: {
          amount: plan.price,
          tokens: plan.credits
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const { order_id, razorpay_key, amount, currency } = orderResponse.data;

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: razorpay_key,
        amount: amount,
        currency: currency,
        name: "AI Template Generator",
        description: `${plan.name} - ${plan.credits} Credits`,
        image: "/logo192.png", // Add your logo here
        order_id: order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment using GET request with query parameters (matching your backend)
            const verifyResponse = await axiosClient.get('/user/credits/verifyPayment', {
              params: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tokens: plan.credits
              },
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyResponse.data.message === 'Payment successfull!') {
              toast.success(`🎉 Payment successful! ${plan.credits} credits added to your account.`);
              setUserCredits(prev => prev + plan.credits);
              
              // Redirect after success
              setTimeout(() => {
                navigate('/user/credits');
              }, 2000);
            } else {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
            setSelectedPlan(null);
          }
        },
        prefill: {
          name: "User", // You can get this from user context
          email: "user@example.com", // You can get this from user context
          contact: "9876543210" // You can get this from user context
        },
        theme: {
          color: "#8B5CF6"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setSelectedPlan(null);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setIsProcessing(false);
        setSelectedPlan(null);
        toast.error('Payment failed: ' + response.error.description);
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error(error.response?.data?.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
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
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 45 }}>
          <div className="bg-white rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <FaSpinner className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h3>
            <p className="text-gray-600 mb-4">Please complete the payment to continue...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Current Credits Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
            <FaBolt className="text-yellow-500 mr-3 text-xl" />
            <span className="text-gray-700 font-medium text-lg">Current Credits: </span>
            <span className="text-3xl font-bold text-purple-600 ml-2">{userCredits}</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get more credits to create unlimited AI-powered templates
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {creditPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
                  plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50 scale-105' : ''
                }`}
                style={{ zIndex: plan.popular ? 2 : 1 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2">
                      <FaFire className="text-sm" />
                      <span className="font-bold text-sm">MOST POPULAR</span>
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg">
                    <span className="font-bold text-sm">Save {plan.discount}</span>
                  </div>
                </div>

                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${plan.color} p-8 text-white text-center`}>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                </div>

                {/* Pricing */}
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-lg text-gray-500 line-through">${plan.originalPrice}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <FaBolt className="text-yellow-500" />
                      <span className="text-2xl font-bold text-purple-600">{plan.credits}</span>
                      <span className="text-gray-600">credits</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${(plan.price / plan.credits).toFixed(3)} per credit
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaCheck className="text-green-600 text-xs" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={isProcessing}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                        : `bg-gradient-to-r ${plan.color}`
                    }`}
                  >
                    {selectedPlan?.id === plan.id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        <span>Pay with Razorpay</span>
                        <FaArrowRight className="text-sm" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Examples */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What You Can Create</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaFont className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Text-Based Templates</h3>
              <p className="text-gray-600">Create stunning quote cards, announcements, and text-heavy designs with beautiful typography.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaImage className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Visual Templates</h3>
              <p className="text-gray-600">Generate AI-powered images and combine them with text for eye-catching social media posts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
