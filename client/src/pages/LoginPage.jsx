import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

export default function LoginPage({ setCurrentPage }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username: email,
          password: password,
        }
      );

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem("room_access", accessToken);
      localStorage.setItem("room_refresh", refreshToken);
      login(accessToken);

      setCurrentPage("home");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!forgotEmail) {
      setError("Please enter email");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/forgot-password/",
        { email: forgotEmail }
      );

      setError("New password sent to your email");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (error) {
      setError(
        error?.response?.data?.email ||
        "Email not found"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-warm-100 via-warm-50 to-sage-50 -z-10" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-sage-100 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blush-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-3">
          <img src="The.png" alt="The Room" className=' w-20 h-25 md:w-30 md:h-35' />
          <h1 className="font-serif text-3xl font-semibold text-warm-900 mb-2">Welcome back</h1>
          <p className="text-warm-500">Sign in to continue your room search</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-warm-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-blush-50 border border-blush-200 text-blush-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-warm-700 hover:text-warm-900"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-warm-800 text-warm-50 rounded-xl font-medium hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-500">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-warm-800 font-medium hover:text-warm-600 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          />

          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-warm-900 mb-3">
              Forgot Password
            </h2>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 bg-warm-50 border border-warm-200 rounded-xl text-sm"
              />

              <button
                type="submit"
                className="w-full py-2 bg-warm-800 text-white rounded-xl text-sm"
              >
                Send New Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
