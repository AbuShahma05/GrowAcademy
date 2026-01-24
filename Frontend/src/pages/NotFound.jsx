import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-blue-600'>404</h1>
        <h2 className='text-4xl font-semibold mt-4 mb-6'>Page Not Found</h2>
        <p className='text-xl text-gray-600 mb-8'>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition'>
          <HomeIcon className='w-5 h-5' />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
