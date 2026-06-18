import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#7c3aed]"></div>
          <p className="text-sm text-gray-400">Loading your courses…</p>
        </div>
      </div>
    );
  }

  const filters = [
    { key: 'all', label: 'All courses' },
    { key: 'in-progress', label: 'In progress' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 text-black">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-2">
            Learning
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            My{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              courses
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>

        {/* ── Search + filters ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 mb-7 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 cursor-pointer">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] transition bg-white"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 flex-shrink-0">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${filter === key
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-7 h-7 text-[#7c3aed]" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {courses.length === 0 ? 'No courses enrolled yet' : 'No courses match your filters'}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              {courses.length === 0
                ? 'Browse the catalog and start learning something new.'
                : 'Try a different filter or search term.'}
            </p>
            {courses.length === 0 && (
              <Link
                to="/courses"
                className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md"
              >
                Browse courses
              </Link>
            )}
          </div>
        ) : (
          /* ── Course grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredCourses.map((course) => {
              const studentProgress = course.userProgress || 0;
              const isComplete = studentProgress === 100;
              const isNew = studentProgress === 0;

              return (
                <div
                  key={course._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.courseThumbnail || 'https://via.placeholder.com/400x200'}
                      alt={course.courseTitle}
                      className="w-full h-40 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isComplete && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                        ✓ Done
                      </span>
                    )}
                    {isNew && (
                      <span className="absolute top-3 right-3 bg-[#7c3aed] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                        New
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="font-semibold text-sm md:text-base text-black mb-1 line-clamp-2 group-hover:text-[#7c3aed] transition-colors leading-snug">
                      {course.courseTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      by {course.creator?.username}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">Progress</span>
                        <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-[#7c3aed]'}`}>
                          {studentProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${isComplete
                            ? 'bg-green-500'
                            : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7]'
                            }`}
                          style={{ width: `${studentProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA button */}
                    <Link
                      to={`/student/watch/${course._id}`}
                      className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isComplete
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:opacity-90 shadow-sm'
                        }`}
                    >
                      {isNew ? 'Start course' : isComplete ? 'Review course' : 'Continue learning'}
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