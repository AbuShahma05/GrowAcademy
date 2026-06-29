import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MdArrowOutward } from "react-icons/md";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-white text-black sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-[#7c3aed]">Grow</span>
            <span className="text-black">Academy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <Link to="/" className=" bg-black text-white px-6 py-1 rounded-full hover:bg-[#7c3aed] transition text-center">
              Home
            </Link>

            <Link to="/courses" className="hover:text-white px-4 py-1 rounded-full hover:bg-[#7c3aed] transition text-center">
              Courses
            </Link>

            <Link to="/about" className="hover:text-white px-4 py-1 rounded-full hover:bg-[#7c3aed] transition text-center">
              About Us
            </Link>

            <Link to="/contact" className="flex items-center gap-1 underline underline-offset-8 px-4 py-1 rounded-full hover:bg-[#7c3aed] hover:text-white transition-all duration-300">
              Contact Us
              <MdArrowOutward />
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={`/${user.role.toLowerCase()}/dashboard`}
                  className="font-bold px-4 py-1 rounded-full hover:bg-[#7c3aed] hover:text-white transition"
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown - Desktop */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 hover:text-[#7c3aed]"
                  >
                    <img
                      src={user.photoUrl || 'https://via.placeholder.com/40'}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        My Profile
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Settings
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white px-4 py-1 rounded-full hover:bg-[#7c3aed] transition text-center">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-black text-white px-4 py-1 rounded-full hover:bg-[#7c3aed] transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-full hover:bg-[#7c3aed] hover:text-white transition text-center"
              >
                Home
              </Link>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#7c3aed] transition"
              >
                About Us
              </Link>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#7c3aed] transition"
              >
                Contact Us
              </Link>

              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#7c3aed] transition"
              >
                Courses
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={`/${user.role.toLowerCase()}/dashboard`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#7c3aed] transition"
                  >
                    Dashboard
                  </Link>

                  {/* Profile Section - Mobile */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={user.photoUrl || 'https://via.placeholder.com/40'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 hover:text-[#7c3aed]"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-white px-6 py-1 rounded-full hover:bg-[#7c3aed] transition text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-black text-white px-4 py-2 rounded-xl hover:bg-[#7c3aed] transition text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;