import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const MyCourses = () => {
  const { user: _user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, filter, searchTerm]);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await API.get('/course/student/enrolled');
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (filter === 'in-progress') {
      filtered = filtered.filter(course => {
        const progress = course.userProgress || 0;
        return progress > 0 && progress < 100;
      });
    } else if (filter === 'completed') {
      filtered = filtered.filter(course => {
        const progress = course.userProgress || 0;
        return progress === 100;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Courses</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search my courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm md:text-base ${filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm md:text-base ${filter === 'in-progress'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm md:text-base ${filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              {courses.length === 0 ? 'No courses enrolled yet' : 'No courses match your filters'}
            </p>
            {courses.length === 0 && (
              <Link
                to="/courses"
                className="inline-block bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCourses.map((course) => {
              const studentProgress = course.userProgress || 0;

              return (
                <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  <img
                    src={course.courseThumbnail || 'https://via.placeholder.com/400x200'}
                    alt={course.courseTitle}
                    className="w-full h-40 md:h-48 object-cover"
                  />
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-xl font-semibold mb-2 line-clamp-2">
                      {course.courseTitle}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-4">
                      By {course.creator?.username}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs md:text-sm mb-2">
                        <span className="text-gray-600">Your Progress</span>
                        <span className="font-semibold text-blue-600">{studentProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                        <div
                          className={`h-2 md:h-3 rounded-full transition-all ${studentProgress === 100 ? 'bg-green-500' : 'bg-blue-600'
                            }`}
                          style={{ width: `${studentProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {studentProgress === 100 && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs md:text-sm mb-4 inline-block">
                        ✓ Completed
                      </div>
                    )}

                    <Link
                      to={`/student/watch/${course._id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 md:py-3 rounded hover:bg-blue-700 transition text-sm md:text-base"
                    >
                      {studentProgress === 0 ? 'Start Course' : studentProgress === 100 ? 'Review Course' : 'Continue Learning'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;