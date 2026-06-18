import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import {
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await API.get(`/course/${id}`);
      if (data.success) {
        setCourse(data.data);

        if (user) {
          const enrolled = data.data.enrolledStudents?.some(
            (student) => student.studentId === user._id
          );
          setIsEnrolled(enrolled);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);

      const { data } = await API.post(`/course/${id}/enroll`);

      if (data.success) {
        try {
          await API.post('/progress/create', {
            userId: user._id,
            courseId: id
          });
        } catch (progressError) {
          console.log('Progress init error:', progressError);
        }

        setIsEnrolled(true);
        alert('Successfully enrolled in course!');

        setTimeout(() => {
          navigate(`/student/watch/${id}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - Mobile */}
      <div className="md:hidden bg-white border-b px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-900 text-white py-8 md:py-16">
        <div className="container mx-auto px-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Side - Course Info */}
            <div>
              {/* Back Button - Desktop */}
              <button
                onClick={() => navigate(-1)}
                className="hidden md:flex items-center gap-2 text-white/80 hover:text-white mb-4"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Courses
              </button>

              <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
                <span className="bg-black text-white px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
                  {course.category}
                </span>
                <span className="bg-black bg-opacity-20 px-3 py-1 rounded-lg text-xs md:text-sm">
                  {course.courseLevel}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                {course.courseTitle}
              </h1>
              <p className="text-base md:text-xl mb-4 md:mb-6">{course.subTitle}</p>

              <div className="flex items-center gap-4 md:gap-6 md:mb-6 flex-wrap text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{course.averageRating.toFixed(1)} ({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{course.totalEnrollments} students</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={course.creator?.photoUrl || 'https://via.placeholder.com/50'}
                  alt={course.creator?.username}
                  className="w-5 h-5 md:w-12 md:h-12 rounded-full"
                />
                <div>
                  <p className="text-xs md:text-sm">Created by</p>
                  <p className="font-semibold text-sm md:text-base">{course.creator?.username}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Course Card (Hidden on mobile in hero) */}
            <div className="hidden md:block bg-white rounded-lg p-6 text-gray-900 shadow-xl">
              <img
                src={course.courseThumbnail || 'https://via.placeholder.com/400x300'}
                alt={course.courseTitle}
                className="w-full rounded-lg mb-4"
              />

              <div className="flex items-center justify-between mb-4">
                <div>
                  {course.originalPrice && (
                    <p className="text-gray-400 line-through text-sm md:text-base">₹{course.originalPrice}</p>
                  )}
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">₹{course.coursePrice}</p>
                </div>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/student/watch/${id}`)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Go to Course
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span>{course.totalDuration} minutes total</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PlayIcon className="w-5 h-5 text-blue-600" />
                  <span>{course.totalLectures} lectures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Purchase Card - Mobile Only */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            {course.originalPrice && (
              <p className="text-gray-400 line-through text-xs">₹{course.originalPrice}</p>
            )}
            <p className="text-xl font-bold text-blue-600">₹{course.coursePrice}</p>
          </div>
          {isEnrolled ? (
            <button
              onClick={() => navigate(`/student/watch/${id}`)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Go to Course
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {enrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6 md:space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">About this course</h2>
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-line">{course.description}</p>
            </div>

            {/* Lectures */}
            {course.lectures && course.lectures.length > 0 && (
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Course Content</h2>
                <div className="space-y-2">
                  {course.lectures.map((lecture, index) => (
                    <div
                      key={lecture._id}
                      className="flex items-center justify-between p-3 md:p-4 border rounded hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <span className="text-gray-500 text-sm md:text-base">{index + 1}.</span>
                        <PlayIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm md:text-base truncate">{lecture.title}</span>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0 ml-2">
                        {lecture.duration} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden md:block space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-4">
              <h3 className="font-bold mb-4">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Lifetime access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Certificate of completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Access on mobile and desktop</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
        {isEnrolled ? (
          <button
            onClick={() => navigate(`/student/watch/${id}`)}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Go to Course
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {enrolling ? 'Enrolling...' : `Enroll Now - ₹${course.coursePrice}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;