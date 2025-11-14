import React from "react";

function formatCategory(category) {
  if (!category) return "General";
  const first = category.split(",").map(part => part.trim()).filter(Boolean)[0] || "General";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export default function StandardNewsCard({ imageUrl, title, content, author, pubDate, link, category }) {
  const displayCategory = formatCategory(category);

  return (
    <div className="card group cursor-pointer">
      <a href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col p-4">
          <span className="category-tag inline-flex items-center self-start mb-3">
            {displayCategory}
          </span>
          
          <h3 className="text-text-primary font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          <p className="text-text-primary text-sm line-clamp-3 mb-4 flex-1">
            {content}
          </p>
          
          <div className="flex items-center mt-auto pt-2 border-t border-default">
            <div className="flex items-center mr-3">
              <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text-secondary text-xl font-bold uppercase">
                {author ? author.charAt(0) : "?"}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{author}</div>
                <div className="text-xs text-text-secondary">{pubDate}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}