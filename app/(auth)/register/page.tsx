'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Eye, EyeOff, BookOpen, Library, UserPlus, Upload, User } from 'lucide-react';
import Image from 'next/image';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setUploading(true);
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
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      toast.error(err.message || 'Image upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50/50 via-blue-50 to-blue-50 px-4">
      <div className="fixed top-0 left-0 w-64 h-64 opacity-10">
        <Library size={256} className="text-blue-900" />
      </div>
      <div className="fixed bottom-0 right-0 w-64 h-64 opacity-10">
        <BookOpen size={256} className="text-blue-900" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Form Card */}
        <div className="rounded-xl p-8 shadow-2xl bg-white"
             style={{ boxShadow: '0 10px 40px rgba(37, 99, 235, 0.1)' }}>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-400 font-serif mb-1">Join BookWorm Community</h2>
            <p className="text-gray-600 text-sm">Start your reading journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Custom Image Upload Button */}
            <div className="space-y-3">
              <label className="label-field">
                Profile Photo
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                ref={fileInputRef}
                className="hidden"
                id="photo-upload"
              />
              
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading}
                className={`w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${imageUrl ? 'border-solid border-green-400' : ''}`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600 font-medium">Uploading...</span>
                  </>
                ) : imageUrl ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-600 font-medium">Photo Uploaded!</span>
                    <span className="text-gray-600 text-sm">Click to change</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} className="text-gray-800" />
                    <span className="text-gray-800 font-medium">Click to Upload Photo</span>
                  </>
                )}
              </button>
              
              {imageUrl && (
                <div className="flex flex-col items-center pt-2">
                  <div className="relative w-24 h-24 overflow-hidden rounded-full border-4 border-blue-200 shadow-lg">
                    <Image 
                      src={imageUrl} 
                      alt="Profile preview" 
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready to use!
                  </p>
                </div>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="label-field">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 pl-12 bg-blue-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                    ${errors.name ? 'border-red-400 focus:ring-red-300' : 'border-blue-300 hover:border-blue-400'}`}
                  {...register('name', { required: 'Name is required' })}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={20} className="text-gray-800" />
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="label-field">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
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

            {/* Password Field */}
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-blue-700 transition-colors"
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
              disabled={loading || !imageUrl}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus size={20} />
                  Create Your Account
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-blue-300"></div>
            <span className="shrink mx-4 text-blue-500 text-sm">Already a member?</span>
            <div className="grow border-t border-blue-300"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <a 
              href="/login" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-100 to-blue-50 text-blue-600 rounded-lg font-medium hover:from-blue-200 hover:to-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 border border-blue-300 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In to Your Account
            </a>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-900 opacity-20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-blue-700 opacity-20 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default RegisterPage;