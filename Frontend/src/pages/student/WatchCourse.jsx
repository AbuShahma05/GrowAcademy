import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import API from "../../services/api";
import {
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  CheckIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (!currentLecture || !videoRef.current) return;
    const interval = setInterval(() => {
      const watchTime = videoRef.current.currentTime;
      if (watchTime > 0) updateWatchTime(currentLecture._id, watchTime);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentLecture]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await API.get(`/course/${courseId}`);
      if (courseRes.data.success) setCourse(courseRes.data.data);

      const lecturesRes = await API.get(`/lecture/course/${courseId}`);
      if (lecturesRes.data.success) {
        const sorted = lecturesRes.data.data.sort((a, b) => a.order - b.order);
        setLectures(sorted);
        if (sorted.length > 0 && !currentLecture) setCurrentLecture(sorted[0]);
      }

      const progressRes = await API.get(`/progress/${user._id}/${courseId}`);
      if (progressRes.data.success) {
        const progressData = progressRes.data.data;
        setCourseProgress(progressData);
        const lp = {};
        progressData.lectureProgress.forEach((l) => {
          lp[l.lectureId] = {
            viewed: l.viewed,
            completed: l.completed,
            watchTime: l.watchTime,
          };
        });
        setProgress(lp);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateWatchTime = async (lectureId, watchTime) => {
    try {
      await API.put(`/progress/${courseId}/${user._id}/lecture/${lectureId}`, {
        viewed: true,
        watchTime: Math.floor(watchTime),
      });
    } catch (error) {
      console.error("Error updating watch time:", error);
    }
  };

  const handleVideoEnd = async () => {
    if (!currentLecture || autoMarking) return;
    setAutoMarking(true);
    await handleLectureComplete(currentLecture._id, true);
    setAutoMarking(false);
    const currentIndex = lectures.findIndex(
      (l) => l._id === currentLecture._id,
    );
    if (currentIndex < lectures.length - 1) {
      setTimeout(() => {
        setCurrentLecture(lectures[currentIndex + 1]);
        setSidebarOpen(false);
      }, 2000);
    }
  };

  const handleLectureComplete = async (lectureId, isAutoComplete = false) => {
    try {
      await API.put(`/progress/${courseId}/${user._id}/lecture/${lectureId}`, {
        viewed: true,
        completed: true,
        watchTime: videoRef.current?.currentTime || 0,
      });
      setProgress((prev) => ({
        ...prev,
        [lectureId]: { ...prev[lectureId], completed: true, viewed: true },
      }));
      if (!isAutoComplete) alert("✓ Lecture marked as complete!");
      fetchCourseData();
    } catch (error) {
      console.error("Error marking lecture complete:", error);
    }
  };

  const selectLecture = async (lecture) => {
    setCurrentLecture(lecture);
    setSidebarOpen(false);
    if (!progress[lecture._id]?.viewed) {
      try {
        await API.put(
          `/progress/${courseId}/${user._id}/lecture/${lecture._id}`,
          { viewed: true },
        );
        setProgress((prev) => ({
          ...prev,
          [lecture._id]: { ...prev[lecture._id], viewed: true },
        }));
      } catch (error) {
        console.error("Error marking as viewed:", error);
      }
    }
  };

  const completionPct = courseProgress?.completionPercentage || 0;
  const completedCount = Object.values(progress).filter(
    (p) => p.completed,
  ).length;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
        <p className="text-gray-500 text-sm">Loading course…</p>
      </div>
    );
  }

  /* ── Lecture row (reused in desktop + mobile sidebar) ── */
  const LectureItem = ({ lecture, index }) => {
    const isCompleted = progress[lecture._id]?.completed;
    const isViewed = progress[lecture._id]?.viewed && !isCompleted;
    const isCurrent = currentLecture?._id === lecture._id;

    return (
      <button
        key={lecture._id}
        onClick={() => selectLecture(lecture)}
        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${isCurrent
          ? "border-[#7c3aed] bg-purple-50"
          : isCompleted
            ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
            : isViewed
              ? "border-amber-200 bg-amber-50 hover:border-amber-400"
              : "border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/40"
          }`}
      >
        <div className="flex items-center gap-3">
          {/* Index / status icon */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition ${isCurrent
              ? "bg-[#7c3aed] text-white"
              : isCompleted
                ? "bg-emerald-500 text-white"
                : isViewed
                  ? "bg-amber-400 text-white"
                  : "bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-[#7c3aed]"
              }`}
          >
            {isCompleted ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              String(index + 1).padStart(2, "0")
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-sm truncate ${isCurrent
                ? "text-[#7c3aed]"
                : isCompleted
                  ? "text-emerald-800"
                  : isViewed
                    ? "text-amber-800"
                    : "text-gray-800"
                }`}
            >
              {lecture.lectureTitle}
            </p>
            <p
              className={`text-xs flex items-center gap-1 mt-0.5 ${isCurrent ? "text-purple-400" : "text-gray-500"
                }`}
            >
              <ClockIcon className="w-3 h-3" />
              {lecture.duration || 0} min
            </p>
          </div>

          {isViewed && (
            <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ─── HEADER ─── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16">
          <div className="container px-6 mx-auto md:px-12 py-3 flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/student/my-courses")}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-[#7c3aed] transition"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">My Courses</span>
              </button>

              <span className="text-gray-300 hidden sm:inline">·</span>

              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase hidden sm:block">
                Now Playing
              </p>

              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7c3aed] transition ml-1"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
                <span>Lectures</span>
              </button>
            </div>

            {/* Right — progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-black hidden sm:block">
                {completedCount}/{lectures.length} completed
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 md:w-36 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${completionPct}%`,
                      background: "linear-gradient(to right, #7c3aed, #a855f7)",
                    }}
                  />
                </div>
                <span className="text-xs font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  {completionPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <section className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 py-6 md:py-10">
        <div className="container px-6 mx-auto md:px-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Video + Info ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Video player */}
              <div className="rounded-2xl overflow-hidden border border-gray-500 shadow-md bg-black relative">
                {currentLecture?.videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={currentLecture.videoUrl}
                      controls
                      className="w-full aspect-video"
                      onEnded={handleVideoEnd}
                    />
                    {progress[currentLecture._id]?.completed && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow">
                        <CheckIcon className="w-3.5 h-3.5" />
                        Completed
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-100 text-gray-400">
                    <div className="text-center p-6">
                      <LockClosedIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">
                        No video available for this lecture
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lecture info card */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-500 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">
                {/* Eyebrow */}
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-2">
                  {course?.courseTitle}
                </p>

                <h1 className="text-lg md:text-2xl font-bold text-black mb-4">
                  {currentLecture?.lectureTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  {progress[currentLecture?._id]?.completed ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                      <CheckCircleIcon className="w-4 h-4" />
                      Lecture Completed
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLectureComplete(currentLecture._id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md text-sm"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Mark as Complete
                    </button>
                  )}

                  {progress[currentLecture?._id]?.viewed &&
                    !progress[currentLecture?._id]?.completed && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        In Progress
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* ── Desktop Sidebar ── */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-500 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">
                    Course Content
                  </p>
                  <p className="text-sm text-gray-500">
                    {lectures.length} lectures · {completedCount} done
                  </p>
                </div>
                <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                  {lectures.map((lecture, index) => (
                    <LectureItem
                      key={lecture._id}
                      lecture={lecture}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[88vw] bg-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase">
                  Course Content
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {lectures.length} lectures · {completedCount} done
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-gray-500 hover:text-[#7c3aed] transition"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar inside drawer */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${completionPct}%`,
                    background: "linear-gradient(to right, #7c3aed, #a855f7)",
                  }}
                />
              </div>
              <span className="text-xs font-bold text-[#7c3aed]">
                {completionPct}%
              </span>
            </div>

            {/* Lecture list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lectures.map((lecture, index) => (
                <LectureItem
                  key={lecture._id}
                  lecture={lecture}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchCourse;
