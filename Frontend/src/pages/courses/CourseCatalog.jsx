import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const categories = [
    'Development',
    'DSA',
    'Machine Learning',
    'Business',
    'IT & Software',
    'Personal Development',
    'Photography',
    'Music',
    'Health & Fitness',
    'Teaching & Academics'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/course', {
        params: {
          search: searchTerm,
          category: selectedCategory,
          courseLevel: selectedLevel
        }
      });

      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
          Explore Courses
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-sm md:text-base">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg md:text-xl text-gray-600">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={course.courseThumbnail || 'https://via.placeholder.com/400x200'}
                  alt={course.courseTitle}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {course.courseLevel}
                    </span>
                  </div>

                  <h3 className="text-base md:text-xl font-semibold mb-2 line-clamp-2">
                    {course.courseTitle}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.subTitle || course.description}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.creator?.photoUrl || 'https://via.placeholder.com/40'}
                        alt={course.creator?.username}
                        className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border"
                      />

                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {course.creator?.username}
                      </span>

                    </div>

                    <div className="text-right">
                      {course.originalPrice && (
                        <p className="text-xs md:text-sm text-gray-400 line-through">
                          ₹{course.originalPrice}
                        </p>
                      )}
                      <p className="text-lg md:text-xl font-bold text-blue-600">
                        ₹{course.coursePrice}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default CourseCatalog;