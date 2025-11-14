"use client";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../util/supabase";

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
    const { error } = await supabase.auth.signInWithPassword({
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
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };
  
  const handleAppleLogin = async () => {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center py-16">
      <div className="flex w-full max-w-4xl items-stretch shadow-lg rounded-xl overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="flex-1 bg-surface text-text-primary flex flex-col justify-center px-10 md:px-20">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <h2 className="text-2xl text-center font-bold mb-8">
              Sign in to your account
            </h2>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block mb-2 text-sm font-medium text-text-primary">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="input w-full"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-text-primary">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm text-text-secondary">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-primary" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-primary-dark">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            
            {/* Message display */}
            {message && (
              <div className="mt-2 text-center text-error">
                {message}
              </div>
            )}

            {/* New to the app link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-text-secondary">New to the app? </span>
              <a href="/signup" className="text-primary hover:text-primary-dark text-sm underline">
                Sign up here
              </a>
            </div>

            {/* OR separator */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-default"></div>
              <span className="px-4 text-text-secondary">Or continue with</span>
              <div className="flex-1 border-t border-default"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="btn-secondary flex-1 flex items-center justify-center py-2"
                disabled={loading}
              >
                <FaGoogle className="mr-2" /> Google
              </button>
              <button 
                type="button" 
                onClick={handleAppleLogin} 
                className="btn-secondary flex-1 flex items-center justify-center py-2"
                disabled={loading}
              >
                <FaApple className="mr-2" /> Apple
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side: Video */}
        <div className="flex-1 hidden md:flex items-center justify-center bg-surface rounded-xl">
          <video
            src="https://www.pexels.com/download/video/7262671/"
            autoPlay
            loop
            muted
            className="w-full object-cover rounded-xl"
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