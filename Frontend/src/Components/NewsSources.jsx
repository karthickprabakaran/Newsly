import React from "react";

const SOURCES = [
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    category: "",
    logo: "https://timesofindia.indiatimes.com/favicon.ico",
  },
  {
    name: "NDTV News",
    url: "https://feeds.feedburner.com/ndtvnews-latest",
    category: "",
    logo: "https://www.ndtv.com/favicon.ico",
  },
  {
    name: "The Hindu",
    url: "https://www.thehindu.com/news/feeder/default.rss",
    category: "",
    logo: "https://www.thehindu.com/favicon.ico",
  },
  {
    name: "Indian Express",
    url: "https://indianexpress.com/feed/",
    category: "",
    logo: "https://indianexpress.com/wp-content/themes/indianexpress/images/favicon.ico",
  },
  {
    name: "Economic Times",
    url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
    category: "",
    logo: "https://economictimes.indiatimes.com/icons/etfavicon.ico",
  },
  {
    name: "BBC Tamil",
    url: "https://feeds.bbci.co.uk/tamil/rss.xml",
    category: "",
    logo: "https://www.bbc.com/favicon.ico",
  },
];

const DotLabel = ({ children }) => (
  <div className="flex items-center gap-2 text-gray-800">
    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
    <span className="text-[18px] font-medium">{children}</span>
  </div>
);

const SourceCard = ({ name, logo, category, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)] transition p-6 text-center"
  >
    <div className="mx-auto mb-4 h-28 w-28 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
      {/* logo */}
      <img src={logo} alt={`${name} logo`} className="h-14 w-14 object-contain" />
    </div>
    <div className="text-sm text-gray-500 mb-6">{category}</div>
    <div className="mx-auto inline-block rounded-xl bg-gray-100 px-5 py-3 text-gray-800 text-sm font-medium group-hover:bg-gray-200">
      {name}
    </div>
  </a>
);

const NewsSources = () => {
  return (
    <section className="w-full py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading Row */}
        
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-10">News Sources</h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {SOURCES.map((s) => (
            <SourceCard key={s.name} {...s} />
          ))}
        </div>

        {/* CTA (optional minimal) */}
        <div className="flex justify-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 text-sm font-medium shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSources;
