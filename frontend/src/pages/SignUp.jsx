import React, { useState } from 'react';
import { api } from '../services/api';


const defaultOnSignUp = () => {
  console.log("User signed in");
  document.location.replace('/'); // Redirect to home page after sign in
}
export default function SignUp({ onSignup={defaultOnSignUp} }) {
  const [userData, setUserData] = useState({
    name: '', email: '', password: '', role: 'biller'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await api.post('/api/auth/signup', userData);
      onSignup(user);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={userData.name}
          onChange={(e) => setUserData({...userData, name: e.target.value})}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
          className="w-full p-2 mb-3 border rounded"
        />
        <select
          value={userData.role}
          onChange={(e) => setUserData({...userData, role: e.target.value})}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="biller">Biller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}