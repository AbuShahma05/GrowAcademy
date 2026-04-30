import Studentphoto from '../assets/Studentphoto.png'
import Google from '../assets/Google.png'
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
      icon: <AcademicCapIcon className="w-12 h-12 text-[#fb7241]" />,
      title: "Expert Instructors",
      description: "Learn from industry experts with years of experience"
    },
    {
      icon: <UserGroupIcon className="w-12 h-12 text-[#fb7241]" />,
      title: "Community Learning",
      description: "Join thousands of students learning together"
    },
    {
      icon: <ChartBarIcon className="w-12 h-12 text-[#fb7241]" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics"
    },
    {
      icon: <CheckCircleIcon className="w-12 h-12 text-[#fb7241]" />,
      title: "Certificates",
      description: "Earn certificates upon course completion"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#e2754d] py-12 md:py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-10">

          {/* Left side texxt */}
          <div className="md:text-xl px-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-8">
              Welcome to GrowAcademy
            </h1>
            <h4 className="text-base md:text-xl mb-6">
              Learn new skills, advance your career, and achieve your goals with
            </h4>

            <h4 className="text-base md:text-xl mb-6">
              our world-class courses
            </h4>
            {isAuthenticated ? (
              <Link
                to={`/${user.role.toLowerCase()}/dashboard`}
                className="inline-block bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-6 md:px-8 py-3 rounded-xl font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  to="/courses"
                  className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-400 transition"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDE (IMAGE) */}
          <div className="flex justify-center relative">

            {/* GREEN CARD */}
            <div className="absolute w-64 h-40 bg-green-500 rounded-2xl rotate-12 top-10 right-10 z-0"></div>

            {/* ORANGE CARD */}
            <div className="absolute w-64 h-40 bg-orange-400 rounded-2xl -rotate-12 top-20 right-0 z-0"></div>

            <img
              src={Studentphoto}
              alt="student"
              className="w-full max-w-lg md:max-w-xl drop-shadow-xl"
            />

            <img src="Google" alt="Logo" />
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-100">
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