import Studentphoto from '../assets/Studentphoto.png'
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
      icon: <AcademicCapIcon className="w-10 h-10 text-[#7c3aed]" />,
      title: "Expert Instructors",
      description: "Learn from industry experts with years of real-world experience."
    },
    {
      icon: <UserGroupIcon className="w-10 h-10 text-[#7c3aed]" />,
      title: "Community Learning",
      description: "Join thousands of students learning and growing together."
    },
    {
      icon: <ChartBarIcon className="w-10 h-10 text-[#7c3aed]" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics."
    },
    {
      icon: <CheckCircleIcon className="w-10 h-10 text-[#7c3aed]" />,
      title: "Certificates",
      description: "Earn recognised certificates upon course completion."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-white text-black py-16 md:py-24 overflow-hidden">

        {/* Purple glow — right side (large, soft) */}
        <div className="absolute -right-32 top-0 w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[120px] z-0 pointer-events-none" />

        {/* Purple glow — left side (smaller) */}
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-purple-300 opacity-15 rounded-full blur-3xl z-0 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-12">

          {/* ── LEFT TEXT ── */}
          <div>

            {/* Badge */}
            <p className="inline-flex items-center text-[#7c3aed] text-xs font-semibold tracking-widest border border-[#7c3aed] rounded-full px-4 py-1 mb-8">
              AI-POWERED ONLINE LEARNING PLATFORM
            </p>

            {/* Heading */}
            <div className="relative mb-6">
              {/* Soft glow behind heading */}
              <div className="absolute -top-24 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-500 via-purple-300 to-transparent opacity-40 rounded-full blur-[80px] z-0 pointer-events-none" />
              <h1 className="relative z-10 text-4xl md:text-6xl font-bold leading-tight">
                Unlock Learning{" "}
                <br className="hidden md:block" />
                with{" "}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Expert-Led
                </span>{" "}
                <br />
                Courses
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-gray-500 text-base md:text-lg mb-10 max-w-md">
              Join thousands of learners gaining new skills through engaging, flexible online courses.
            </p>

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <Link
                to={`/${user.role.toLowerCase()}/dashboard`}
                className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition text-center"
                >
                  Start Learning
                </Link>
                <Link
                  to="/courses"
                  className="bg-transparent border-2 border-gray-300 text-black px-8 py-3 rounded-xl font-semibold hover:border-[#7c3aed] hover:bg-gradient-to-r from-[#7c3aed] transition text-center"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>

          {/* ── RIGHT IMAGE ── */}
          <div className="flex justify-center relative">

            {/* Background decorative cards — like the reference design */}
            <div className="absolute w-80 h-96 bg-gradient-to-br from-violet-300 to-purple-400 rounded-2xl -rotate-90 bottom-0.5 left-44 z-0 opacity-50 shadow-2xl" />

            {/* AI Powered badge floating on image */}
            <div className="absolute top-20 left-28 z-20 bg-white shadow-lg rounded-full px-2 py-2 flex items-center gap-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✦</span>
              </div>
              <span className="text-xs font-semibold text-black">AI Powered</span>
            </div>

            <img
              src={Studentphoto}
              alt="Student learning"
              className="relative z-10 w-full max-w-md md:max-w-lg drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* ─── TRUSTED BY ─── */}
      <section className="py-8 bg-white border-t border-b border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">
            Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
            {["Contentful", "Webflow", "Airtable", "Atlassian", "Freshworks"].map((brand) => (
              <span key={brand} className="text-gray-600 font-bold text-sm md:text-base tracking-wide">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">

        {/* Background purple glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 opacity-15 rounded-full blur-3xl z-0 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 md:px-12">

          {/* Section label */}
          <p className="text-center text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
            Services
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
            Team potential with{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
              AI learning.
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Everything you need to build skills, track growth, and earn recognition.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer"
              >
                {/* Number label like reference design */}
                <p className="text-4xl font-bold text-gray-100 mb-2 group-hover:text-purple-100 transition">
                  0{index + 1}
                </p>
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
                <p className="mt-4 text-xs font-semibold text-[#7c3aed] tracking-wide group-hover:underline">
                  EXPLORE →
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { number: "10,000+", label: "Students Enrolled" },
              { number: "500+", label: "Expert Instructors" },
              { number: "1,000+", label: "Quality Courses" },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-500 text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-16 md:py-24 overflow-hidden">

        {/* Full gradient background like reference */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] z-0" />

        {/* Decorative blobs inside CTA */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl z-0" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <p className="text-purple-200 text-xs font-semibold tracking-widest uppercase mb-4">
            Join Us Today
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto">
            Boost your team's skills with AI-driven training.
          </h2>
          <p className="text-purple-200 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Join thousands of students already learning on GrowAcademy.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-block bg-white text-[#7c3aed] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Get a Demo →
              </Link>
              <Link
                to="/courses"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7c3aed] transition"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;