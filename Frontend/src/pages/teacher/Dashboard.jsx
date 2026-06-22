import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import {
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { user: _user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/course/teacher/created');
      if (data.success) {
        const teacherCourses = data.data;
        setCourses(teacherCourses);
        setStats({
          totalCourses: teacherCourses.length,
          publishedCourses: teacherCourses.filter(c => c.isPublished).length,
          totalStudents: teacherCourses.reduce((acc, c) => acc + (c.totalEnrollments || 0), 0),
          totalRevenue: teacherCourses.reduce((acc, c) => acc + ((c.coursePrice || 0) * (c.totalEnrollments || 0)), 0),
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
      Icon: BookOpenIcon,
      title: 'Total Courses',
      value: stats.totalCourses,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-[#7c3aed]',
    },
    {
      Icon: ChartBarIcon,
      title: 'Published',
      value: stats.publishedCourses,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      Icon: UserGroupIcon,
      title: 'Total Students',
      value: stats.totalStudents,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      Icon: CurrencyDollarIcon,
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
        <p className="text-gray-500 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <section className="relative py-10 md:py-16 mx-4 sm:mx-6 md:mx-10 lg:mx-16">
        <div className="container px-6 mx-auto md:px-12">

          {/* ── Header row ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-2">
                Instructor
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                Your{' '}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your courses and track performance</p>
            </div>

            <Link
              to="/teacher/create-course"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md text-sm whitespace-nowrap"
            >
              <PlusIcon className="w-4 h-4" />
              Create New Course
            </Link>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
            {statCards.map(({ Icon, title, value, bg, iconBg, iconColor }) => (
              <div
                key={title}
                className={`${bg} rounded-2xl border border-gray-300 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center`}
              >
                <div className={`${iconBg} w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
                <p className="text-xl md:text-3xl font-bold text-gray-900 truncate w-full text-center">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Courses section ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 overflow-hidden">

            {/* Section header */}
            <div className="px-5 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">Catalog</p>
                <h2 className="text-lg md:text-xl font-bold text-black">Your Courses</h2>
              </div>
              <span className="text-xs bg-purple-100 text-[#7c3aed] px-3 py-1 rounded-full font-semibold">
                {courses.length} total
              </span>
            </div>

            {/* Empty state */}
            {courses.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="w-8 h-8 text-[#7c3aed]" />
                </div>
                <p className="font-semibold text-gray-800 mb-1">No courses yet</p>
                <p className="text-sm text-gray-400 mb-6">Create your first course to get started</p>
                <Link
                  to="/teacher/create-course"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition text-sm shadow-md"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <>
                {/* ── Mobile cards ── */}
                <div className="md:hidden divide-y divide-gray-100">
                  {courses.map((course) => (
                    <div key={course._id} className="p-4 hover:bg-purple-50/30 transition">
                      <div className="flex gap-3 mb-3">
                        <img
                          src={course.courseThumbnail || 'https://via.placeholder.com/60'}
                          alt={course.courseTitle}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                            {course.courseTitle}
                          </h3>
                          <span className="text-xs bg-purple-100 text-[#7c3aed] px-2 py-0.5 rounded-full font-medium">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${course.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {course.totalEnrollments || 0} students
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            ₹{course.coursePrice}
                          </p>
                          <Link
                            to={`/teacher/course/${course._id}/lectures`}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
                          >
                            Lectures
                          </Link>
                          <Link
                            to={`/teacher/edit-course/${course._id}`}
                            className="text-xs font-semibold text-[#7c3aed] hover:text-[#a855f7] transition"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Desktop table ── */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-purple-50/30 transition-colors duration-150 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={course.courseThumbnail || 'https://via.placeholder.com/60'}
                                alt={course.courseTitle}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm group-hover:text-[#7c3aed] transition">
                                  {course.courseTitle}
                                </p>
                                <span className="text-xs bg-purple-100 text-[#7c3aed] px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                                  {course.category}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.isPublished
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                              }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {course.totalEnrollments || 0}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                              ₹{course.coursePrice}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <Link
                                to={`/teacher/course/${course._id}/lectures`}
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                              >
                                Lectures
                              </Link>
                              <Link
                                to={`/teacher/edit-course/${course._id}`}
                                className="text-sm font-semibold text-[#7c3aed] hover:text-[#a855f7] transition"
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;