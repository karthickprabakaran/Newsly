import { FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-default px-8 py-8 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Newsly</h3>
          <p className="text-text-secondary text-sm text-center md:text-left">
            Your trusted news source
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/news" className="text-text-secondary hover:text-primary transition-colors">
            News
          </Link>
          <Link href="/suggestednews" className="text-text-secondary hover:text-primary transition-colors">
            Suggested
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="text-text-secondary hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-text-secondary hover:text-primary transition-colors">
            Terms
          </Link>
        </nav>

        {/* Social */}
        <div className="flex gap-4">
          <a
            href="https://twitter.com/newsly"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <FaTwitter className="text-lg" />
          </a>
          <a
            href="https://linkedin.com/company/newsly"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <FaLinkedin className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

