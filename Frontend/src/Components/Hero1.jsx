import React from "react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen flex items-center justify-center px-6 md:px-20">
      <div className="text-center max-w-3xl space-y-6">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold">
          The World is Moving Fast, Why not Catch Up ?
        </h1>

        {/* Paragraph */}
        <p className="text-gray-300 text-lg md:text-xl">
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
        </p>

        {/* Buttons */}
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
