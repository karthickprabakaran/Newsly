import React from "react";

const AboutSection = () => {
  return (
    <section className="w-full py-16">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-text-primary">About Newsly</h2>

      {/* Card Container */}
      <div className="mx-auto max-w-6xl bg-surface rounded-2xl shadow-sm p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Description */}
          <div className="text-text-primary leading-relaxed space-y-4">
            <p>
              Newsly is your go-to platform for staying informed with the latest
              headlines from India’s top 7 trusted sources. Browse curated
              categories, search instantly, and get personalized suggestions—all
              in one place.
            </p>
            <p>
              Our mission is to make news consumption fast, sleek, and
              distraction-free. Enjoy seamless pagination, lazy loading for fast
              performance, and a clean reading experience across devices.
            </p>
            <p>
              Join us to stay ahead of trends, explore diverse perspectives, and
              never miss what matters most.
            </p>
          </div>

          {/* Right: Media with Play Button */}
          <div className="relative overflow-hidden rounded-xl">
            <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-primary via-secondary to-black">
              {/* Optional preview image could be placed here instead of gradient */}
            </div>
            {/* Play button overlay */}
            <button
              aria-label="Play video"
              className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition hover:scale-105"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;