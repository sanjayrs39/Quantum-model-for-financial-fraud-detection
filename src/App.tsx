import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check if user session exists in localStorage
      const storedSession = localStorage.getItem('securebank_session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        if (sessionData.role && sessionData.timestamp) {
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - sessionData.timestamp;
          if (sessionAge < 24 * 60 * 60 * 1000) {
            setUserRole(sessionData.role);
            setIsLoggedIn(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem('securebank_session');
          }
        }
      }
    } catch (error) {
      console.log('No existing session');
      localStorage.removeItem('securebank_session');
    }
    setIsLoading(false);
  };

  const handleLogin = (role: string) => {
    // Store session in localStorage
    const sessionData = {
      role,
      timestamp: Date.now()
    };
    localStorage.setItem('securebank_session', JSON.stringify(sessionData));
    
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      // Clear session from localStorage
      localStorage.removeItem('securebank_session');
    } catch (error) {
      console.log('Logout error:', error);
    }
    setIsLoggedIn(false);
    setUserRole('');
  };

  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-green-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading SecureBank AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {isLoggedIn ? (
        <Dashboard userRole={userRole} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}