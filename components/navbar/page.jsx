"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token"); // replace with your auth token logic
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    setIsLoggedIn(false);
    window.location.href = "/"; // redirect after logout
  };

  return (
    <nav className="w-full bg-[#f7f9fc] py-3 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Image
              src="/logo.png"
              alt="CV Craft Logo"
              width={100}
              height={30}
              className="object-contain sm:w-[75px] sm:h-[37px] lg:w-[90px] lg:h-[45px]"
            />
            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-blue-800">
              CRAFT
            </span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-4 lg:space-x-8 text-sm lg:text-lg text-gray-700 font-semibold">
            <li>
              <Link href="/" className="hover:text-purple-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-purple-600 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-purple-600 transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-600 transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Right - Login / Logout */}
        <div className="hidden md:flex items-center">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="border border-purple-400 text-purple-600 pl-3 lg:pl-4 pr-1.5 lg:pr-2 py-1 lg:py-1.5 rounded-full hover:bg-purple-50 transition flex items-center justify-center gap-2 lg:gap-3"
            >
              <span className="text-sm lg:text-base">Login</span>
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center rounded-full">
                <span className="text-white text-sm lg:text-base">→</span>
              </div>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition whitespace-nowrap"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6 text-purple-700" /> : <Menu className="w-6 h-6 text-purple-700" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-md p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-800 hover:text-purple-600 py-1"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-800 hover:text-purple-600 py-1"
          >
            About
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-800 hover:text-purple-600 py-1"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-800 hover:text-purple-600 py-1 "
          >
            Blog
          </Link>

          <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="border border-purple-400 text-purple-600 text-center px-4 py-2 rounded-full hover:bg-purple-50 transition whitespace-nowrap cursor-pointer"
              >
                Login →
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition whitespace-nowrap"
              >
                Logout →
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
