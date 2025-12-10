import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000); // Clear error after 5 seconds
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && <ErrorToast message={error} />}
    </ErrorContext.Provider>
  );
};

const ErrorToast = ({ message }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#f44336', // Red
      color: 'white',
      padding: '16px',
      borderRadius: '4px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      {message}
    </div>
  );
};
