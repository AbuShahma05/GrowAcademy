import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';

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

// ── Green check badge ─────────────────────────────────────────────────
const CheckBadge = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 ml-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

// ── Field wrapper ─────────────────────────────────────────────────────
const Field = ({ label, badge, children, hint }) => (
  <div>
    <label className="flex items-center mb-2 font-semibold text-sm text-gray-800">
      {label}
      {badge}
    </label>
    {children}
    {hint}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  // Shared input class
  const inputCls =
    'w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm md:text-base transition';

  const roles = [
    { value: 'Student', Icon: BookOpenIcon, label: 'Learn', sub: 'Student' },
    { value: 'Teacher', Icon: AcademicCapIcon, label: 'Teach', sub: 'Instructor' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 overflow-x-hidden">
      <div className="w-full max-w-md">

        {/* ── Eyebrow + heading ── */}
        <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3 text-center">
          Get Started
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-center text-black">
          Create your{' '}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
            account
          </span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7c3aed] font-semibold hover:text-[#a855f7] transition">
            Log in
          </Link>
        </p>

        {/* ── Card ── */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-500 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 001.5 0v-3.5a.75.75 0 00-1.5 0v3.5zm.75-6a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-black">

            {/* Username */}
            <Field label="Username">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. johndoe"
                className={inputCls}
                required
                minLength={3}
                maxLength={25}
              />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputCls}
                required
              />
            </Field>

            {/* Password */}
            <Field
              label="Password"
              badge={meetsMinimum && <CheckBadge />}
              hint={
                formData.password.length > 0 ? (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <div
                          key={seg}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${seg <= strength.score ? strength.color : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${strength.text}`}>{strength.label}</p>
                      <p className={`text-xs transition-colors duration-300 ${meetsMinimum ? 'text-green-600' : 'text-gray-400'}`}>
                        {meetsMinimum ? '✓ Meets minimum' : 'Min. 8 characters'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                )
              }
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`${inputCls} pr-11`}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </Field>

            {/* Confirm Password */}
            <Field
              label="Confirm Password"
              hint={
                formData.confirmPassword.length > 0 && (
                  <p className={`text-xs mt-1.5 font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )
              }
            >
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`${inputCls} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </Field>

            {/* Role selector — pill toggle */}
            <div>
              <label className="block mb-2 font-semibold text-sm text-gray-800">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ value, Icon, label, sub }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: value })}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${formData.role === value
                      ? 'border-[#7c3aed] bg-purple-50 text-[#7c3aed]'
                      : 'border-gray-200 text-gray-600 hover:border-purple-300'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition ${formData.role === value ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                    {formData.role === value && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60 text-sm md:text-base mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account you agree to our{' '}
          <span className="text-[#7c3aed] hover:underline cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-[#7c3aed] hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

      </div>
    </div>
  );
};

export default Register;