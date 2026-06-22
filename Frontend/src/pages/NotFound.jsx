import { Link } from 'react-router-dom'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 overflow-x-hidden">
      <div className="text-center max-w-lg mx-auto">

        {/* Big 404 */}
        <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">
          Error 404
        </p>
        <h1 className="text-[120px] sm:text-[160px] font-bold leading-none bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent select-none">
          404
        </h1>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 px-8 py-8 mt-4">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
            Page Not{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              Found
            </span>
          </h2>
          <p className="text-sm text-gray-900 mb-6 leading-relaxed">
            Oops! The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md text-sm"
            >
              <HomeIcon className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-900 hover:border-purple-300 hover:text-[#7c3aed] transition-all duration-200 text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default NotFound