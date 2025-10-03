import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../axios';
import { 
  FaBolt, 
  FaHistory, 
  FaPlus, 
  FaMinus,
  FaCalendarAlt,
  FaSpinner,
   FaArrowUp,
  FaArrowDown,
  FaImage,
  FaFont,
  FaShoppingCart,
  FaInfinity
} from 'react-icons/fa';

const Credits = ({ setPageTitle, setShowBackArrow }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [creditHistory, setCreditHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("My Credits");
    setShowBackArrow(true);
    fetchCreditsData();
  }, []);

  const fetchCreditsData = async (page = 1) => {
    try {
      setIsLoading(page === 1);
      const token = localStorage.getItem('token');
      
      const [balanceResponse, historyResponse] = await Promise.all([
        axiosClient.get('/user/credits/balance', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosClient.get(`/user/credits/transactions?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUserCredits(balanceResponse.data.balance || 0);
      
      // if (page === 1) {
        setCreditHistory(historyResponse.data.data || []);
      
      
      setHasMore(historyResponse.data.hasMore || false);
      
    } catch (error) {
      console.error('Failed to fetch credits data:', error);
      // Use mock data on error
      setUserCredits(156);
      if (page === 1) {
        setCreditHistory(mockCreditHistory);
      }
      toast.error('Failed to load credits data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchCreditsData(1);
    setCurrentPage(1);
    setIsRefreshing(false);
    toast.success('Credits refreshed! 🔄');
  };

  const loadMore = async () => {
    const nextPage = currentPage + 1;
    await fetchCreditsData(nextPage);
    setCurrentPage(nextPage);
  };

  // Mock data for demonstration
  const mockCreditHistory = [
    {
      id: 1,
      type: 'purchase',
      amount: 150,
      description: 'Professional Pack Purchase',
      date: '2025-08-28T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      type: 'usage',
      amount: -5,
      description: 'AI Template Generation - Business Card',
      date: '2025-08-28T09:15:00Z',
      status: 'completed'
    },
    {
      id: 3,
      type: 'usage',
      amount: -3,
      description: 'Template Customization - Instagram Post',
      date: '2025-08-27T16:45:00Z',
      status: 'completed'
    },
    {
      id: 4,
      type: 'bonus',
      amount: 10,
      description: 'Welcome Bonus Credits',
      date: '2025-08-27T14:20:00Z',
      status: 'completed'
    },
    {
      id: 5,
      type: 'usage',
      amount: -8,
      description: 'Premium Template Download - Marketing Flyer',
      date: '2025-08-26T11:30:00Z',
      status: 'completed'
    },
    {
      id: 6,
      type: 'purchase',
      amount: 50,
      description: 'Starter Pack Purchase',
      date: '2025-08-25T19:22:00Z',
      status: 'completed'
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <FaShoppingCart className="text-green-600" />;
      case 'bonus':
        return <FaPlus className="text-blue-600" />;
      case 'usage':
        return <FaMinus className="text-orange-600" />;
      default:
        return <FaBolt className="text-purple-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase':
      case 'bonus':
        return 'text-green-600';
      case 'usage':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <FaSpinner className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Credits</h3>
          <p className="text-gray-600 animate-pulse">Fetching your balance and history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24">
      {/* Toast Container */}
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
            zIndex: 40,
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Current Balance Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium text-white/80 mb-2">Current Balance</h2>
                  <div className="flex items-center space-x-3">
                    <FaBolt className="text-3xl text-yellow-300" />
                    <span className="text-5xl font-bold">{userCredits}</span>
                    <span className="text-xl font-medium text-white/90">credits</span>
                  </div>
                </div>
                
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                >
                  {/* <FaRefresh className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} /> */}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-white/80">
                  <FaInfinity className="text-sm" />
                  <span className="text-sm">Never expires</span>
                </div>
                
                <button
                  onClick={() => navigate('/user/buy-credits')}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                >
                  <FaPlus className="text-sm" />
                  <span>Buy More</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FaArrowUp className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">+200</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Credits purchased</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaArrowDown className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">-44</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Credits used</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaImage className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Created this month</p>
          </div>
        </div> */}

        {/* Transaction History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <FaHistory className="text-purple-500" />
                <span>Transaction History</span>
              </h2>
              <span className="text-sm text-gray-500">Recent activity</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {creditHistory.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      {getTransactionIcon(transaction.amt<0 ?'usage':'purchase')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.remarks}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                          <FaCalendarAlt className="text-xs" />
                          <span>{(transaction.created_at)}</span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                         
                              'bg-green-100 text-green-800' 
                            
                        }`}>
                          {'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.amt<0 ?'usage':'purchase')}`}>
                      {transaction.amt > 0 ? '+' : ''}{transaction.amt}
                    </div>
                    <div className="text-sm text-gray-500">credits</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={loadMore}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Load More History
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/user/buy-credits')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaPlus className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Buy More Credits</h3>
                <p className="text-white/80 text-sm">Get credits to create more templates</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/user/templates')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaImage className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Create Templates</h3>
                <p className="text-white/80 text-sm">Start designing with your credits</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Credits;
