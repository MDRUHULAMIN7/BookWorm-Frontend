'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  photo: string;
};

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'bookworm_uploads');

      const CLOUD_NAME = 'dpomtzref';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      setImageUrl(data.secure_url);
      toast.success('Photo uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Image upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    if (!imageUrl) return toast.error('Please upload a photo first!');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/register`, {
        ...data,
        photo: imageUrl,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Register to BookWorm</h2>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="label-field">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {loading && <p className="text-blue-600 text-sm mt-1">Uploading photo...</p>}
          {imageUrl && (
            <div className="mt-2">
              <p className="text-green-600 text-sm">Photo uploaded!</p>
              <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label-field">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className={`input-field ${errors.name ? 'error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

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
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
            <div className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !imageUrl}
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
