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

// ── Eye icons ─────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Shared input class ────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm transition bg-white';

// ── Field wrapper ─────────────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
  <div>
    <label className="block mb-1.5 font-semibold text-sm text-gray-800">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
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
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        headers: { 'Content-Type': 'multipart/form-data' }
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
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  const roleBadge = {
    Admin: 'bg-purple-100 text-purple-700',
    Teacher: 'bg-blue-100 text-blue-700',
    Student: 'bg-green-100 text-green-700',
  };

  const tabs = [
    { key: 'profile', label: 'Profile', Icon: UserCircleIcon },
    { key: 'password', label: 'Password', Icon: KeyIcon },
    { key: 'settings', label: 'Settings', Icon: TrashIcon },
  ];

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 text-black">
      <div className="max-w-2xl mx-auto">

        {/* ── Page title ── */}
        <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-2 text-center">
          Account
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-8">
          Your{' '}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
            profile
          </span>
        </h1>

        {/* ── Alert banner ── */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-2 ${message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              {message.type === 'success'
                ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 001.5 0v-3.5a.75.75 0 00-1.5 0v3.5zm.75-6a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* ── Profile header card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={photoPreview || 'https://via.placeholder.com/100'}
              alt={user?.username}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-[#7c3aed] ring-offset-2"
            />
            {activeTab === 'profile' && (
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-[#7c3aed] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#a855f7] transition shadow"
              >
                <CameraIcon className="w-4 h-4" />
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
            <h2 className="text-xl font-bold text-black">{user?.username}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge[user?.role] || 'bg-gray-100 text-gray-600'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition ${activeTab === key
                    ? 'border-b-2 border-[#7c3aed] text-[#7c3aed] bg-purple-50'
                    : 'text-gray-500 hover:text-[#7c3aed] hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">

            {/* ── Profile Tab ── */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <Field label="Username">
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className={inputCls}
                    required
                    minLength={3}
                    maxLength={25}
                    placeholder="Your username"
                  />
                </Field>

                <Field label="Bio" hint={`${profileData.bio.length}/500 characters`}>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                </Field>

                <div>
                  <p className="font-semibold text-sm text-gray-800 mb-3">Social links <span className="text-gray-400 font-normal">(optional)</span></p>
                  <div className="space-y-3">
                    {[
                      { key: 'website', placeholder: 'Website URL' },
                      { key: 'linkedin', placeholder: 'LinkedIn profile URL' },
                      { key: 'twitter', placeholder: 'Twitter profile URL' },
                      { key: 'youtube', placeholder: 'YouTube channel URL' },
                    ].map(({ key, placeholder }) => (
                      <input
                        key={key}
                        type="url"
                        placeholder={placeholder}
                        value={profileData.socialLinks[key]}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, [key]: e.target.value }
                        })}
                        className={inputCls}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving…
                    </span>
                  ) : 'Save changes'}
                </button>
              </form>
            )}

            {/* ── Password Tab ── */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <Field label="Current password">
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className={`${inputCls} pr-11`}
                      required
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition">
                      {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </Field>

                <Field label="New password" hint="Minimum 8 characters">
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={`${inputCls} pr-11`}
                      required
                      minLength={8}
                      placeholder="Create a new password"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition">
                      {showNew ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm new password">
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`${inputCls} pr-11`}
                      required
                      placeholder="Re-enter new password"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition">
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {passwordData.confirmPassword.length > 0 && (
                    <p className={`text-xs mt-1.5 font-medium ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-500'
                      }`}>
                      {passwordData.newPassword === passwordData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Changing password…
                    </span>
                  ) : 'Change password'}
                </button>
              </form>
            )}

            {/* ── Settings Tab ── */}
            {activeTab === 'settings' && (
              <div className="space-y-4">

                {/* Account info */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <h3 className="font-semibold text-green-800 text-sm flex items-center gap-2 mb-3">
                    <CheckCircleIcon className="w-4 h-4" />
                    Account information
                  </h3>
                  <div className="space-y-1.5 text-sm text-green-700">
                    <p><span className="font-medium">Email verified:</span> {user?.isEmailVerified ? 'Yes ✓' : 'No ✗'}</p>
                    <p><span className="font-medium">Account status:</span> {user?.isActive ? 'Active' : 'Inactive'}</p>
                    <p><span className="font-medium">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Deactivate */}
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <h3 className="font-semibold text-yellow-800 text-sm mb-1">Deactivate account</h3>
                  <p className="text-xs text-yellow-700 mb-3">
                    Temporarily disable your account. You can reactivate it by logging in again.
                  </p>
                  <button
                    onClick={handleDeactivateAccount}
                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition w-full sm:w-auto"
                  >
                    Deactivate account
                  </button>
                </div>

                {/* Delete */}
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <h3 className="font-semibold text-red-800 text-sm mb-1">Delete account</h3>
                  <p className="text-xs text-red-700 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition w-full sm:w-auto"
                  >
                    Delete account permanently
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;