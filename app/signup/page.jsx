"use client";
import React, { useState } from 'react';
import Image from "next/image";
import axios from "axios";
import Toast from '@/components/Toast.jsx';
import ClipLoader from "react-spinners/ClipLoader";


export default function Signup() {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
    emailUpdates: false
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 letters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = res.data;

      setLoading(false);

      if (data.success) {
        setToastMessage("Registration successful!");
        setShowToast(true);

        // If backend returns token, store it
        if (data.token) {
          localStorage.setItem("token", data.token);
          // localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect to login page or dashboard
       window.location.href = "/"
      } else {
        setToastMessage(data.message);
        setShowToast(true);
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      setToastMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-6 py-5">
        <Image
          src="/logo.png"
          alt="CV Craft Logo"
          width={100}
          height={30}
          className="object-contain sm:w-[75px] sm:h-[37px] lg:w-[90px] lg:h-[45px]"
        />
        <span className="text-2xl font-semibold text-gray-800">CRAFT</span>
      </div>
      {/* Main Content */}
      <div className=" h-fit mx-auto px-6 py-0 ">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-5 items-start max-w-6xl mx-auto">
          {/* Left Side - Info */}
          <div className="space-y-8 flex justify-center px-5 py-14 items-center h-auto  ">
            <div className='w-full max-w-[400px] h-auto px-4 sm:px-6 py-5'>
              <div className='px-2 sm:px-3 py-3 sm:py-5'>
                <h2 className="text-xl sm:text-lg lg:text-2xl font-semibold text-gray-600 leading-tight">
                  Create a resume you<br /> are proud of
                </h2>
              </div>
              <div className="space-y-0">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                    <Image
                      src="/locker.png"
                      alt="CV Craft Logo"
                      width={40}
                      height={20}
                      className=""
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-5 px-1 py-2 sm:py-3">
                      Save time with hassle-free templates
                    </h3>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                    <Image
                      src="/hand.png"
                      alt="CV Craft Logo"
                      width={40}
                      height={20}
                      className=""
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base text-gray-600 mb-1 px-1 py-2 sm:py-3">
                      Beat the competition using actionable, contextual advice
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                  <Image
                    src="/fire.png"
                    alt="CV Craft Logo"
                    width={30}
                    height={20}
                    className=""
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base text-gray-600 mb-1 px-1 py-2 sm:py-3">
                    Highlight key achievements with memorable visuals
                  </h3>
                </div>
              </div>
              <div className="pt-3 sm:pt-4 px-4 sm:px-6">
                <p className="text-sm sm:text-base text-gray-600">
                  Get inspired by{' '}
                  <a href="#" className="text-indigo-600 font-semibold hover:underline">
                    1800+ Free Resume Examples and Templates
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* Right Side - Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 lg:p-10">
            <h2 className="text-2xl font-medium text-gray-900 text-center mb-8">
              Create your account
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077B5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="font-medium text-gray-700">LinkedIn</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium text-gray-700">Google</span>
              </button>
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name*"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password*"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to{' '}
                    <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-indigo-600 hover:underline">Privacy policy</a>*
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailUpdates"
                    checked={formData.emailUpdates}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-600">
                    Email me tailored resume advice & updates from CVcraft
                    <div className=""></div>
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-all duration-300 whitespace-nowrap text-white font-semibold py-3 px-4 rounded-lg  mt-6 flex items-center justify-center"
              >
                {loading ? (
                  <ClipLoader size={22} color="#ffffff" />
                ) : (
                  "CREATE AN ACCOUNT"
                )}
              </button>

            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}