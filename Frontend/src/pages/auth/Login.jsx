import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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

// ─────────────────────────────────────────────────────────────────────
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const inputCls =
    'w-full px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm md:text-base transition';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 overflow-x-hidden">
      <div className="w-full max-w-md">

        {/* ── Eyebrow + heading ── */}
        <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3 text-center">
          Welcome Back
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-center text-black">
          Log in to your{' '}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
            account
          </span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#7c3aed] font-semibold hover:text-[#a855f7] transition">
            Sign up
          </Link>
        </p>

        {/* ── Card ── */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300">

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

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold text-sm text-gray-800">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className={inputCls}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-sm text-gray-800">Password</label>
                <span className="text-xs text-[#7c3aed] hover:text-[#a855f7] cursor-pointer transition font-medium">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`${inputCls} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
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
                  Logging in…
                </span>
              ) : (
                'Log In'
              )}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By logging in you agree to our{' '}
          <span className="text-[#7c3aed] hover:underline cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-[#7c3aed] hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

      </div>
    </div>
  );
};

export default Login;