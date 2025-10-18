import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Login Form */}
      <div className="flex-1 bg-white text-gray-900 flex flex-col justify-center px-10 md:px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-3xl font-bold text-purple-600">YourLogo</div>
          </div>

          {/* Form Header */}
          <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-gray-600 mb-6">
            Not a member?{" "}
            <a href="#" className="text-purple-600 underline">
              Start a 14 day free trial
            </a>
          </p>

          {/* Login Form */}
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Email address</label>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-purple-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-purple-600 underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Sign in
            </button>
          </form>

          {/* OR separator */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-4 text-gray-500">Or continue with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
              <FaGithub className="mr-2" /> GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Video */}
      <div className="flex-1 hidden md:block bg-white">
        <video
          src="https://www.pexels.com/download/video/7262671/" // <-- Add video to public/videos folder
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default LoginPage;
