import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
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

const typeDefs = `#graphql
  type NewsArticle {
    title: String
    link: String
    pubDate: String
    content: String
    source: String
    category: String
  }

  type Query {
    allNews: [NewsArticle]
  }
`;

const rssParser = new RSSParser();

const resolvers = {
  Query: {
    allNews: async () => {
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
      return articles;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
export const POST = startServerAndCreateNextHandler(server);
