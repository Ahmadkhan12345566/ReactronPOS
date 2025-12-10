import { useEffect } from 'react';
import { useError } from '../context/ErrorContext';

const GlobalErrorHandler = () => {
  const { showError } = useError();

  useEffect(() => {
    const handleApiError = (event) => {
      showError(event.detail);
    };

    window.addEventListener('apiError', handleApiError);

    return () => {
      window.removeEventListener('apiError', handleApiError);
    };
  }, [showError]);

  return null; // This component does not render anything
};

export default GlobalErrorHandler;
