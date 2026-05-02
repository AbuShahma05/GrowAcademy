import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import {
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { user: _user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
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
          totalRevenue: teacherCourses.reduce((acc, c) => acc + ((c.coursePrice || 0) * (c.totalEnrollments || 0)), 0)
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
      icon: <BookOpenIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Total Courses",
      value: stats.totalCourses,
      color: "bg-blue-500"
    },
    {
      icon: <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Published",
      value: stats.publishedCourses,
      color: "bg-green-500"
    },
    {
      icon: <UserGroupIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Total Students",
      value: stats.totalStudents,
      color: "bg-purple-500"
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      color: "bg-yellow-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb7241]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 py-4 md:py-8">
      <div className="container mx-auto px-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8 px-2">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-2 ">Instructor Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 ">Manage your courses and track performance</p>
          </div>
          <Link
            to="/teacher/create-course"
            className="w-full md:w-auto flex items-center justify-center bg-black text-white px-8 md:px-6 py-3 rounded-xl hover:bg-[#fb7241] transition text-sm md:text-base"
          >
            <PlusIcon className="w-5 h-5 rounded-xl" />
            Create New Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 mb-8 md:mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
              <div className={`${stat.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4 mx-auto`}>
                {stat.icon}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm">{stat.title}</h3>
              <p className="text-lg md:text-3xl font-bold truncate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Your Courses</h2>

          {courses.length === 0 ? (
            <div className="text-center py-12 ">
              <BookOpenIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto " />
              <p className="text-sm md:text-base text-gray-600 mb-8">You haven't created any courses yet</p>
              <Link
                to="/teacher/create-course"
                className="inline-block bg-black text-white px-4 md:px-6 py-2 rounded-xl hover:bg-[#fb7241] transition text-sm md:text-base"
              >
                Create Your First Course
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="border rounded-lg p-4">
                    <div className="flex gap-3 mb-3">
                      <img
                        src={course.courseThumbnail || 'https://via.placeholder.com/60'}
                        alt={course.courseTitle}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {course.courseTitle}
                        </h3>
                        <p className="text-xs text-gray-600">{course.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${course.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <div className="text-xs text-gray-600">
                        {course.totalEnrollments || 0} students
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-600">
                        ₹{course.coursePrice}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/teacher/course/${course._id}/lectures`}
                          className="text-xs text-green-600 hover:underline"
                        >
                          Lectures
                        </Link>
                        <Link
                          to={`/teacher/edit-course/${course._id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.courseThumbnail || 'https://via.placeholder.com/60'}
                              alt={course.courseTitle}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold">{course.courseTitle}</p>
                              <p className="text-sm text-gray-500">{course.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{course.totalEnrollments || 0}</td>
                        <td className="px-6 py-4">₹{course.coursePrice}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <Link
                              to={`/teacher/course/${course._id}/lectures`}
                              className="text-green-600 hover:underline"
                            >
                              Lectures
                            </Link>
                            <Link
                              to={`/teacher/edit-course/${course._id}`}
                              className="text-blue-600 hover:underline"
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
    </div>
  );
};

export default TeacherDashboard;