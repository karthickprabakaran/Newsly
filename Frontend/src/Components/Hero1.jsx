import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-white min-h-screen flex items-center justify-center px-6 md:px-20 overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://www.pexels.com/download/video/11494572/"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 opacity-60"></div>

      {/* Content */}
      <div className="relative text-center max-w-3xl space-y-6 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          The World is Moving Fast, Why not Catch Up ?
        </h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Stay ahead of the world with the latest headlines from seven trusted
          sources—updated instantly so you never miss a story that matters.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium">
            Get started
          </button>
          <button className="px-6 py-3 border border-gray-400 text-gray-200 rounded-md hover:border-purple-500 hover:text-purple-500 transition-colors font-medium">
            Learn more →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
