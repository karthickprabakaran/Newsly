import React from "react";

export default function SimpleNewsCard({ title, content, author, pubDate, link, category, imageUrl }) {
  return (
    <div className="rounded-lg shadow bg-gray-50 overflow-hidden flex flex-col min-h-[375px] cursor-pointer">
      <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col h-full">
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-black text-md mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-700 line-clamp-10">{content}</p>
          <div className="flex items-center mt-auto pt-2">
            <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center mr-2 text-gray-600 text-xl font-bold uppercase">
              {author ? author.charAt(0) : "?"}
            </div>
            <div>
              <div className="text-sm text-black font-semibold">{author}</div>
              <div className="text-xs text-gray-500">{pubDate && new Date(pubDate).toLocaleDateString()}</div>
            </div>
            <div className="ml-auto">
              {/* Bookmark icon (display only) */}
              <button title="Bookmark this article" className="text-gray-400 hover:text-blue-600 p-1 focus:outline-none">
                <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75v15.19a1 1 0 0 1-1.566.824l-4.003-2.573a.25.25 0 0 0-.265 0l-4.004 2.573A1 1 0 0 1 6 19.94V4.75Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
