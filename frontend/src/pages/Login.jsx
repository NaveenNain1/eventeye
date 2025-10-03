import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
// import toast
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";

const Login = ({ checkIfLoggedIn }) => {
  const navigate = useNavigate();

  // State Management
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [askName, setAskName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/send-otp', { mobile });
      setAskName(response.data.askName);
      //  setOtp(response.data.otp.toString().split(''))
      setStep(2);
      // Focus first OTP input after a short delay
      setTimeout(() => {
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pasteData.length && i < 6; i++) {
      newOtp[i] = pasteData[i];
    }
    
    // setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pasteData.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    if (askName && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = { mobile, otp: otpString };
    if (askName) {
      payload.name = name;
    }

    try {
      const { data } = await axiosClient.post('/verify-otp', payload);
      localStorage.setItem('token', data.token);
      await checkIfLoggedIn();
      navigate('/user/templates');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP or an error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
const connectWallet = async (e) => {
     if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        toast.loading('Logining with xxxx'+address.slice(-5))
        // setAccount(address);

        try{
  const { data } = await axiosClient.post('/login-wallet', {
    address:address,
    slice:'xxxx'+address.slice(-5)
  });
      localStorage.setItem('token', data.token);
        await checkIfLoggedIn();
      navigate('/user/templates');
      toast.success(data.data.message)
        }catch(err){
     const errorMessage = err.response?.data?.message || 'Invalid OTP or an error occurred.';

        }finally{
          toast.dismiss();
        }
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      toast.error("Please install MetaMask or another EVM wallet!")
      // alert("Please install MetaMask or another EVM wallet!");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
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
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">PostCraft AI</h1>
          <p className="text-gray-600 text-sm md:text-base">Create stunning Instagram posts with AI</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          {/* Step 1: Mobile Number Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Enter your mobile number to get started
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-lg">🇮🇳</span>
                      <span className="text-gray-600 ml-2">+91</span>
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength="10"
                      className="w-full pl-20 pr-4 py-4 text-lg border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || mobile.length !== 10}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </button>

              <div className="flex items-center w-full">
  <div className="flex-grow border-t border-gray-300"></div>
  <span className="px-3 text-gray-500">OR</span>
  <div className="flex-grow border-t border-gray-300"></div>
</div>

                <button
                type='button'
                 onClick={()=>{connectWallet()}}
                  // disabled={loading || mobile.length !== 10}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 text-lg"
                >
                  
                 <q>   Continue with Wallet</q>
                   
                </button>
              </form>
            </div>
          )}

          {/* Step 2: OTP and Name Input */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  We've sent a code to <span className="font-semibold text-gray-900">{mobile}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Name Field (if required) */}
                {askName && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Enhanced OTP Input Boxes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { 
                      setStep(1); 
                      setError(null); 
                      setOtp(['', '', '', '', '', '']); 
                      setName(''); 
                    }}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
                  >
                    Change mobile number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
