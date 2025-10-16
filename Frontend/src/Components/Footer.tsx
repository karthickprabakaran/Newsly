import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content px-10 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
        {/* Brand Section */}
        <aside>
          <h2 className="text-3xl font-bold text-primary mb-2">Newsly</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Get to know around you instantly.
          </p>
        </aside>

        {/* Menu Section */}
        <nav className="flex flex-col sm:items-start">
          <h6 className="footer-title text-lg font-semibold mb-3">Menu</h6>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            About
          </a>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            Features
          </a>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            Contact
          </a>
        </nav>

        {/* Sources Section */}
        <nav className="flex flex-col sm:items-start">
          <h6 className="footer-title text-lg font-semibold mb-3">Sources</h6>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            About
          </a>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            Features
          </a>
          <a href="#" className="link link-hover text-gray-700 text-base mb-1">
            Contact
          </a>
        </nav>

        {/* Social Section */}
        <nav className="flex flex-col sm:items-end">
          <h6 className="footer-title text-lg font-semibold mb-3">Social</h6>
          <div className="flex gap-5 text-3xl">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:text-primary transition-all duration-300"
            >
              <BsTwitterX />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:text-primary transition-all duration-300"
            >
              <FaLinkedin />
            </a>
          </div>
        </nav>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Karthick Prabakaran. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
