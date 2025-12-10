// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || 
              window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDev 
  ? 'http://localhost:3000' 
  : '';

// Helper function to handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
    if (response.status === 401 || response.status === 403) {
      // Token is invalid or expired, notify the app to log out
      window.dispatchEvent(new CustomEvent('apiError', { detail: error.error || 'You are not authorized to do that.' }));
      window.dispatchEvent(new Event('unauthorized'));
    } else {
        window.dispatchEvent(new CustomEvent('apiError', { detail: error.error || `HTTP error! status: ${response.status}` }));
    }
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
// frontend/src/services/api.js

// ... (keep API_BASE_URL and handleResponse functions as they are)

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get default headers
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // <-- Add the token
  }
  return headers;
};

export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getHeaders(), // <-- Use headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(), // <-- Use headers
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(), // <-- Use headers
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async postFormData(endpoint, data) {
    // FormData handles its own headers, but we still need the auth token
    const headers = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // <-- Add the token
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers, // <-- Use headers
        body: data,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API POST FormData Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(), // <-- Use headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};