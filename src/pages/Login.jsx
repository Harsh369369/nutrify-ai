import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInBtn from '../components/GoogleSignInBtn';
import { Leaf, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/setup');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (email, name) => {
    setGoogleLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await googleLogin(email, name);
      setShowGoogleModal(false);
      if (result.hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/setup');
      }
    } catch (err) {
      setError(err || 'Failed to sign in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8 bg-bgApp min-h-screen">
      <div className="max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-2 shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Nutrify AI</h1>
          <p className="text-xs text-gray-400 font-bold mt-0.5">AI-Powered Nutrition Plans</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Login</h2>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold p-3 rounded-xl mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold transition-colors focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-4 h-[48px] bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold transition-colors focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-[52px] rounded-full mt-6 transition-colors shadow-sm disabled:opacity-50 focus:outline-none"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              or continue with
            </span>
          </div>

          {googleLoading ? (
            <div className="py-4 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-[10px] font-bold text-gray-400">Connecting to Google...</p>
            </div>
          ) : (
            <div className="my-4 flex justify-center">
              <GoogleSignInBtn onError={setError} onSuccess={() => setGoogleLoading(true)} />
            </div>
          )}

          <p className="text-center text-xs font-bold text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
