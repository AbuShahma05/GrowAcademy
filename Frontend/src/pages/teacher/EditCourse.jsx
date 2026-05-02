import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [, setThumbnailFile] = useState(null);

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

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const { data } = await API.get(`/course/${id}`);
            if (data.success) {
                const course = data.data;
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
                    courseThumbnail: course.courseThumbnail || ''
                });
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to load course');
            navigate('/teacher/dashboard');
        } finally {
            setLoading(false);
        }
    };

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
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-200 py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Edit Course</h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleTogglePublish}
                            className="px-4 sm:px-6 py-2 bg-black text-white rounded-xl text-sm sm:text-base hover:bg-green-500 transition"
                        >
                            {formData.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-xl text-sm sm:text-base hover:bg-red-900 transition"
                        >
                            Delete Course
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                    {/* Course Title */}
                    <div>
                        <label className="block font-semibold mb-2 text-sm sm:text-base">Course Title *</label>
                        <input
                            type="text"
                            name="courseTitle"
                            value={formData.courseTitle}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="e.g., Complete Web Development Bootcamp"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block font-semibold mb-2 text-sm sm:text-base">Subtitle</label>
                        <input
                            type="text"
                            name="subTitle"
                            value={formData.subTitle}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="A brief description"
                            maxLength={120}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold mb-2 text-sm sm:text-base">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Detailed course description..."
                            required
                            maxLength={2000}
                        />
                    </div>

                    {/* Category & Level - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Course Level *</label>
                            <select
                                name="courseLevel"
                                value={formData.courseLevel}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Language & Sub-category - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Language *</label>
                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="e.g., Hinglish, English"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Sub-category</label>
                            <input
                                type="text"
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="e.g., Web Development"
                            />
                        </div>
                    </div>

                    {/* Pricing - Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Course Price (₹) *</label>
                            <input
                                type="number"
                                name="coursePrice"
                                value={formData.coursePrice}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="499"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-sm sm:text-base">Original Price (₹)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="999"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Thumbnail - Responsive */}
                    <div>
                        <label className="block font-semibold mb-2 text-sm sm:text-base">Course Thumbnail</label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center">
                            {formData.courseThumbnail ? (
                                <div className="relative">
                                    <img
                                        src={formData.courseThumbnail}
                                        alt="Thumbnail preview"
                                        className="max-h-48 sm:max-h-64 w-full object-contain mx-auto rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, courseThumbnail: '' });
                                            setThumbnailFile(null);
                                        }}
                                        className="mt-3 sm:mt-4 text-sm sm:text-base text-red-600 hover:underline"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <CloudArrowUpIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-sm sm:text-base text-gray-600 mb-2">Click to upload new thumbnail</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                        id="thumbnail-upload"
                                    />
                                    <label
                                        htmlFor="thumbnail-upload"
                                        className="inline-block mt-3 sm:mt-4 bg-black text-white px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base cursor-pointer hover:bg-[#fb7241]"
                                    >
                                        Choose File
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-black text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#fb7241] disabled:bg-gray-400 transition"
                        >
                            {saving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/teacher/dashboard')}
                            className="sm:px-8 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;