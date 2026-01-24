import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm md:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              required
              minLength={3}
              maxLength={25}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              required
              minLength={8}
            />
            <p className="text-xs md:text-sm text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm md:text-base">I want to:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="Student">Learn (Student)</option>
              <option value="Teacher">Teach (Instructor)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 md:py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition text-sm md:text-base font-semibold"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm md:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;