import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import {
  UserCircleIcon,
  CameraIcon,
  KeyIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    socialLinks: {
      website: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    }
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        bio: user.bio || '',
        socialLinks: user.socialLinks || {
          website: '',
          linkedin: '',
          twitter: '',
          youtube: ''
        }
      });
      setPhotoPreview(user.photoUrl || '');
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Handle Profile Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Image size should be less than 5MB');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update Profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('bio', profileData.bio);
      formData.append('socialLinks', JSON.stringify(profileData.socialLinks));

      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      const { data } = await API.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        showMessage('success', 'Profile updated successfully!');

        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (data.success) {
        showMessage('success', 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Deactivate Account
  const handleDeactivateAccount = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You can reactivate it by logging in again.')) {
      return;
    }

    try {
      const { data } = await API.put('/user/deactivate');
      if (data.success) {
        showMessage('success', 'Account deactivated successfully');
        setTimeout(() => logout(), 2000);
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to deactivate account');
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;

    if (!window.confirm('⚠️ WARNING: This action cannot be undone! Are you absolutely sure you want to permanently delete your account?')) {
      return;
    }

    try {
      const { data } = await API.delete('/user/delete-account', {
        data: { password }
      });

      if (data.success) {
        showMessage('success', 'Account deleted successfully');
        setTimeout(() => logout(), 2000);
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
        {/* Header - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={photoPreview || 'https://via.placeholder.com/100'}
                alt={user?.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-[#fb7241]"
              />
              {activeTab === 'profile' && (
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-black text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-[#fb7241] transition"
                >
                  <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold break-words">{user?.username}</h1>
              <p className="text-sm sm:text-base text-gray-600 break-all">{user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${user?.role === 'Admin' ? 'bg-red-100 text-red-700' :
                user?.role === 'Teacher' ? 'bg-blue-100 text-black' :
                  'bg-green-100 text-[#fb7241]'
                }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Message Alert - Responsive */}
        {message.text && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {message.text}
          </div>
        )}

        {/* Tabs - Responsive */}
        <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-semibold text-sm sm:text-base whitespace-nowrap ${activeTab === 'profile'
                ? 'border-b-2 border-[#fb7241] text-black'
                : 'text-gray-600 hover:text-[#fb7241]'
                }`}
            >
              <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-semibold text-sm sm:text-base whitespace-nowrap ${activeTab === 'password'
                ? 'border-b-2 border-[#fb7241] text-black'
                : 'text-gray-600 hover:text-[#fb7241]'
                }`}
            >
              <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Password</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-semibold text-sm sm:text-base whitespace-nowrap ${activeTab === 'settings'
                ? 'border-b-2 border-[#fb7241] text-black'
                : 'text-gray-600 hover:text-[#fb7241]'
                }`}
            >
              <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Tab Content - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-sm sm:text-base">Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  required
                  minLength={3}
                  maxLength={25}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm sm:text-base">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Social Links (Optional)</h3>
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={profileData.socialLinks.website}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, website: e.target.value }
                    })}
                    className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={profileData.socialLinks.linkedin}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                    })}
                    className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="url"
                    placeholder="Twitter Profile URL"
                    value={profileData.socialLinks.twitter}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                    })}
                    className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="url"
                    placeholder="YouTube Channel URL"
                    value={profileData.socialLinks.youtube}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      socialLinks: { ...profileData.socialLinks, youtube: e.target.value }
                    })}
                    className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#fb7241] disabled:bg-gray-400 transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block font-semibold mb-2 text-sm sm:text-base">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm sm:text-base">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  required
                  minLength={8}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm sm:text-base">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#fb7241] disabled:bg-gray-400 transition"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 sm:p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Deactivate Account</h3>
                <p className="text-xs sm:text-sm text-yellow-700 mb-3 sm:mb-4">
                  Temporarily disable your account. You can reactivate it by logging in again.
                </p>
                <button
                  onClick={handleDeactivateAccount}
                  className="bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base hover:bg-yellow-700 transition w-full sm:w-auto"
                >
                  Deactivate Account
                </button>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-3 sm:p-4">
                <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Delete Account</h3>
                <p className="text-xs sm:text-sm text-red-700 mb-3 sm:mb-4">
                  ⚠️ Permanently delete your account and all associated data. This action cannot be undone!
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Delete Account Permanently
                </button>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-3 sm:p-4">
                <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Account Information
                </h3>
                <div className="text-xs sm:text-sm text-green-700 space-y-2">
                  <p className="break-words"><strong>Email Verified:</strong> {user?.isEmailVerified ? 'Yes ✓' : 'No ✗'}</p>
                  <p className="break-words"><strong>Account Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}</p>
                  <p className="break-words"><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;