// app/(admin)/books/components/BookModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string };
  coverImage: string;
};

type Genre = {
  _id: string;
  name: string;
};

type BookFormInputs = {
  title: string;
  author: string;
  genre: string;
  description: string;
  summary: string;
  coverImage?: string;
};

type Props = {
  mode: 'create' | 'edit';
  book: Book | null;
  genres: Genre[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function BookModal({ mode, book, genres, onClose, onSuccess }: Props) {
  const [imageUrl, setImageUrl] = useState(book?.coverImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BookFormInputs>();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (mode === 'edit' && book) {
      const fetchBookDetails = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/book/${book._id}`);
          if (res.data.success) {
            const fullBook = res.data.data;
            reset({
              title: fullBook.title,
              author: fullBook.author,
              genre: fullBook.genre._id,
              description: fullBook.description,
              summary: fullBook.summary,
            });
          }
        } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
          toast.error('Failed to fetch book details',err);
        }
      };
      fetchBookDetails();
    }
  }, [mode, book, BASE_URL, reset]);

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

    setUploadingImage(true);
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
      setValue('coverImage', data.secure_url);
      toast.success('Cover image uploaded!');
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      toast.error(err.message || 'Image upload failed!');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: BookFormInputs) => {
    if (!imageUrl) {
      toast.error('Please upload a cover image');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...data, coverImage: imageUrl };

      if (mode === 'create') {
        const res = await axios.post(`${BASE_URL}/api/v1/book`, payload);
        if (res.data.success) {
          toast.success('Book created successfully!');
          onSuccess();
        }
      } else {
        const res = await axios.put(`${BASE_URL}/api/v1/book/${book?._id}`, payload);
        if (res.data.success) {
          toast.success('Book updated successfully!');
          onSuccess();
        }
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
     <div 
      className=" inset-0 z-50 flex items-center justify-center "
      onClick={handleBackdropClick}
    >
    <div className="fixed inset-0  bg-opacity-70 backdrop-blur-xs  pointer-events-auto flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Book' : 'Edit Book'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Cover Image Upload */}
          <div>
            <label className="label-field">Cover Image</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <Upload size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploadingImage ? 'Uploading...' : 'Choose Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <div className="relative w-20 h-28 rounded-lg overflow-hidden border-2 border-green-500">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="80px" />
                </div>
              )}
            </div>
            {uploadingImage && <p className="text-blue-600 text-sm mt-1">Uploading image...</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="label-field">Title *</label>
              <input
                type="text"
                placeholder="Book title"
                className={`input-field ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="label-field">Author *</label>
              <input
                type="text"
                placeholder="Author name"
                className={`input-field ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('author', { required: 'Author is required' })}
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-field">Genre *</label>
            <select
              className={`input-field ${
                errors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('genre', { required: 'Genre is required' })}
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
            {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre.message}</p>}
          </div>
          <div>
            <label className="label-field">Description *</label>
            <textarea
              rows={3}
              placeholder="Brief description"
              className={`input-field ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label-field">Summary *</label>
            <textarea
              rows={4}
              placeholder="Detailed summary"
              className={`input-field ${
                errors.summary ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('summary', { required: 'Summary is required' })}
            />
            {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage || !imageUrl}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : mode === 'create' ? 'Create Book' : 'Update Book'}
            </button>
          </div>
        </form>
      </div>
    </div></div>
  );
}