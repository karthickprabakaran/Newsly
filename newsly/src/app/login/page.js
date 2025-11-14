"use client";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../util/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      router.push("/news");
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage(error.message);
    setLoading(false);
  };
  const handleAppleLogin = async () => {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  return (
    <div className="flex justify-center bg-gray-50 py-16">
      <div className="flex w-full max-w-4xl items-stretch shadow-lg rounded-[5px] overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="flex-1 bg-white text-gray-900 flex flex-col justify-center px-10 md:px-20">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <h2 className="text-2xl text-center font-bold mb-8">
              Sign in to your account
            </h2>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block mb-1 text-sm">Email address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            {/* Message display */}
            {message && <div className="mt-2 text-center text-red-600">{message}</div>}

            {/* New to the app link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-700">New to the app? </span>
              <a href="/signup" className="text-purple-600 text-sm underline hover:text-purple-700">Sign up here</a>
            </div>

            {/* OR separator */}
            <div className="flex items-center my-6">
              <hr className="flex-1 border-gray-300" />
              <span className="px-4 text-gray-500">Or continue with</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button type="button" onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                <FaGoogle className="mr-2" /> Google
              </button>
              <button type="button" onClick={handleAppleLogin} className="flex-1 flex items-center justify-center py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                <FaApple className="mr-2" /> Apple
              </button>
            </div>
          </div>
        </div>
        {/* Right Side: Video */}
        <div className="flex-1 hidden md:flex items-center justify-center bg-white rounded-[5px] ">
          <video
            src="https://www.pexels.com/download/video/7262671/"
            autoPlay
            loop
            muted
            className="w-full object-cover rounded-[5px]"
            style={{ height: "100%" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
