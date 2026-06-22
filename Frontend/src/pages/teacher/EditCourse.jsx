import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { CloudArrowUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
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
    courseThumbnail: '',
  });
  const [, setThumbnailFile] = useState(null);

  const categories = [
    'Development', 'DSA', 'Machine Learning', 'Business',
    'IT & Software', 'Personal Development', 'Photography',
    'Music', 'Health & Fitness', 'Teaching & Academics',
  ];

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await API.get(`/course/${id}`);
      if (data.success) {
        const course = data.data;
        setIsPublished(course.isPublished || false);
        setFormData({
          courseTitle: course.courseTitle || '',
          subTitle: course.subTitle || '',
          description: course.description || '',
          category: course.category || 'Development',
          subCategory: course.subCategory || '',
          courseLevel: course.courseLevel || 'Beginner',
          language: course.language || 'Hinglish',
          coursePrice: course.coursePrice || '',
          originalPrice: course.originalPrice || '',
          courseThumbnail: course.courseThumbnail || '',
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load course');
      navigate('/teacher/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, courseThumbnail: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put(`/course/${id}`, formData);
      if (data.success) {
        alert('Course updated successfully!');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      const { data } = await API.delete(`/course/${id}`);
      if (data.success) {
        alert('Course deleted successfully!');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleTogglePublish = async () => {
    try {
      const { data } = await API.patch(`/course/${id}/publish`);
      if (data.success) {
        alert(data.message);
        fetchCourseDetails();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update publish status');
    }
  };

  // Shared classes
  const inputCls =
    'w-full px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm md:text-base transition';
  const labelCls = 'block font-semibold mb-2 text-sm text-gray-800';

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
        <p className="text-gray-500 text-sm">Loading course…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden text-black">
      <section className="relative py-10 md:py-16 mx-4 sm:mx-6 md:mx-10 lg:mx-16">
        <div className="container px-6 mx-auto md:px-12 max-w-3xl">

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
              Edit Course
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                Edit{' '}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Course
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Update your course details below.</p>
            </div>

            {/* Publish + Delete actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleTogglePublish}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isPublished
                    ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>

          {/* ── Form card ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 p-6 md:p-8 space-y-6"
          >

            {/* Section: Basic Info */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">Basic Info</p>
              <div className="space-y-4">

                <div>
                  <label className={labelCls}>Course Title <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className={labelCls}>Subtitle</label>
                  <input
                    type="text"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="A brief one-line description"
                    maxLength={120}
                  />
                </div>

                <div>
                  <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputCls} resize-none`}
                    placeholder="What will students learn? What are the prerequisites?"
                    required
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {formData.description.length}/2000
                  </p>
                </div>

              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Section: Details */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">Course Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className={labelCls}>Category <span className="text-red-400">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputCls} required>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Course Level <span className="text-red-400">*</span></label>
                  <select name="courseLevel" value={formData.courseLevel} onChange={handleChange} className={inputCls} required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Language <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g., Hinglish, English"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>Sub-category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g., Web Development"
                  />
                </div>

              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Section: Pricing */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">Pricing</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className={labelCls}>Course Price (₹) <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input
                      type="number"
                      name="coursePrice"
                      value={formData.coursePrice}
                      onChange={handleChange}
                      className={`${inputCls} pl-8`}
                      placeholder="499"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Original Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      className={`${inputCls} pl-8`}
                      placeholder="999"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Used to show a discount badge</p>
                </div>

              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Section: Thumbnail */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-4">Thumbnail</p>

              {formData.courseThumbnail ? (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
                  <img
                    src={formData.courseThumbnail}
                    alt="Thumbnail preview"
                    className="w-full max-h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, courseThumbnail: '' });
                        setThumbnailFile(null);
                      }}
                      className="bg-white text-red-500 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-red-50 transition"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="thumbnail-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#7c3aed] rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition">
                    <CloudArrowUpIcon className="w-7 h-7 text-[#7c3aed]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload new thumbnail</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  <span className="mt-4 inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                    Choose File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                </label>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60 text-sm md:text-base"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving Changes…
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/teacher/dashboard')}
                className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-purple-300 hover:text-[#7c3aed] transition-all duration-200 text-sm md:text-base"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default EditCourse;