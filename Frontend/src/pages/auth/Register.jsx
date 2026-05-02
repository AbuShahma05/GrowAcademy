import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ── Password strength calculator ──────────────────────────────────────
const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', text: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Too weak', color: 'bg-red-500', text: 'text-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-400', text: 'text-orange-400' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-400', text: 'text-yellow-500' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
  return { score, label: 'Very strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
};

// ── Eye icons (SVG, no extra library needed) ──────────────────────────
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

// ── Green check badge (appears when 8+ chars typed) ───────────────────
const CheckBadge = () => (
  <span
    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 ml-2"
    title="Meets minimum length"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

// ─────────────────────────────────────────────────────────────────────
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW ↓ show/hide state for both password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW ↓ live calculations
  const strength = getStrength(formData.password);
  const meetsMinimum = formData.password.length >= 8;
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword: _confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-200 px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm md:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username — UNCHANGED */}
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base"
              required
              minLength={3}
              maxLength={25}
            />
          </div>

          {/* Email — UNCHANGED */}
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base"
              required
            />
          </div>

          {/* Password — NEW: check badge + show/hide + strength bar */}
          <div>
            <label className="flex items-center mb-2 font-medium text-sm md:text-base">
              Password
              {/* Green check badge — pops in when 8+ characters typed */}
              {meetsMinimum && <CheckBadge />}
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 pr-11 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base"
                required
                minLength={8}
              />
              {/* 👁 Show / Hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Strength bar — only visible when user starts typing */}
            {formData.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${seg <= strength.score ? strength.color : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strength.text}`}>
                  {strength.label}
                </p>
              </div>
            )}

            {/* Helper text — turns green when minimum met */}
            <p className={`text-xs md:text-sm mt-1 transition-colors duration-300 ${meetsMinimum ? 'text-green-600' : 'text-gray-500'
              }`}>
              {meetsMinimum
                ? '✓ Password meets the minimum requirement'
                : 'Minimum 8 characters'}
            </p>
          </div>

          {/* Confirm Password — NEW: show/hide + live match indicator */}
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 md:py-3 pr-11 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base"
                required
              />
              {/* 👁 Show / Hide toggle */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Live match feedback — only shows when user types in confirm field */}
            {formData.confirmPassword.length > 0 && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'
                }`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Role — UNCHANGED */}
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">I want to:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base"
            >
              <option value="Student">Learn (Student)</option>
              <option value="Teacher">Teach (Instructor)</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit — UNCHANGED */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 md:py-3 rounded-xl hover:bg-[#fb7241] disabled:bg-gray-400 transition text-sm md:text-base font-semibold"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm md:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:text-[#fb7241]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
