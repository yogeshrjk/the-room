import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

export default function SignupPage({ setCurrentPage }) {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      formData.append("username", email);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      if (password === confirmPassword) {
        formData.append("password", password);
      } else {
        setError("Passwords do not match");
        return;
      }
      setError("");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signup/`,
        formData
      );

      // console.log(response.data);
      alert("Signup successful");
      setCurrentPage("login");
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-warm-100 via-warm-50 to-sage-50 -z-10" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-blush-100 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-sage-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-2 mb-6 group">
            <img src="The.png" alt="" className=' w-20 h-25 md:w-30 md:h-35' />
          </button>
          <h1 className="font-serif text-3xl font-semibold text-warm-900 mb-2">Create your account</h1>
          <p className="text-warm-500">Join The Room and start your search</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-warm-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-blush-50 border border-blush-200 text-blush-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className='flex gap-2'>
              <div>
                <label className=" block text-sm font-medium text-warm-700 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                  <input
                    type="text"
                    value={lastName}
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="email"
                  value={email}
                  required
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
                  required
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

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-warm-800 text-warm-50 rounded-xl font-medium hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-500">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-warm-800 font-medium hover:text-warm-600 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
