import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#eaeaeb] px-6 pt-16 pb-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Newsly Info */}
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Newsly
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Newsly is your go-to platform for staying informed and exploring the India's latest news, trends, and insights. Stay up-to-date with personalized suggestions, in-depth stories, and curated categories—all in one place.
          </p>
        </div>
        {/* Categories */}
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Categories
          </h2>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>Culture</li>
            <li>Fashion</li>
            <li>Featured</li>
            <li>Food</li>
            <li>Healthy Living</li>
            <li>Technology</li>
          </ul>
        </div>
        {/* Pages */}
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Pages
          </h2>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>Home</li>
            <li>News</li>
            <li>Suggested</li>
            <li>Categories</li>
            <li>Sources</li>
          </ul>
        </div>
        {/* Follow The Dev / Social */}
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Follow The Dev
          </h2>
          <div className="flex gap-4 mt-2">
            {/* Instagram */}
            <a
              href="https://linkedin.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm shadow-md bg-blue-600 hover:bg-blue-800 hover:scale-105 transition-transform"
              target="_blank" rel="noopener noreferrer"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              className="bg-black hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm shadow-md hover:scale-105 transition-transform"
              target="_blank" rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="rounded-md bg-[#dbdbdb] px-4 py-2 text-center text-xs text-[#8f8f8f] mx-auto max-w-3xl">
          Privacy Policy | Terms & Conditions
          <span className="mx-4">|</span>
          All Copyright (C) {new Date().getFullYear()} Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;