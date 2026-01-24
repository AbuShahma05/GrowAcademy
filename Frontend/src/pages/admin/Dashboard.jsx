import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
    UserGroupIcon,
    BookOpenIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalRevenue: 0,
        totalPurchases: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch users
            const usersRes = await API.get('/user/admin/users', {
                params: { page: 1, limit: 5 }
            });

            // Fetch courses
            const coursesRes = await API.get('/course', {
                params: { page: 1, limit: 5 }
            });

            // Fetch purchase stats
            const purchaseRes = await API.get('/purchase/admin/stats');

            if (usersRes.data.success) {
                const users = usersRes.data.users;
                setRecentUsers(users);

                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.data.pagination.total,
                    totalStudents: users.filter(u => u.role === 'Student').length,
                    totalTeachers: users.filter(u => u.role === 'Teacher').length
                }));
            }

            if (coursesRes.data.success) {
                const courses = coursesRes.data.data;
                setRecentCourses(courses);

                setStats(prev => ({
                    ...prev,
                    totalCourses: coursesRes.data.pagination.totalCourses,
                    publishedCourses: courses.filter(c => c.isPublished).length
                }));
            }

            if (purchaseRes.data.success) {
                setStats(prev => ({
                    ...prev,
                    totalRevenue: purchaseRes.data.data.totalRevenue,
                    totalPurchases: purchaseRes.data.data.totalPurchases
                }));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId) => {
        try {
            const { data } = await API.patch(`/user/admin/user/${userId}/toggle-status`);
            if (data.success) {
                alert('User status updated successfully');
                fetchDashboardData();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const statCards = [
        {
            icon: <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
            title: "Total Users",
            value: stats.totalUsers,
            color: "bg-blue-500",
            subtext: `${stats.totalStudents} Students, ${stats.totalTeachers} Teachers`
        },
        {
            icon: <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
            title: "Total Courses",
            value: stats.totalCourses,
            color: "bg-green-500",
            subtext: `${stats.publishedCourses} Published`
        },
        {
            icon: <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
            title: "Total Purchases",
            value: stats.totalPurchases,
            color: "bg-purple-500"
        },
        {
            icon: <CurrencyDollarIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
            title: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            color: "bg-yellow-500"
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
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage users, courses, and platform operations</p>
                </div>

                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-gray-600 text-xs sm:text-sm mb-1">{stat.title}</h3>
                            <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                            {stat.subtext && (
                                <p className="text-xs sm:text-sm text-gray-500">{stat.subtext}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Recent Users - Responsive Table */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold">Recent Users</h2>
                            <Link to="/admin/users" className="text-sm sm:text-base text-blue-600 hover:underline">
                                View All
                            </Link>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block sm:hidden space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user._id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{user.username}</p>
                                            <p className="text-xs text-gray-500 break-all">{user.email}</p>
                                        </div>
                                        {user.isActive ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                                        ) : (
                                            <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                                                user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <button
                                            onClick={() => handleToggleUserStatus(user._id)}
                                            className="text-blue-600 hover:underline text-xs font-medium"
                                        >
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-3 md:px-4 py-4">
                                                <div>
                                                    <p className="font-semibold text-sm">{user.username}</p>
                                                    <p className="text-xs text-gray-500 break-all">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                                                        user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-4 py-4">
                                                {user.isActive ? (
                                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircleIcon className="w-5 h-5 text-red-500" />
                                                )}
                                            </td>
                                            <td className="px-3 md:px-4 py-4">
                                                <button
                                                    onClick={() => handleToggleUserStatus(user._id)}
                                                    className="text-blue-600 hover:underline text-xs sm:text-sm"
                                                >
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Courses - Responsive */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold">Recent Courses</h2>
                            <Link to="/admin/courses" className="text-sm sm:text-base text-blue-600 hover:underline">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {recentCourses.map((course) => (
                                <div key={course._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded hover:bg-gray-50">
                                    <img
                                        src={course.courseThumbnail || 'https://via.placeholder.com/80'}
                                        alt={course.courseTitle}
                                        className="w-full sm:w-16 md:w-20 h-40 sm:h-16 md:h-20 rounded object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 w-full sm:w-auto">
                                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{course.courseTitle}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">By {course.creator?.username}</p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${course.isPublished
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-500">
                                                {course.totalEnrollments || 0} students
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-auto text-left sm:text-right">
                                        <p className="font-bold text-base sm:text-lg text-blue-600">₹{course.coursePrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;