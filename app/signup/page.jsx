"use client";
import React, { useState } from 'react';
import Image from "next/image";
import axios from "axios";
import Toast from '@/components/Toast.jsx';
import ClipLoader from "react-spinners/ClipLoader";
import { GoogleLogin } from '@react-oauth/google';


export default function Signup() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ;
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
      const res = await axios.post(`${API_URL}/api/register`, {
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
          document.cookie = `token=${data.token}; path=/; max-age=86400`;
        }

        // Redirect to home
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
          src="/cvlogo.png"
          alt="CV Craft Logo"
          width={100}
          height={50}
          unoptimized
          className="object-contain sm:w-[75px] sm:h-[37px] lg:w-[120px] lg:h-[40px]"
        />
        {/* <span className="text-2xl font-semibold text-gray-800">CRAFT</span> */}
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
                      unoptimized
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
                      unoptimized
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
                    unoptimized
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
            <h2 className="text-2xl font-medium text-gray-900 text-center mb-4">
              Create your account
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
              <div className="flex justify-center w-full">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      setLoading(true);

                      axios.post(`${API_URL}/api/auth/google`, {
                        token: credentialResponse.credential,
                      })
                        .then((res) => {
                          setLoading(false);
                          const data = res.data;

                          if (data.token) {
                            localStorage.setItem("token", data.token);
                            document.cookie = `token=${data.token}; path=/; max-age=86400`;
                            setToastMessage("Logged in with Google!");
                            setShowToast(true);
                            window.location.href = "/";
                          } else {
                            setToastMessage(data.message || "Google login failed");
                            setShowToast(true);
                          }
                        })
                        .catch((error) => {
                          setLoading(false);
                          console.error("Google login error:", error);
                          setToastMessage(
                            error.response?.data?.message || "Something went wrong with Google login"
                          );
                          setShowToast(true);
                        });
                    }}
                    onError={() => {
                      setToastMessage("Google login failed. Try again.");
                      setShowToast(true);
                    }}
                    useOneTap
                    width="100%"
                  />

                </div>
              </div>
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
                  onKeyDown={(e)=>{
                     if (/[0-9]/.test(e.key)) {
                    e.preventDefault(); 
                   }
                  }}
                  className={`w-full px-2 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'
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

            <div className="text-center mt-6">
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-indigo-600 font-semibold hover:underline">
                  login
                </a>
              </p>

            </div>


          </div>
        </div>
      </div>
      {
        showToast && (
          <Toast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )
      }
    </div >
  );
}