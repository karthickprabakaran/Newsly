import RSSParser from 'rss-parser';

const NEWS_SOURCES = [
    { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'General', type: 'rss' },
    { name: 'NDTV News', url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'General', type: 'rss' },
    { name: 'Oneindia', url: 'https://www.oneindia.com/rss/feeds/news-india-fb.xml', category: 'General', type: 'rss' },
    { name: 'ABP Live', url: 'https://news.abplive.com/news/india/feed', category: 'General', type: 'rss' },
    { name: 'BBC Tamil', url: 'https://feeds.bbci.co.uk/tamil/rss.xml', category: 'General', type: 'rss' },
    { name: 'Knowivate', url: 'https://knowivate-api.vercel.app/news/all', category: 'General', type: 'json' },
    { name: 'NewsAPI', url: 'https://saurav.tech/NewsAPI/top-headlines/category/general/in.json', category: 'General', type: 'json' },
];

const rssParser = new RSSParser();

function extractImage(item) {
  if (item['media:content']?.url) return item['media:content'].url;
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:thumbnail']?.url) return item['media:thumbnail'].url;
  if (Array.isArray(item['media:content']) && item['media:content'][0]?.url) return item['media:content'][0].url;
  if (Array.isArray(item['media:thumbnail']) && item['media:thumbnail'][0]?.url) return item['media:thumbnail'][0].url;
  if (item.content) {
    const match = item.content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1]) return match[1];
  }
  if (item.description) {
    const match = item.description.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1]) return match[1];
  }
  if (item.summary) {
    const match = item.summary.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match && match[1]) return match[1];
  }
  return '/no-image.png';
}

function extractCategory(item, fallbackCategory) {
  // For RSS: item.category can be string or array
  let category = fallbackCategory || 'General';
  if (item && item.category) {
    if (Array.isArray(item.category)) {
      category = item.category.join(', ');
    } else {
      category = item.category;
    }
  }
  if (typeof category === 'string') return category.toLowerCase();
  return 'general';
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

export async function GET(req) {
  try {
    const articles = (
      await Promise.all(
        NEWS_SOURCES.map(async source => {
          try {
            if (source.type === 'rss') {
              const feed = await rssParser.parseURL(source.url);
              return feed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.content || item.contentSnippet || "",
                source: source.name,
                category: extractCategory(item, source.category),
                imageUrl: extractImage(item),
              }));
            } else if (source.type === 'json') {
              const res = await fetch(source.url);
              const data = await res.json();
              // Normalization for Knowivate
              if (source.name === 'Knowivate') {
                return (data.news || []).map(item => ({
                  title: item.title,
                  link: item.url,
                  pubDate: item.timestamp || item.date || '',
                  content: item.content || item.description || '',
                  source: source.name,
                  category: (item.category || source.category || 'general').toLowerCase(),
                  imageUrl: item.image || item.urlToImage || '/no-image.png',
                }));
              }
              // Normalization for NewsAPI
              if (source.name === 'NewsAPI') {
                return (data.articles || []).map(item => ({
                  title: item.title,
                  link: item.url,
                  pubDate: item.publishedAt || '',
                  content: item.content || item.description || '',
                  source: source.name,
                  category: (item.category || source.category || 'general').toLowerCase(),
                  imageUrl: item.urlToImage || "/no-image.png",
                }));
              }
              return [];
            }
            return [];
          } catch {
            return [];
          }
        })
      )
    ).flat();
    const shuffled = shuffle(articles);
    // --- Pagination logic ---
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const paginated = shuffled.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(shuffled.length / limit);
    return Response.json({
      news: paginated,
      totalItems: shuffled.length,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch news." }, { status: 500 });
  }
}