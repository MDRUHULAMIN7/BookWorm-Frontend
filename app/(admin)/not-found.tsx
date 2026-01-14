import Link from 'next/link'
 import "../globals.css";
import { ArrowLeftCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
        <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-blue-400 text-white text-3xl font-bold shadow-md">
          404
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-400 text-white font-medium hover:bg-blue-500 transition-colors shadow"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
