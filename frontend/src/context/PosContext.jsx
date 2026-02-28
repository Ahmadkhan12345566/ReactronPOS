import React, { createContext, useState, useEffect } from 'react';
import { useError } from './ErrorContext';

export const PosContext = createContext();

export const PosProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);

    // Add an event listener for unauthorized events
    const handleUnauthorized = () => {
      showError('Your session has expired. Please sign in again.');
      logout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [showError]);

  const login = (userData) => {
    const { user, token } = userData;
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <PosContext.Provider value={value}>
      {children}
    </PosContext.Provider>
  );
};
