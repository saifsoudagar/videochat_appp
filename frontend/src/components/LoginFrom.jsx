import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(data));
      login(data);
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-12 bg-[#27272b] rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 pl-5 border rounded-full bg-[#333] text-white border-gray-600 focus:border-blue-400 focus:outline-none"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-5 border rounded-full bg-[#333] text-white border-gray-600 focus:border-blue-400 focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button 
          type="submit" 
          className="w-full bg-[#3361cc] hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all duration-200 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-blue-500/50"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
