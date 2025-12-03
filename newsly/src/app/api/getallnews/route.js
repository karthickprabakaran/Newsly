import { XMLParser } from 'fast-xml-parser';

const NEWS_SOURCES = [
    { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'NDTV News', url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'General' },
    { name: 'The Hindu', url: 'https://www.thehindu.com/news/feeder/default.rss', category: 'General' },
    { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'General' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'BBC Tamil', url: 'https://feeds.bbci.co.uk/tamil/rss.xml', category: 'General' },
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  cdataTagName: '__cdata',
  parseAttributeValue: true,
  trimValues: true,
  arrayMode: false,
});

function normaliseCategory(rawCategory, fallback = 'general') {
  const toLower = (value) => (value ? value.toLowerCase().trim() : null);

  if (!rawCategory) return fallback.toLowerCase();

  if (Array.isArray(rawCategory)) {
    const distinct = Array.from(
      new Set(
        rawCategory
          .map((entry) => normaliseCategory(entry, fallback))
          .filter(Boolean)
          .flatMap((cat) => cat.split(',').map((part) => part.trim()).filter(Boolean))
      )
    );
    return distinct.length ? distinct.join(', ') : fallback.toLowerCase();
  }

  if (typeof rawCategory === 'object') {
    return (
      normaliseCategory(rawCategory['#text'], fallback) ||
      normaliseCategory(rawCategory['__cdata'], fallback) ||
      normaliseCategory(rawCategory['@_label'], fallback) ||
      normaliseCategory(rawCategory['@_term'], fallback) ||
      normaliseCategory(rawCategory.value, fallback) ||
      fallback.toLowerCase()
    );
  }

  if (typeof rawCategory === 'string') {
    const cleaned = toLower(rawCategory);
    return cleaned || fallback.toLowerCase();
  }

  return fallback.toLowerCase();
}

function extractImage(item) {
  const extractUrl = (entry) => {
    if (!entry) return null;
    if (Array.isArray(entry)) {
      for (const value of entry) {
        const url = extractUrl(value);
        if (url) return url;
      }
      return null;
    }
    if (typeof entry === 'string') {
      return entry.startsWith('http') ? entry : null;
    }
    return (
      entry['@_url'] ||
      entry.url ||
      entry.link ||
      (entry['#text'] && entry['#text'].startsWith('http') ? entry['#text'] : null)
    );
  };

  return (
    extractUrl(item['media:thumbnail']) ||
    extractUrl(item['media:content']) ||
    extractUrl(item.enclosure) ||
    extractImageFromHtml(item.description || item['content:encoded']) ||
    '/no-image.png'
  );
}

function extractImageFromHtml(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return match ? match[1] : null;
}

function parseRss(xmlText, source) {
  try {
    const parsed = xmlParser.parse(xmlText);
    const items = parsed?.rss?.channel?.item;
    if (!items) return [];
    const array = Array.isArray(items) ? items : [items];

    return array.map((item, index) => ({
      id: `${source.name}-${index}`,
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      content: item.description || item['content:encoded'] || '',
      source: source.name,
      category: normaliseCategory(item.category, source.category),
      imageUrl: extractImage(item),
    }));
  } catch (error) {
    console.error(`Failed to parse RSS for ${source.name}:`, error);
    return [];
  }
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export async function GET(req) {
  try {
    const articles = (
      await Promise.all(
        NEWS_SOURCES.map(async (source) => {
          try {
            const response = await fetch(source.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/rss+xml, application/xml;q=0.9,*/*;q=0.8',
              },
              signal: AbortSignal.timeout(10000), // 10 second timeout
            });
            if (!response.ok) throw new Error('Failed to fetch RSS');
            const xmlText = await response.text();
            return parseRss(xmlText, source);
          } catch (error) {
            console.error(`Error fetching ${source.name}:`, error.message);
            return [];
          }
        })
      )
    ).flat();

    shuffle(articles);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const paginated = articles.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(articles.length / limit) || 1;

    return Response.json({
      news: paginated,
      totalItems: articles.length,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return Response.json({ error: 'Failed to fetch news.' }, { status: 500 });
  }
}