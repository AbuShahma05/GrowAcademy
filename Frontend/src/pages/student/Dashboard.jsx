import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import {
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLearningTime: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/course/student/enrolled');

      if (data.success) {
        const courses = data.data;
        setRecentCourses(courses.slice(0, 4));

        setStats({
          enrolledCourses: courses.length,
          completedCourses: courses.filter(c => c.userProgress === 100).length,
          inProgressCourses: courses.filter(c => c.userProgress > 0 && c.userProgress < 100).length,
          totalLearningTime: courses.reduce((acc, c) => acc + (c.totalDuration || 0), 0)
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <BookOpenIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: 'Enrolled',
      value: stats.enrolledCourses,
      accent: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
      border: 'border-blue-100',
    },
    {
      icon: <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: 'In Progress ',
      value: stats.inProgressCourses,
      accent: 'bg-amber-900 text-amber-900',
      iconBg: 'bg-amber-100',
      border: 'border-amber-100',
    },
    {
      icon: <AcademicCapIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: 'Completed',
      value: stats.completedCourses,
      accent: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
      border: 'border-green-100',
    },
    {
      icon: <ClockIcon className="w-5 h-5 md:w-6 md:h-6" />,
      title: 'Learning Time',
      value: `${Math.floor(stats.totalLearningTime / 60)}h`,
      accent: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      border: 'border-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#7c3aed]"></div>
          <p className="text-sm text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Welcome header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              {user.username}
            </span>{' '}
            👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pick up where you left off and keep learning.</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border ${stat.border} shadow-md hover:shadow-md p-4 md:p-5 hover:border-purple-700 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3 ${stat.iconBg} ${stat.accent.split(' ')[1]}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-black mb-0.5">{stat.title}</p>
              <p className="text-2xl md:text-3xl font-bold text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Continue Learning ── */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-md hover:shadow-xl hover:border-purple-600 transition-all duration-300 overflow-hidden">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-black">Continue learning</h2>
            <Link
              to="/student/my-courses"
              className="text-xs md:text-sm font-semibold text-[#7c3aed] hover:text-[#a855f7] transition"
            >
              View all →
            </Link>
          </div>

          <div className="p-5 md:p-6">
            {recentCourses.length === 0 ? (
              <div className="text-center py-14">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="w-7 h-7 text-[#7c3aed]" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No courses yet</p>
                <p className="text-xs text-gray-400 mb-5">Start your learning journey by browsing available courses.</p>
                <Link
                  to="/courses"
                  className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md"
                >
                  Browse courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {recentCourses.map((course) => {
                  const studentProgress = course.userProgress || 0;
                  const isComplete = studentProgress === 100;

                  return (
                    <Link
                      key={course._id}
                      to={`/student/watch/${course._id}`}
                      className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden">
                        <img
                          src={course.courseThumbnail || 'https://via.placeholder.com/400x200'}
                          alt={course.courseTitle}
                          className="w-full h-36 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isComplete && (
                          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                            ✓ Done
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm md:text-base text-black mb-1 line-clamp-1 group-hover:text-[#7c3aed] transition-colors">
                          {course.courseTitle}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                          by {course.creator?.username}
                        </p>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-400">Progress</span>
                            <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-[#7c3aed]'}`}>
                              {studentProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7]'}`}
                              style={{ width: `${studentProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;