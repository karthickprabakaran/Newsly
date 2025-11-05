import { FaChevronDown, FaSearch, FaRegBookmark } from "react-icons/fa";
import React from 'react';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  return (
    <header className={`w-full ${transparent ? 'bg-transparent shadow-none' : 'bg-white shadow-sm'} px-8 transition-colors duration-300`}>
      <div className="max-w-[1440px] mx-auto flex items-center h-16 justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <span className="text-orange-600 font-bold text-xl">Newsly</span>
          <nav className="hidden md:flex gap-6 text-gray-800 text-[16px]">
            <div className="relative group cursor-pointer flex items-center gap-1 font-medium">
              Categories <FaChevronDown className="text-xs" />
            </div>
            <a className="hover:text-orange-600 transition font-medium cursor-pointer">News</a>
            <a className="hover:text-orange-600 transition font-medium cursor-pointer">Suggested</a>
            <a className="hover:text-orange-600 transition font-medium cursor-pointer">Contact Newsly</a>
          </nav>
        </div>
        {/* Center: Fills whitespace (optional for future features) */}
        <div className="flex-1" />
        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search box */}
          <div className="bg-gray-100 flex items-center rounded-xl px-4 py-1 w-[220px] max-w-xs">
            <input
              type="text"
              placeholder="Search Anything"
              className="bg-gray-100 outline-none flex-1 text-sm py-1"
            />
            <FaSearch className="text-xl text-gray-700 ml-2" />
          </div>
          {/* User card */}
          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-xl">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="avatar"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm font-medium text-gray-900 px-1">Behzad</span>
            <FaChevronDown className="text-xs text-gray-700" />
          </div>
          {/* Bookmark icon */}
          <div className="bg-gray-100 p-2 rounded-xl flex items-center cursor-pointer">
            <FaRegBookmark className="text-xl text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
