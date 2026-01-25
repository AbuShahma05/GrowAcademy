import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API from '../../services/api';
import {
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  CheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const WatchCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState(null);
  const [autoMarking, setAutoMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (!currentLecture || !videoRef.current) return;

    const interval = setInterval(() => {
      const watchTime = videoRef.current.currentTime;
      if (watchTime > 0) {
        updateWatchTime(currentLecture._id, watchTime);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentLecture]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await API.get(`/course/${courseId}`);
      if (courseRes.data.success) {
        setCourse(courseRes.data.data);
      }

      const lecturesRes = await API.get(`/lecture/course/${courseId}`);
      if (lecturesRes.data.success) {
        const sortedLectures = lecturesRes.data.data.sort((a, b) => a.order - b.order);
        setLectures(sortedLectures);

        if (sortedLectures.length > 0 && !currentLecture) {
          setCurrentLecture(sortedLectures[0]);
        }
      }

      const progressRes = await API.get(`/progress/${user._id}/${courseId}`);
      if (progressRes.data.success) {
        const progressData = progressRes.data.data;
        setCourseProgress(progressData);

        const lectureProgress = {};
        progressData.lectureProgress.forEach(lp => {
          lectureProgress[lp.lectureId] = {
            viewed: lp.viewed,
            completed: lp.completed,
            watchTime: lp.watchTime
          };
        });
        setProgress(lectureProgress);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWatchTime = async (lectureId, watchTime) => {
    try {
      await API.put(`/progress/${courseId}/${user._id}/lecture/${lectureId}`, {
        viewed: true,
        watchTime: Math.floor(watchTime)
      });
    } catch (error) {
      console.error('Error updating watch time:', error);
    }
  };

  const handleVideoEnd = async () => {
    if (!currentLecture || autoMarking) return;

    setAutoMarking(true);
    await handleLectureComplete(currentLecture._id, true);
    setAutoMarking(false);

    const currentIndex = lectures.findIndex(l => l._id === currentLecture._id);
    if (currentIndex < lectures.length - 1) {
      setTimeout(() => {
        setCurrentLecture(lectures[currentIndex + 1]);
        setSidebarOpen(false); // Close sidebar on mobile after auto-next
      }, 2000);
    }
  };

  const handleLectureComplete = async (lectureId, isAutoComplete = false) => {
    try {
      await API.put(`/progress/${courseId}/${user._id}/lecture/${lectureId}`, {
        viewed: true,
        completed: true,
        watchTime: videoRef.current?.currentTime || 0
      });

      setProgress({
        ...progress,
        [lectureId]: {
          ...progress[lectureId],
          completed: true,
          viewed: true
        }
      });

      if (!isAutoComplete) {
        alert('✓ Lecture marked as complete!');
      }

      fetchCourseData();
    } catch (error) {
      console.error('Error marking lecture complete:', error);
    }
  };

  const selectLecture = async (lecture) => {
    setCurrentLecture(lecture);
    setSidebarOpen(false); // Close sidebar on mobile after selecting

    if (!progress[lecture._id]?.viewed) {
      try {
        await API.put(`/progress/${courseId}/${user._id}/lecture/${lecture._id}`, {
          viewed: true
        });

        setProgress({
          ...progress,
          [lecture._id]: {
            ...progress[lecture._id],
            viewed: true
          }
        });
      } catch (error) {
        console.error('Error marking as viewed:', error);
      }
    }
  };

  const getCompletionPercentage = () => {
    return courseProgress?.completionPercentage || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate('/student/my-courses')}
                className="flex items-center gap-2 text-white hover:text-blue-400 text-sm md:text-base"
              >
                <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="text-white flex items-center gap-2 md:gap-4">
              <span className="text-xs md:text-sm">
                {Object.values(progress).filter(p => p.completed).length} / {lectures.length}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 md:w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-sm md:text-base">{getCompletionPercentage()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-4 relative">
              {currentLecture?.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentLecture.videoUrl}
                    controls
                    className="w-full aspect-video"
                    onEnded={handleVideoEnd}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {progress[currentLecture._id]?.completed && (
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1 md:gap-2">
                      <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
                      Completed
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center p-4">
                    <LockClosedIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
                    <p className="text-sm md:text-base">No video available for this lecture</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Info */}
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 text-white">
              <h1 className="text-lg md:text-2xl font-bold mb-2">{currentLecture?.lectureTitle}</h1>
              <p className="text-sm md:text-base text-gray-400 mb-4">{course?.courseTitle}</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                {progress[currentLecture?._id]?.completed ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm md:text-base">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Completed ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleLectureComplete(currentLecture._id)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 md:px-6 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
                    Mark as Complete
                  </button>
                )}

                {progress[currentLecture?._id]?.viewed && !progress[currentLecture?._id]?.completed && (
                  <span className="text-yellow-400 text-xs md:text-sm">● In Progress</span>
                )}
              </div>
            </div>
          </div>

          {/* Lectures Sidebar - Desktop */}
          <div className="hidden lg:block bg-gray-800 rounded-lg p-4 md:p-6 max-h-[800px] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
              Course Content ({lectures.length})
            </h2>

            <div className="space-y-2">
              {lectures.map((lecture, index) => {
                const isCompleted = progress[lecture._id]?.completed;
                const isViewed = progress[lecture._id]?.viewed;
                const isCurrent = currentLecture?._id === lecture._id;

                return (
                  <button
                    key={lecture._id}
                    onClick={() => selectLecture(lecture)}
                    className={`w-full text-left p-3 md:p-4 rounded-lg transition ${isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-900 text-green-100'
                        : isViewed
                          ? 'bg-yellow-900 text-yellow-100'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-lg md:text-2xl font-bold opacity-50">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base truncate">{lecture.lectureTitle}</p>
                        <p className="text-xs md:text-sm opacity-75">{lecture.duration || 0} mins</p>
                      </div>
                      {isCompleted && (
                        <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
                      )}
                      {isViewed && !isCompleted && (
                        <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lectures Sidebar - Mobile (Overlay) */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSidebarOpen(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-800 p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-white">
                    Lectures ({lectures.length})
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white p-2"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-2">
                  {lectures.map((lecture, index) => {
                    const isCompleted = progress[lecture._id]?.completed;
                    const isViewed = progress[lecture._id]?.viewed;
                    const isCurrent = currentLecture?._id === lecture._id;

                    return (
                      <button
                        key={lecture._id}
                        onClick={() => selectLecture(lecture)}
                        className={`w-full text-left p-3 rounded-lg transition ${isCurrent
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                            ? 'bg-green-900 text-green-100'
                            : isViewed
                              ? 'bg-yellow-900 text-yellow-100'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold opacity-50">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{lecture.lectureTitle}</p>
                            <p className="text-xs opacity-75">{lecture.duration || 0} mins</p>
                          </div>
                          {isCompleted && (
                            <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;