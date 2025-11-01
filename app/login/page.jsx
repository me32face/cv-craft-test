'use client';

import React, { useState } from 'react';
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up attempt:', formData);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Sign in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-5 items-center">

            {/* Left Section - Features */}
            <div className="space-y-8 flex justify-center px-5 py-14 items-center h-auto">
              <div className='w-full max-w-[400px] h-auto px-6 py-5'>
                <div className='px-3 py-5'>
                  <h2 className="text-lg lg:text-2xl font-semibold text-gray-600 leading-tight">
                    Create a resume you<br /> are proud of
                  </h2>
                </div>
                <div className="space-y-0">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                      <Image
                        src="/locker.png"
                        alt="Save time icon"
                        width={40}
                        height={40}
                        className=""
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-gray-600 mb-5 px-1 py-3">Save time with hassle-free templates</h3>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                      <Image
                        src="/hand.png"
                        alt="Competition icon"
                        width={40}
                        height={40}
                        className=""
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-gray-600 mb-1 px-1 py-3">Beat the competition using actionable, contextual advice</h3>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                      <Image
                        src="/fire.png"
                        alt="Achievement icon"
                        width={40}
                        height={40}
                        className=""
                      />
                    </div>
                    <div>
                      <h3 className="text-base text-gray-600 mb-1 px-1 py-3">Highlight key achievements with memorable visuals</h3>
                    </div>
                  </div>
                </div>
                <div className="pt-4 px-6">
                  <p className="text-gray-600">Get inspired by{' '}
                    <a href="#" className="text-indigo-600 font-semibold hover:underline">
                      1800+ Free Resume Examples and Templates
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Sign Up Card */}
            <div className="bg-white w-full max-w-[500px] rounded-lg shadow-sm p-8 lg:p-10">
              <h2 className="text-2xl font-medium text-gray-900 text-center mb-8">
Sign in your account
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button 
                  onClick={() => handleSocialLogin('LinkedIn')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Image
                        src="/LinkedinLogo.jpeg"
                        alt="Achievement icon"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />

                  <span className="font-medium text-gray-700">LinkedIn</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Image
                        src="/Googlelogo.jpeg"
                        alt="Achievement icon"
                        width={40}
                        height={40}
                        className=" rounded-lg"
                      />
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Image
                        src="/FacebookLogo.jpeg"
                        alt="Achievement icon"
                        width={40}
                        height={40}
                        className=""
                      />
                  <span className="font-medium text-gray-700">Facebook</span>
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
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password*"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6  rounded-lg transition mt-8"
                >
                  LOGIN  ACCOUNT
                </button>
              </div>

              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}