"use client";

import Header from "./Header";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Transparent Header */}
      <Header transparent />
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://www.pexels.com/download/video/11494571/"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for contrast */}
      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50 z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 pt-24 md:pt-32">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Get The News At Your Convenience,
          <br className="hidden md:inline" /> from India’s Top 7 Sources
        </h1>
        <p className="text-white text-lg md:text-2xl font-normal mb-8 max-w-xl drop-shadow-md">
          Newsly brings you the latest news, trends, and insights in one place —
          curated, categorized, and easy to search. Start your journey to stay
          informed now!
        </p>
        <button className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg">
          Get Started
        </button>
      </div>
    </div>
  );
}

