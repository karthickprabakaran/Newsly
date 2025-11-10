import React from "react";

export default function NewsCard({ imageUrl, title, content, author, pubDate, link, category }) {
  return (
    <div className="rounded-lg shadow bg-white overflow-hidden flex flex-col">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-black text-md mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{content}</p>
        <div className="flex items-center mt-auto pt-2">
          <div className="flex items-center mr-2">
            {/* Placeholder avatar icon */}
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-black text-xl font-bold uppercase">
              {author ? author.charAt(0) : "?"}
            </div>
            <div>
              <div className="text-sm text-black font-semibold">{author}</div>
              <div className="text-xs text-gray-500">{pubDate && new Date(pubDate).toLocaleDateString()}</div>
            </div>
          </div>
          <button className="ml-auto px-1 py-1 text-gray-500" title="Bookmark this article">
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75v15.19a1 1 0 0 1-1.566.824l-4.003-2.573a.25.25 0 0 0-.265 0l-4.004 2.573A1 1 0 0 1 6 19.94V4.75Z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
