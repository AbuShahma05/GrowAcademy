import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
    UserGroupIcon,
    BookOpenIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalRevenue: 0,
        totalPurchases: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const usersRes = await API.get('/user/admin/users', { params: { page: 1, limit: 5 } });
            const coursesRes = await API.get('/course', { params: { page: 1, limit: 5 } });
            const purchaseRes = await API.get('/purchase/admin/stats');

            if (usersRes.data.success) {
                const users = usersRes.data.users;
                setRecentUsers(users);
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.data.pagination.total,
                    totalStudents: users.filter(u => u.role === 'Student').length,
                    totalTeachers: users.filter(u => u.role === 'Teacher').length,
                }));
            }

            if (coursesRes.data.success) {
                const courses = coursesRes.data.data;
                setRecentCourses(courses);
                setStats(prev => ({
                    ...prev,
                    totalCourses: coursesRes.data.pagination.totalCourses,
                    publishedCourses: courses.filter(c => c.isPublished).length,
                }));
            }

            if (purchaseRes.data.success) {
                setStats(prev => ({
                    ...prev,
                    totalRevenue: purchaseRes.data.data.totalRevenue,
                    totalPurchases: purchaseRes.data.data.totalPurchases,
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

    const rolePill = (role) => {
        if (role === 'Admin') return 'bg-red-100 text-red-700';
        if (role === 'Teacher') return 'bg-blue-100 text-blue-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    const statCards = [
        {
            Icon: UserGroupIcon,
            title: 'Total Users',
            value: stats.totalUsers,
            bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
            subtext: `${stats.totalStudents} Students · ${stats.totalTeachers} Teachers`,
        },
        {
            Icon: BookOpenIcon,
            title: 'Total Courses',
            value: stats.totalCourses,
            bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
            subtext: `${stats.publishedCourses} Published`,
        },
        {
            Icon: ChartBarIcon,
            title: 'Total Purchases',
            value: stats.totalPurchases,
            bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-[#7c3aed]',
        },
        {
            Icon: CurrencyDollarIcon,
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
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

                    {/* ── Header ── */}
                    <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                        Admin
                    </p>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-black">
                        Platform{' '}
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mb-8 md:mb-10">
                        Manage users, courses, and platform operations.
                    </p>

                    {/* ── Stat cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                        {statCards.map(({ Icon, title, value, bg, iconBg, iconColor, subtext }) => (
                            <div
                                key={title}
                                className={`${bg} rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center`}
                            >
                                <div className={`${iconBg} w-11 h-11 rounded-full flex items-center justify-center mb-3`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
                                <p className="text-xl md:text-3xl font-bold text-gray-900 truncate w-full text-center">{value}</p>
                                {subtext && (
                                    <p className="text-xs text-gray-400 mt-1">{subtext}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Two column grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* ── Recent Users ── */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 overflow-hidden">
                            <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">Users</p>
                                    <h2 className="text-lg font-bold text-black">Recent Users</h2>
                                </div>
                                <Link
                                    to="/admin/users"
                                    className="text-xs font-semibold text-[#7c3aed] hover:text-[#a855f7] transition"
                                >
                                    View All →
                                </Link>
                            </div>

                            {/* Mobile cards */}
                            <div className="sm:hidden divide-y divide-gray-100">
                                {recentUsers.map((user) => (
                                    <div key={user._id} className="p-4 hover:bg-purple-50/30 transition">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-sm text-gray-900 truncate">{user.username}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            {user.isActive
                                                ? <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2" />
                                                : <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />
                                            }
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rolePill(user.role)}`}>
                                                {user.role}
                                            </span>
                                            <button
                                                onClick={() => handleToggleUserStatus(user._id)}
                                                className={`text-xs font-semibold transition ${user.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-purple-50/30 transition-colors duration-150 group">
                                                <td className="px-5 py-3.5">
                                                    <p className="font-semibold text-sm text-gray-900 group-hover:text-[#7c3aed] transition truncate max-w-[140px]">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{user.email}</p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rolePill(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {user.isActive
                                                        ? <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                                        : <XCircleIcon className="w-5 h-5 text-red-400" />
                                                    }
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => handleToggleUserStatus(user._id)}
                                                        className={`text-xs font-semibold transition ${user.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
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

                        {/* ── Recent Courses ── */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 overflow-hidden">
                            <div className="px-5 md:px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">Courses</p>
                                    <h2 className="text-lg font-bold text-black">Recent Courses</h2>
                                </div>
                                <Link
                                    to="/admin/courses"
                                    className="text-xs font-semibold text-[#7c3aed] hover:text-[#a855f7] transition"
                                >
                                    View All →
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentCourses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="flex items-center gap-4 px-5 md:px-6 py-4 hover:bg-purple-50/30 transition-colors duration-150 group"
                                    >
                                        <img
                                            src={course.courseThumbnail || 'https://via.placeholder.com/80'}
                                            alt={course.courseTitle}
                                            className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-[#7c3aed] transition">
                                                {course.courseTitle}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">By {course.creator?.username}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {course.totalEnrollments || 0} students
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent flex-shrink-0">
                                            ₹{course.coursePrice}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;