import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { CloudArrowUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: '',
    subTitle: '',
    description: '',
    category: 'Development',
    subCategory: '',
    courseLevel: 'Beginner',
    language: 'Hinglish',
    coursePrice: '',
    originalPrice: '',
    courseThumbnail: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const categories = [
    'Development',
    'DSA',
    'Machine Learning',
    'Business',
    'IT & Software',
    'Personal Development',
    'Photography',
    'Music',
    'Health & Fitness',
    'Teaching & Academics'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, courseThumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'courseThumbnail') {
          courseData.append(key, formData[key]);
        }
      });

      if (thumbnailFile) {
        courseData.append('courseThumbnail', thumbnailFile);
      }

      const { data } = await API.post('/course/create', courseData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        alert('Course created successfully!');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Create New Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-8 space-y-4 md:space-y-6">
          {/* Course Title */}
          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Course Title *</label>
            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              placeholder="e.g., Complete Web Development Bootcamp"
              required
              maxLength={100}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Subtitle</label>
            <input
              type="text"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              placeholder="A brief description"
              maxLength={120}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              placeholder="Detailed course description..."
              required
              maxLength={2000}
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Course Level *</label>
              <select
                name="courseLevel"
                value={formData.courseLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Language & Sub-category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Language *</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="e.g., Hinglish, English"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Sub-category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="e.g., Web Development"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Course Price (₹) *</label>
              <input
                type="number"
                name="coursePrice"
                value={formData.coursePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="499"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm md:text-base">Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="999"
                min="0"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-1">For showing discounts</p>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block font-semibold mb-2 text-sm md:text-base">Course Thumbnail *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
              {formData.courseThumbnail ? (
                <div className="relative">
                  <img
                    src={formData.courseThumbnail}
                    alt="Thumbnail preview"
                    className="max-h-48 md:max-h-64 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, courseThumbnail: '' });
                      setThumbnailFile(null);
                    }}
                    className="mt-4 text-red-600 hover:underline text-sm md:text-base"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <CloudArrowUpIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm md:text-base text-gray-600 mb-2">Click to upload course thumbnail</p>
                  <p className="text-xs md:text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 md:px-6 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition text-sm md:text-base"
            >
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="px-6 md:px-8 py-2 md:py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;