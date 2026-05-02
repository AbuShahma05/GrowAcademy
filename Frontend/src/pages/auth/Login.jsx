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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW ↓ show/hide state
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-200 px-4 py-8'>
      <div className='bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-center'>
          Login
        </h2>

        {error && (
          <div className='bg-red-100 text-red-700 p-3 rounded mb-4 text-sm md:text-base'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Email — UNCHANGED */}
          <div>
            <label className='block mb-2 text-sm md:text-base'>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className='w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base'
              required
            />
          </div>

          {/* Password — NEW: show/hide toggle added */}
          <div>
            <label className='block mb-2 text-sm md:text-base'>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className='w-full px-4 py-2 md:py-3 pr-11 border rounded focus:outline-none focus:ring-1 focus:ring-black text-sm md:text-base'
                required
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
          </div>

          {/* Submit — UNCHANGED */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-2 md:py-3 rounded-xl hover:bg-[#fb7241] disabled:bg-gray-400 transition text-sm md:text-base font-semibold'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='mt-4 text-center text-sm md:text-base'>
          Don't have an account?{' '}
          <Link to="/register" className="text-black hover:text-[#fb7241]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
