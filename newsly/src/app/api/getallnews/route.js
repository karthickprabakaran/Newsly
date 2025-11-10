import RSSParser from 'rss-parser';

const NEWS_SOURCES = [
    { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'NDTV News', url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'General' },
    { name: 'The Hindu', url: 'https://www.thehindu.com/news/feeder/default.rss', category: 'General' },
    { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'General' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'BBC Tamil', url: 'https://feeds.bbci.co.uk/tamil/rss.xml', category: 'General' },
];

const rssParser = new RSSParser();

function extractImage(item) {
  // Try media:content.url
  if (item['media:content']?.url) return item['media:content'].url;
  // Try enclosure.url
  if (item.enclosure?.url) return item.enclosure.url;
  // Try media:thumbnail.url
  if (item['media:thumbnail']?.url) return item['media:thumbnail'].url;
  // Array variants (sometimes media:content or media:thumbnail is array)
  if (Array.isArray(item['media:content']) && item['media:content'][0]?.url) return item['media:content'][0].url;
  if (Array.isArray(item['media:thumbnail']) && item['media:thumbnail'][0]?.url) return item['media:thumbnail'][0].url;
  // Try extract from HTML in content
  if (item.content) {
    const match = item.content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1]) return match[1];
  }
  // Not found
  return null;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export async function GET() {
  try {
    const articles = (
      await Promise.all(
        NEWS_SOURCES.map(async source => {
          try {
            const feed = await rssParser.parseURL(source.url);
            return feed.items.map(item => ({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              content: item.content || item.contentSnippet || "",
              source: source.name,
              category: source.category,
              imageUrl: extractImage(item),
            }));
          } catch {
            return [];
          }
        })
      )
    ).flat();
    const shuffled = shuffle(articles);
    return Response.json({ news: shuffled });
  } catch (error) {
    return Response.json({ error: "Failed to fetch news." }, { status: 500 });
  }
}