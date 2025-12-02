"use client";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../../../util/supabase";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Signup successful! Check your email to confirm your account.");
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };
  const handleAppleSignUp = async () => {
    setMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  return (
    <div className="flex justify-center bg-background py-16">
      <div className="flex w-full max-w-4xl items-stretch shadow-lg rounded-xl overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="flex-1 bg-surface text-text-primary flex flex-col justify-center px-10 md:px-20">
          <div className="max-w-md w-full mx-auto">
            {/* Form Header */}
            <h2 className="text-2xl font-bold mb-4 text-center text-text-primary">Get Started</h2>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block mb-1 text-sm font-medium text-text-primary">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input w-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-text-primary">Email address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-text-primary">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full py-2"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </form>
            {/* Message display */}
            {message && (
              <div className="mt-2 text-center text-error">{message}</div>
            )}

            {/* Already a user link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-text-secondary">Already a user? </span>
              <a
                href="/login"
                className="text-primary text-sm underline hover:text-primary-dark"
              >
                Login here
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
                onClick={handleGoogleSignUp}
                className="btn-secondary flex-1 flex items-center justify-center py-2"
              >
                <FaGoogle className="mr-2" /> Google
              </button>
              <button
                type="button"
                onClick={handleAppleSignUp}
                className="btn-secondary flex-1 flex items-center justify-center py-2"
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

export default SignUpPage;
