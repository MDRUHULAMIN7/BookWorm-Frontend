'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setCookie } from 'nookies';
import { Eye, EyeOff } from 'lucide-react';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/login', data);
      if (res.data.success) {
        setCookie(null, 'token', res.data.token, { path: '/' });
        setCookie(null, 'role', res.data.user.role, { path: '/' });
        setCookie(null, 'user', JSON.stringify(res.data.user), { path: '/' });

        toast.success(res.data.message);

        if (res.data.user.role === 'admin') router.push('/admin/dashboard');
        else router.push('/library');
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login to BookWorm</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`input-field ${errors.email ? 'error' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="password-wrapper">
            <label className="label-field">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className={`input-field ${errors.password ? 'error' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            <div className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
