import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent mb-3">
              GrowAcademy
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed max-w-xs">
              An AI-powered learning platform helping students build real skills through expert-led courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-widest uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Browse Courses', to: '/courses' },
                { label: 'Become an Instructor', to: '/register' },
                { label: 'Student Login', to: '/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-700 hover:text-[#7c3aed] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-widest uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Help Center', to: '/' },
                { label: 'Privacy Policy', to: '/' },
                { label: 'Terms of Service', to: '/' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-700 hover:text-[#7c3aed] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-gray-700">
            &copy; 2026 GrowAcademy. All rights reserved.
          </p>
          <span className="hidden sm:block text-gray-300">|</span>
          <p className="text-xs text-gray-700">
            Built for learners, by learners.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;