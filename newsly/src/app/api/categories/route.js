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

function parseRss(xmlText, source) {
  try {
    const parsed = xmlParser.parse(xmlText);
    const items = parsed?.rss?.channel?.item;
    if (!items) return [];
    const array = Array.isArray(items) ? items : [items];

    return array.map((item) => ({
      category: normaliseCategory(item.category, source.category),
    }));
  } catch (error) {
    console.error(`Failed to parse RSS for ${source.name}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const allCategories = (
      await Promise.all(
        NEWS_SOURCES.map(async (source) => {
          try {
            const response = await fetch(source.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/rss+xml, application/xml;q=0.9,*/*;q=0.8',
              },
            });
            if (!response.ok) throw new Error('Failed to fetch RSS');
            const xmlText = await response.text();
            return parseRss(xmlText, source);
          } catch (error) {
            console.error(`Error fetching ${source.name}:`, error);
            return [];
          }
        })
      )
    )
      .flat()
      .map((item) => item.category)
      .filter(Boolean)
      .flatMap((cat) => cat.split(',').map((c) => c.trim().toLowerCase()))
      .filter(Boolean);

    const uniqueCategories = Array.from(new Set(allCategories)).sort();

    return Response.json({ categories: uniqueCategories });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return Response.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

