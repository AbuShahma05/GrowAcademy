import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const ManageLectures = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const [formData, setFormData] = useState({
    lectureTitle: '',
    videoUrl: '',
    duration: 0,
    order: 1,
    isPreviewFree: false,
  });
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchCourseAndLectures();
  }, [courseId]);

  const fetchCourseAndLectures = async () => {
    try {
      const courseRes = await API.get(`/course/${courseId}`);
      if (courseRes.data.success) setCourse(courseRes.data.data);

      const lecturesRes = await API.get(`/lecture/course/${courseId}`);
      if (lecturesRes.data.success) setLectures(lecturesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      lectureTitle: '',
      videoUrl: '',
      duration: 0,
      order: lectures.length + 1,
      isPreviewFree: false,
    });
    setVideoFile(null);
    setEditingLecture(null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        alert('Video size should be less than 500MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing upload…');

    try {
      const lectureData = new FormData();
      lectureData.append('lectureTitle', formData.lectureTitle);
      lectureData.append('courseId', courseId);
      lectureData.append('duration', formData.duration);
      lectureData.append('order', formData.order);
      lectureData.append('isPreviewFree', formData.isPreviewFree);

      if (videoFile) {
        lectureData.append('video', videoFile);
      } else if (formData.videoUrl) {
        lectureData.append('videoUrl', formData.videoUrl);
      }

      const endpoint = editingLecture ? `/lecture/${editingLecture._id}` : '/lecture/create';
      const method = editingLecture ? 'put' : 'post';

      const response = await API.request({
        method,
        url: endpoint,
        data: lectureData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(pct);
          setUploadStatus(pct < 100 ? `Uploading video… ${pct}%` : 'Processing on server…');
        },
      });

      if (response.data.success) {
        setUploadStatus('✓ Upload complete!');
        alert(editingLecture ? 'Lecture updated successfully!' : 'Lecture created successfully!');
        setShowModal(false);
        resetForm();
        fetchCourseAndLectures();
      }
    } catch (error) {
      console.error('Error saving lecture:', error);
      setUploadStatus('✗ Upload failed!');
      alert(error.response?.data?.message || 'Failed to save lecture');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setFormData({
      lectureTitle: lecture.lectureTitle,
      videoUrl: lecture.videoUrl || '',
      duration: lecture.duration || 0,
      order: lecture.order,
      isPreviewFree: lecture.isPreviewFree || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    try {
      const { data } = await API.delete(`/lecture/${lectureId}`);
      if (data.success) {
        alert('Lecture deleted successfully!');
        fetchCourseAndLectures();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete lecture');
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm md:text-base transition';
  const labelCls = 'block font-semibold mb-2 text-sm text-gray-800';

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
        <p className="text-gray-500 text-sm">Loading lectures…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden text-black">
      <section className="relative py-10 md:py-16 mx-4 sm:mx-6 md:mx-10 lg:mx-16">
        <div className="container px-6 mx-auto md:px-12">

          {/* ── Header ── */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7c3aed] transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Dashboard
            </button>
            <span className="text-gray-300">·</span>
            <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase">
              Manage Lectures
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                Manage{' '}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Lectures
                </span>
              </h1>
              {course && (
                <p className="text-sm text-gray-500 mt-1 truncate max-w-md">{course.courseTitle}</p>
              )}
            </div>

            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md text-sm whitespace-nowrap flex-shrink-0"
            >
              <PlusIcon className="w-4 h-4" />
              Add Lecture
            </button>
          </div>

          {/* ── Lectures list ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 overflow-hidden">

            {/* Card header */}
            <div className="px-5 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">Content</p>
                <h2 className="text-lg md:text-xl font-bold text-black">Course Lectures</h2>
              </div>
              <span className="text-xs bg-purple-100 text-[#7c3aed] px-3 py-1 rounded-full font-semibold">
                {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
              </span>
            </div>

            {lectures.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon className="w-8 h-8 text-[#7c3aed]" />
                </div>
                <p className="font-semibold text-gray-800 mb-1">No lectures yet</p>
                <p className="text-sm text-gray-400 mb-6">Add your first lecture to get started</p>
                <button
                  onClick={() => { resetForm(); setShowModal(true); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition text-sm shadow-md"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Your First Lecture
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {[...lectures]
                  .sort((a, b) => a.order - b.order)
                  .map((lecture, index) => (
                    <div
                      key={lecture._id}
                      className="flex items-center justify-between gap-4 px-5 md:px-8 py-4 hover:bg-purple-50/30 transition-colors duration-150 group"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Index circle */}
                        <div className="w-9 h-9 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0 transition">
                          <span className="text-xs font-bold text-[#7c3aed]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-[#7c3aed] transition">
                            {lecture.lectureTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <ClockIcon className="w-3 h-3" />
                              {lecture.duration || 0} min
                            </span>
                            {lecture.isPreviewFree && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                Free Preview
                              </span>
                            )}
                            {lecture.videoUrl && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                ✓ Video
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(lecture)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#7c3aed] hover:bg-purple-100 transition"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lecture._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => { if (!uploading) { setShowModal(false); resetForm(); } }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-1">
                  {editingLecture ? 'Update' : 'New'}
                </p>
                <h2 className="text-lg font-bold text-black">
                  {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
                </h2>
              </div>
              <button
                onClick={() => { if (!uploading) { setShowModal(false); resetForm(); } }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-gray-500 hover:text-[#7c3aed] transition"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Lecture Title */}
              <div>
                <label className={labelCls}>Lecture Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.lectureTitle}
                  onChange={(e) => setFormData({ ...formData, lectureTitle: e.target.value })}
                  className={inputCls}
                  placeholder="e.g., Introduction to React Hooks"
                  required
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className={labelCls}>Video</label>
                {videoFile ? (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-emerald-700 truncate">✓ {videoFile.name}</p>
                      <p className="text-xs text-emerald-500 mt-0.5">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="ml-3 text-xs font-semibold text-red-500 hover:text-red-700 flex-shrink-0 transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : formData.videoUrl ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50">
                    <span className="text-sm font-semibold text-blue-700">✓ Video already uploaded</span>
                  </div>
                ) : (
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#7c3aed] rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-2 transition">
                      <CloudArrowUpIcon className="w-6 h-6 text-[#7c3aed]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Click to upload video</p>
                    <p className="text-xs text-gray-400">MP4, MOV, AVI — max 500MB</p>
                    <span className="mt-3 inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                      id="video-upload"
                    />
                  </label>
                )}
              </div>

              {/* Upload progress */}
              {uploading && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#7c3aed] flex-1 mr-2 truncate">
                      {uploadStatus}
                    </span>
                    <span className="text-xs font-bold text-[#7c3aed] flex-shrink-0">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${uploadProgress}%`,
                        background: 'linear-gradient(to right, #7c3aed, #a855f7)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Duration & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className={inputCls}
                    min="0"
                  />
                </div>
                <div>
                  <label className={labelCls}>Order <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className={inputCls}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Free Preview toggle */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPreviewFree: !formData.isPreviewFree })}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.isPreviewFree
                    ? 'border-[#7c3aed] bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-left">
                  <p className={`text-sm font-semibold ${formData.isPreviewFree ? 'text-[#7c3aed]' : 'text-gray-700'}`}>
                    Free Preview
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Anyone can watch this lecture for free</p>
                </div>
                <div className={`w-10 h-6 rounded-full transition-all duration-300 flex-shrink-0 relative ${
                  formData.isPreviewFree ? 'bg-[#7c3aed]' : 'bg-gray-200'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                    formData.isPreviewFree ? 'left-5' : 'left-1'
                  }`} />
                </div>
              </button>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60 text-sm"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {uploadProgress}% Uploading…
                    </span>
                  ) : editingLecture ? 'Update Lecture' : 'Add Lecture'}
                </button>
                <button
                  type="button"
                  onClick={() => { if (!uploading) { setShowModal(false); resetForm(); } }}
                  disabled={uploading}
                  className="px-5 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-purple-300 hover:text-[#7c3aed] transition-all duration-200 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLectures;