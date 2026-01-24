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
      icon: <BookOpenIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Enrolled Courses",
      value: stats.enrolledCourses,
      color: "bg-blue-500"
    },
    {
      icon: <ChartBarIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "In Progress",
      value: stats.inProgressCourses,
      color: "bg-yellow-500"
    },
    {
      icon: <AcademicCapIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Completed",
      value: stats.completedCourses,
      color: "bg-green-500"
    },
    {
      icon: <ClockIcon className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Learning Time",
      value: `${Math.floor(stats.totalLearningTime / 60)}h`,
      color: "bg-purple-500"
    }
  ];

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
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-sm md:text-base text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className={`${stat.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4`}>
                {stat.icon}
              </div>
              <h3 className="text-gray-600 text-xs md:text-sm mb-1">{stat.title}</h3>
              <p className="text-xl md:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Continue Learning</h2>
            <Link
              to="/student/my-courses"
              className="text-sm md:text-base text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {recentCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-600 mb-4">No courses enrolled yet</p>
              <Link
                to="/courses"
                className="inline-block bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {recentCourses.map((course) => {
                const studentProgress = course.userProgress || 0;

                return (
                  <Link
                    key={course._id}
                    to={`/student/watch/${course._id}`}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={course.courseThumbnail || 'https://via.placeholder.com/400x200'}
                      alt={course.courseTitle}
                      className="w-full h-32 md:h-40 object-cover"
                    />
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1 text-sm md:text-base">
                        {course.courseTitle}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-3">
                        {course.creator?.username}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">{studentProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${studentProgress}%` }}
                          ></div>
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
  );
};

export default StudentDashboard;