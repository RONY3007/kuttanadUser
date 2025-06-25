import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Home, User, CreditCard, FileText, LogOut } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import BankDetails from './components/BankDetails';
import DisasterReport from './components/DisasterReport';
import { User as UserType } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard' | 'profile' | 'bank' | 'report'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure axios with base URL and interceptors
  const api = axios.create({
    baseURL: 'http://192.168.1.2:8082/kdr', // Matches your context path
  });

  // Add interceptor to include JWT token if available
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/users/me') // Endpoint to get current user (adjust if different)
        .then((response) => {
          setCurrentUser(response.data);
          setCurrentView('dashboard');
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/user/user-login', credentials);
      const { token } = response.data; // Extract token from response
      localStorage.setItem('token', token);
      // Fetch user data after login
      const userResponse = await api.get('/api/users/me');
      setCurrentUser(userResponse.data);
      setCurrentView('dashboard');
      setError(null);
    } catch (error) {
      setError('Login failed. Please check your email or password.');
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleRegister = async (userData: UserType, aadhaarImage: File | null) => {
    if (!aadhaarImage) {
      setError('Aadhaar image is required');
      return;
    }

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    formData.append('aadhaarImage', aadhaarImage);

    try {
      console.log('Sending registration request:', JSON.stringify(userData, null, 2)); // Log user data
      const response = await api.post('/user/user-register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Registration response:', response.data);
      // Login after registration to get token and user
      const loginResponse = await api.post('/user/user-login', {
        email: userData.userEmailID,
        password: userData.userPassword,
      });
      const { token } = loginResponse.data;
      localStorage.setItem('token', token);
      const userResponse = await api.get('/api/users/me');
      setCurrentUser(userResponse.data);
      setCurrentView('dashboard');
      setError(null);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error.response ? error.response.data : error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Kuttanad Disaster Relief</h1>
            </div>
            <p className="text-gray-600 text-lg">Report disaster damages and receive timely assistance</p>
          </div>
          
          {currentView === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              onSwitchToRegister={() => setCurrentView('register')} 
            />
          ) : (
            <Register 
              onRegister={handleRegister} 
              onSwitchToLogin={() => setCurrentView('login')} 
            />
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Kuttanad Relief Portal</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'profile' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              
              <button
                onClick={() => setCurrentView('bank')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'bank' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Bank Details
              </button>
              
              <button
                onClick={() => setCurrentView('report')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'report' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Report Disaster
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors ml-4"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && <Dashboard user={currentUser} />}
        {currentView === 'profile' && <Profile user={currentUser} onUpdateUser={setCurrentUser} />}
        {currentView === 'bank' && <BankDetails user={currentUser} />}
        {currentView === 'report' && <DisasterReport user={currentUser} />}
      </main>
    </div>
  );
}

export default App;