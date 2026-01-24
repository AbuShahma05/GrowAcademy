import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <AcademicCapIcon className="w-12 h-12 text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from industry experts with years of experience"
    },
    {
      icon: <UserGroupIcon className="w-12 h-12 text-blue-600" />,
      title: "Community Learning",
      description: "Join thousands of students learning together"
    },
    {
      icon: <ChartBarIcon className="w-12 h-12 text-blue-600" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics"
    },
    {
      icon: <CheckCircleIcon className="w-12 h-12 text-blue-600" />,
      title: "Certificates",
      description: "Earn certificates upon course completion"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Welcome to GrowAcademy
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Learn new skills, advance your career, and achieve your goals with our world-class courses
          </p>

          {isAuthenticated ? (
            <Link
              to={`/${user.role.toLowerCase()}/dashboard`}
              className="inline-block bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/courses"
                className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
            Why Choose GrowAcademy?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">10,000+</h3>
              <p className="text-base md:text-xl">Students Enrolled</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">500+</h3>
              <p className="text-base md:text-xl">Expert Instructors</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">1,000+</h3>
              <p className="text-base md:text-xl">Quality Courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of students already learning on GrowAcademy
          </p>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign Up Now - It's Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;