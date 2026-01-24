import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import axios from 'axios';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
  XMarkIcon
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
    isPreviewFree: false
  });
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchCourseAndLectures();
  }, [courseId]);

  const fetchCourseAndLectures = async () => {
    try {
      const courseRes = await API.get(`/course/${courseId}`);
      if (courseRes.data.success) {
        setCourse(courseRes.data.data);
      }

      const lecturesRes = await API.get(`/lecture/course/${courseId}`);
      if (lecturesRes.data.success) {
        setLectures(lecturesRes.data.data);
      }
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
      isPreviewFree: false
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
    setUploadStatus('Preparing upload...');

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

      const token = localStorage.getItem('token');
      const endpoint = editingLecture
        ? `/lecture/${editingLecture._id}`
        : '/lecture/create';
      const method = editingLecture ? 'put' : 'post';

      const response = await axios({
        method: method,
        url: `http://localhost:5000/api/v1${endpoint}`,
        data: lectureData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);

          if (percentCompleted < 100) {
            setUploadStatus(`Uploading video... ${percentCompleted}%`);
          } else {
            setUploadStatus('Processing video on server...');
          }
        }
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
      isPreviewFree: lecture.isPreviewFree || false
    });
    setShowModal(true);
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) {
      return;
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-6xl">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 flex-shrink-0"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Manage Lectures</h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate">{course?.courseTitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm md:text-base whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Lecture
          </button>
        </div>

        {/* Lectures List - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
            Course Lectures ({lectures.length})
          </h2>

          {lectures.length === 0 ? (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <PlayIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">No lectures added yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
              >
                Add Your First Lecture
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {lectures
                .sort((a, b) => a.order - b.order)
                .map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                      <span className="text-base sm:text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">
                        {index + 1}
                      </span>
                      <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base break-words">
                          {lecture.lectureTitle}
                        </h3>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mt-1 flex-wrap">
                          <span>{lecture.duration || 0} mins</span>
                          {lecture.isPreviewFree && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 sm:py-1 rounded text-xs">
                              Free Preview
                            </span>
                          )}
                          {lecture.videoUrl && (
                            <span className="text-blue-600 text-xs sm:text-sm">✓ Video uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(lecture)}
                        className="flex-1 sm:flex-none p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lecture._id)}
                        className="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Modal - Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Lecture Title */}
                  <div>
                    <label className="block font-semibold mb-2 text-sm md:text-base">
                      Lecture Title *
                    </label>
                    <input
                      type="text"
                      value={formData.lectureTitle}
                      onChange={(e) => setFormData({ ...formData, lectureTitle: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="e.g., Introduction to React Hooks"
                      required
                    />
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block font-semibold mb-2 text-sm md:text-base">
                      Upload Video
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-5 md:p-6 text-center">
                      {videoFile ? (
                        <div>
                          <p className="text-green-600 mb-2 text-sm md:text-base break-all">✓ {videoFile.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setVideoFile(null)}
                            className="text-red-600 hover:underline text-xs sm:text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : formData.videoUrl ? (
                        <div>
                          <p className="text-blue-600 mb-2 text-sm md:text-base">✓ Video already uploaded</p>
                        </div>
                      ) : (
                        <div>
                          <CloudArrowUpIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                          <p className="text-sm md:text-base text-gray-600 mb-2">Upload video file</p>
                          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">MP4, MOV, AVI (Max 500MB)</p>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="inline-block bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base"
                          >
                            Choose Video
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {uploading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-blue-700 break-words flex-1 mr-2">
                          {uploadStatus}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-blue-700 flex-shrink-0">
                          {uploadProgress}%
                        </span>
                      </div>

                      <div className="w-full bg-blue-200 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          {uploadProgress === 100 && (
                            <div className="w-full h-full bg-blue-600 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Duration & Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-sm md:text-base">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-sm md:text-base">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Free Preview */}
                  <div className="flex items-start sm:items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPreviewFree"
                      checked={formData.isPreviewFree}
                      onChange={(e) => setFormData({ ...formData, isPreviewFree: e.target.checked })}
                      className="w-4 h-4 mt-0.5 sm:mt-0 flex-shrink-0"
                    />
                    <label htmlFor="isPreviewFree" className="font-semibold text-sm md:text-base">
                      Allow free preview (anyone can watch)
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition text-sm md:text-base"
                    >
                      {uploading
                        ? `Uploading ${uploadProgress}%...`
                        : editingLecture ? 'Update Lecture' : 'Add Lecture'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      disabled={uploading}
                      className="sm:px-6 md:px-8 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLectures;