'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setCookie } from 'nookies';
import { Eye, EyeOff, BookOpen, Library } from 'lucide-react';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, data);
      if (res.data.success) {
        setCookie(null, 'token', res.data.token, { path: '/' });
        setCookie(null, 'role', res.data.user.role, { path: '/' });
        setCookie(null, 'user', JSON.stringify(res.data.user), { path: '/' });

        toast.success(res.data.message);

        if (res.data.user.role === 'admin') router.push('/admin/dashboard');
        else router.push('/user/library');
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-blue-50 to-blue-50 px-4">
      {/* Decorative book corner elements */}
      <div className="fixed top-0 left-0 w-64 h-64 opacity-10">
        <Library size={256} className="text-blue-900" />
      </div>
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-10">
        <BookOpen size={256} className="text-blue-900" />
      </div>

      <div className="relative w-full max-w-md">
 

        {/* Form Card */}
        <div className=" rounded-b-xl   p-8 shadow-2xl" 
             style={{ boxShadow: '0 10px 40px rgba(120, 53, 15, 0.1)' }}>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-400 font-serif mb-1">Welcome Back in BookWorm  </h2>
            <p className="text-gray-600 text-sm">Sign in to continue your reading journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
            <div>
              <label className="label-field">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="reader@bookwormhaven.com"
                  className={`w-full px-4 py-3 pl-12 bg-blue-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                    ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-blue-300 hover:border-blue-400'}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-field">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pl-12 bg-blue-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                    ${errors.password ? 'border-red-400 focus:ring-red-300' : 'border-blue-300 hover:border-blue-400'}`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-400 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={20} />
                  Sign In to Your Library
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-blue-300"></div>
            <span className="shrink mx-4 text-blue-500 text-sm">New to BookWorm?</span>
            <div className="grow border-t border-blue-300"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <a 
              href="/register" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-200 to-blue-100 text-blue-600 rounded-lg font-medium hover:from-blue-300 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 border border-blue-300 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Your Reading Account
            </a>
          </div>
        </div>

        {/* Decorative bottom corner */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-900 opacity-20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-blue-700 opacity-20 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default LoginPage;