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
  ArrowLeftIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showAllLectures, setShowAllLectures] = useState(false);

  const LECTURE_PREVIEW_COUNT = 5;

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
          await API.post('/progress/create', { userId: user._id, courseId: id });
        } catch (progressError) {
          console.log('Progress init error:', progressError);
        }
        setIsEnrolled(true);
        alert('Successfully enrolled in course!');
        setTimeout(() => navigate(`/student/watch/${id}`), 1000);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const visibleLectures = showAllLectures
    ? course?.lectures
    : course?.lectures?.slice(0, LECTURE_PREVIEW_COUNT);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
        <p className="text-gray-500 text-sm">Loading course details…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-md px-12">
          <p className="text-xl text-gray-500">Course not found</p>
          <p className="text-sm text-gray-400 mt-2">This course may have been removed or does not exist.</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const EnrollButton = ({ fullWidth = false, showPrice = false }) => (
    isEnrolled ? (
      <button
        onClick={() => navigate(`/student/watch/${id}`)}
        className={`${fullWidth ? 'w-full' : ''} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md`}
      >
        Go to Course →
      </button>
    ) : (
      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className={`${fullWidth ? 'w-full' : ''} bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60`}
      >
        {enrolling ? 'Enrolling…' : showPrice ? `Enroll Now — ₹${course.coursePrice}` : 'Enroll Now'}
      </button>
    )
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative py-10 md:py-16 overflow-hidden mx-4 sm:mx-6 md:mx-10 lg:mx-16">
        <div className="relative z-10 container px-6 mx-auto md:px-12">

          {/* Back + Eyebrow */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7c3aed] transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
            <span className="text-gray-300">·</span>
            <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase">
              Course Detail
            </p>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-black leading-tight">
            {course.courseTitle.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              {course.courseTitle.split(' ').slice(-2).join(' ')}
            </span>
          </h1>

          {/* Subtitle */}
          {course.subTitle && (
            <p className="text-gray-500 text-sm md:text-base mb-5 max-w-2xl">{course.subTitle}</p>
          )}

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs bg-purple-100 text-[#7c3aed] px-3 py-1 rounded-full font-semibold">
              {course.category}
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
              {course.courseLevel}
            </span>
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium">
              <StarIcon className="w-3.5 h-3.5" />
              {course.averageRating.toFixed(1)} ({course.totalRatings} ratings)
            </span>
            <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              <UserGroupIcon className="w-3.5 h-3.5" />
              {course.totalEnrollments} students
            </span>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left / Main ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Thumbnail – mobile only */}
              <div className="lg:hidden rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                <img
                  src={course.courseThumbnail || 'https://via.placeholder.com/800x400'}
                  alt={course.courseTitle}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Instructor */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">Instructor</p>
                <div className="flex items-center gap-4">
                  <img
                    src={course.creator?.photoUrl || 'https://via.placeholder.com/80'}
                    alt={course.creator?.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-100"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-base">{course.creator?.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Course Creator</p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">About this course</p>
                <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Content */}
              {course.lectures && course.lectures.length > 0 && (
                <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase">Course Content</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <PlayIcon className="w-3.5 h-3.5" />
                        {course.lectures.length} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {course.totalDuration} min total
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {visibleLectures.map((lecture, index) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xs font-bold text-gray-300 w-5 text-right flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0 transition">
                            <PlayIcon className="w-3.5 h-3.5 text-[#7c3aed]" />
                          </div>
                          <span className="text-sm text-gray-800 truncate">{lecture.title}</span>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                          {lecture.duration} min
                        </span>
                      </div>
                    ))}
                  </div>

                  {course.lectures.length > LECTURE_PREVIEW_COUNT && (
                    <button
                      onClick={() => setShowAllLectures(!showAllLectures)}
                      className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#7c3aed] hover:text-[#a855f7] transition py-2 rounded-xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/50"
                    >
                      {showAllLectures ? (
                        <><ChevronUpIcon className="w-4 h-4" /> Show less</>
                      ) : (
                        <><ChevronDownIcon className="w-4 h-4" /> Show {course.lectures.length - LECTURE_PREVIEW_COUNT} more lectures</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Mobile Enroll CTA */}
              <div className="lg:hidden">
                <EnrollButton fullWidth showPrice />
              </div>
            </div>

            {/* ── Right / Sidebar ── */}
            <div className="hidden lg:block space-y-5">

              {/* Sticky card */}
              <div className="sticky top-6 space-y-5">

                {/* Thumbnail */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                  <img
                    src={course.courseThumbnail || 'https://via.placeholder.com/600x340'}
                    alt={course.courseTitle}
                    className="w-full h-72 object-cover"
                  />
                </div>

                {/* Pricing + Enroll */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                  <div className="mb-4">
                    {course.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">₹{course.originalPrice}</p>
                    )}
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                      ₹{course.coursePrice}
                    </p>
                    {course.originalPrice && (
                      <span className="inline-block mt-1 text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                        {Math.round((1 - course.coursePrice / course.originalPrice) * 100)}% off
                      </span>
                    )}
                  </div>

                  <EnrollButton fullWidth />

                  <p className="text-center text-xs text-gray-400 mt-3">30-day money-back guarantee</p>
                </div>

                {/* Course includes */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                  <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">This course includes</p>
                  <ul className="space-y-3">
                    {[
                      { Icon: ClockIcon, text: `${course.totalDuration} minutes of content` },
                      { Icon: PlayIcon, text: `${course.totalLectures} on-demand lectures` },
                      { Icon: DevicePhoneMobileIcon, text: 'Access on mobile & desktop' },
                      { Icon: AcademicCapIcon, text: 'Lifetime access' },
                      { Icon: TrophyIcon, text: 'Certificate of completion' },
                    ].map(({ Icon, text }) => (
                      <li key={text} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#7c3aed]" />
                        </div>
                        <span className="text-sm text-gray-700">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── MOBILE STICKY BOTTOM CTA ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 shadow-xl p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            {course.originalPrice && (
              <p className="text-xs text-gray-400 line-through">₹{course.originalPrice}</p>
            )}
            <p className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              ₹{course.coursePrice}
            </p>
          </div>
          <div className="flex-1">
            <EnrollButton fullWidth showPrice={!isEnrolled} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CourseDetail;