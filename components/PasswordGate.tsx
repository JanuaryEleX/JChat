import React, { useState } from 'react';

interface PasswordGateProps {
  onPasswordVerified: (apiKey: string, baseUrl: string) => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onPasswordVerified }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pass1 = import.meta.env.VITE_ACCESS_PASSWORD_1;
    const apiKey1 = import.meta.env.VITE_API_KEY_1;
    const baseUrl1 = import.meta.env.VITE_API_BASE_URL_1;

    const pass2 = import.meta.env.VITE_ACCESS_PASSWORD_2;
    const apiKey2 = import.meta.env.VITE_API_KEY_2;
    const baseUrl2 = import.meta.env.VITE_API_BASE_URL_2;

    if (password === pass1) {
      localStorage.setItem('kchat-password-verified', 'true');
      onPasswordVerified(apiKey1, baseUrl1);
    } else if (password === pass2) {
      localStorage.setItem('kchat-password-verified', 'true');
      onPasswordVerified(apiKey2, baseUrl2);
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Enter Access Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-md"
            placeholder="Password"
          />
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;