import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Profile from './pages/Profile.jsx';
import About from './pages/About';
import Contact from './pages/Contact';

// Import pages (create these next)
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import CourseCatalog from './pages/courses/CourseCatalog';
import CourseDetail from './pages/courses/CourseDetail';
import MyCourses from './pages/student/MyCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import ManageLectures from './pages/teacher/ManageLectures.jsx';
import WatchCourse from './pages/student/WatchCourse.jsx';
import NotFound from './pages/NotFound';
import EditCourse from './pages/teacher/EditCourse.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/courses" element={<CourseCatalog />} />
      <Route path="/course/:id" element={<CourseDetail />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-courses"
        element={
          <ProtectedRoute allowedRoles={['Student']}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/create-course"
        element={
          <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Course Edit */}
      <Route
        path="/teacher/edit-course/:id"
        element={
          <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['Student', 'Teacher', 'Admin']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/course/:courseId/lectures"
        element={
          <ProtectedRoute allowedRoles={['Teacher', 'Admin']}>
            <ManageLectures />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/watch/:courseId"
        element={
          <ProtectedRoute allowedRoles={['Student']}>
            <WatchCourse />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;