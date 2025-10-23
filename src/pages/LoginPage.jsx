import React, { useState, useEffect } from 'react';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User is logged in, redirecting to dashboard');
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await signInWithGoogle();
      console.log('Google login successful, user:', user);
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Error signing in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = isLogin 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
      console.log('Email auth successful, user:', user);
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Email auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-text-primary rounded-2xl mb-4 mx-auto">
            <Dumbbell className="w-8 h-8 text-text-inverse" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">GymBros</h1>
          <p className="text-text-muted">Track your gym routines with ease</p>
        </div>

        {/* Auth Form */}
        <div className="bg-bg-card border border-border-secondary rounded-2xl p-6 shadow-xl">
          <div className="mb-6">
            <div className="flex bg-bg-tertiary rounded-xl p-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isLogin
                    ? 'bg-text-primary text-text-inverse shadow-md'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !isLogin
                    ? 'bg-text-primary text-text-inverse shadow-md'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-50 border border-error-600 rounded-xl text-error-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5">
                  <Mail className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-input border border-border-primary text-text-primary px-4 py-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5">
                  <Lock className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-input border border-border-primary text-text-primary px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1 w-5 h-5 flex items-center justify-center"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-text-primary text-text-inverse px-6 py-3 rounded-xl font-semibold hover:bg-secondary-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-primary" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-bg-secondary text-text-muted font-medium">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full bg-text-primary text-text-inverse px-6 py-3 rounded-xl font-semibold hover:bg-secondary-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-secondary-200 hover:border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="var(--color-google-blue)"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="var(--color-google-green)"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="var(--color-google-yellow)"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="var(--color-google-red)"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-text-inverse">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};