import React, { createContext, useEffect, useState, useContext } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </ErrorContext.Provider>
  );
};

const ErrorToast = ({ message, onClose }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-5 right-5 z-50 w-full max-w-sm rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          className="text-red-600 hover:text-red-800"
          onClick={onClose}
          aria-label="Dismiss error"
        >
          ×
        </button>
      </div>
    </div>
  );
};
