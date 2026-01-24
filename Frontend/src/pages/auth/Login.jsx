import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8'>
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
          <div>
            <label className='block mb-2 text-sm md:text-base'>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className='w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-sm md:text-base'>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className='w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 md:py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition text-sm md:text-base font-semibold'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='mt-4 text-center text-sm md:text-base'>
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;