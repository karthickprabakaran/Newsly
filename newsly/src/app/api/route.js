import RSSParser from "rss-parser";

const NEWS_SOURCES = [
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    category: "General",
  },
  {
    name: "NDTV News",
    url: "https://feeds.feedburner.com/ndtvnews-latest",
    category: "General",
  },
  {
    name: "The Hindu",
    url: "https://www.thehindu.com/news/feeder/default.rss",
    category: "General",
  },
  {
    name: "Indian Express",
    url: "https://indianexpress.com/feed/",
    category: "General",
  },
  {
    name: "Economic Times",
    url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
    category: "General",
  },
  {
    name: "BBC Tamil",
    url: "https://feeds.bbci.co.uk/tamil/rss.xml",
    category: "General",
  },
];

const rssParser = new RSSParser();

export async function GET() {
  try {
    const articles = (
      await Promise.all(
        NEWS_SOURCES.map(async (source) => {
          try {
            const feed = await rssParser.parseURL(source.url);
            return feed.items.map((item) => ({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              content: item.content || item.contentSnippet || "",
              source: source.name,
              category: source.category,
            }));
          } catch {
            return [];
          }
        }),
      )
    ).flat();

    return Response.json({ articles });
  } catch (e) {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
