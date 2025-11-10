import React from "react";

export default function StandardNewsCard({ imageUrl, title, content, author, pubDate, link, category }) {
  return (
    <div className="rounded-lg shadow bg-white overflow-hidden flex flex-col min-h-[375px]">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="h-40 w-full object-cover flex-shrink-0" style={{ minHeight: "160px" }} />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-black text-md mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{content}</p>
        <div className="flex items-center mt-auto pt-2">
          <div className="flex items-center mr-2">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-600 text-xl font-bold uppercase">
              {author ? author.charAt(0) : "?"}
            </div>
            <div>
              <div className="text-sm text-black font-semibold">{author}</div>
              <div className="text-xs text-gray-500">{pubDate && new Date(pubDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
