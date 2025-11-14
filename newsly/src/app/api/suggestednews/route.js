import { XMLParser } from 'fast-xml-parser';

const NEWS_SOURCES = [
    { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'NDTV News', url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'General' },
    { name: 'The Hindu', url: 'https://www.thehindu.com/news/feeder/default.rss', category: 'General' },
    { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'General' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', category: 'General' },
    { name: 'BBC Tamil', url: 'https://feeds.bbci.co.uk/tamil/rss.xml', category: 'General' },
];

// Category-specific news sources (you can add more sources for specific categories)
const CATEGORY_SPECIFIC_SOURCES = {
    'sports': [
        { name: 'ESPN Cricinfo', url: 'https://www.espncricinfo.com/rss/content/story/feeds/rss.xml', category: 'sports' },
        { name: 'Sportskeeda', url: 'https://www.sportskeeda.com/rss.xml', category: 'sports' },
    ],
    'economics': [
        { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', category: 'economics' },
        { name: 'Business Standard', url: 'https://www.business-standard.com/rss/economy-policy-107.rss', category: 'economics' },
    ],
    'finance': [
        { name: 'Moneycontrol', url: 'https://www.moneycontrol.com/rss/marketreports.xml', category: 'finance' },
        { name: 'Financial Express', url: 'https://www.financialexpress.com/market/rss.xml', category: 'finance' },
    ],
    'technology': [
        { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology' },
        { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology' },
    ],
    'politics': [
        { name: 'The Hindu Politics', url: 'https://www.thehindu.com/elections/politics/rssfeed.xml', category: 'politics' },
        { name: 'NDTV Politics', url: 'https://feeds.feedburner.com/ndtvnews-politics', category: 'politics' },
    ],
    'international': [
        { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'international' },
        { name: 'CNN World', url: 'http://rss.cnn.com/rss/edition_world.rss', category: 'international' },
    ],
    'health': [
        { name: 'Health.com', url: 'https://www.health.com/rss/news.xml', category: 'health' },
        { name: 'Medical News Today', url: 'https://www.medicalnewstoday.com/rss/medicalnews.xml', category: 'health' },
    ],
    'entertainment': [
        { name: 'Bollywood Hungama', url: 'https://www.bollywoodhungama.com/rss/bollywood-news.xml', category: 'entertainment' },
        { name: 'IMDb News', url: 'https://www.imdb.com/news/top', category: 'entertainment' },
    ],
    'education': [
        { name: 'Education Times', url: 'https://educationtimes.in/feed/', category: 'education' },
        { name: 'India Education', url: 'https://www.indiaeducation.net/rss.xml', category: 'education' },
    ],
    'business': [
        { name: 'Business Today', url: 'https://www.businesstoday.in/rssfeeds/category/126.rss', category: 'business' },
        { name: 'Inc42', url: 'https://inc42.com/feed/', category: 'business' },
    ],
    'science': [
        { name: 'Science Daily', url: 'https://www.sciencedaily.com/rss/all.xml', category: 'science' },
        { name: 'NASA News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', category: 'science' },
    ],
    'weather': [
        { name: 'IMD Weather', url: 'https://mausam.imd.gov.in/imd_latest/contents/rss.xml', category: 'weather' },
        { name: 'Weather.com', url: 'https://weather.com/rss/international.rss', category: 'weather' },
    ],
    'lifestyle': [
        { name: 'Times Lifestyle', url: 'https://timesofindia.indiatimes.com/life-style/rssfeedstopstories.cms', category: 'lifestyle' },
        { name: 'Vogue India', url: 'https://www.vogue.in/feed/', category: 'lifestyle' },
    ],
    'travel': [
        { name: 'Travel + Leisure', url: 'https://www.travelandleisureindia.in/feed/', category: 'travel' },
        { name: 'Outlook Traveller', url: 'https://www.outlooktraveller.com/rss', category: 'travel' },
    ],
    'state': [
        { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/india/rssfeed.xml', category: 'state' },
        { name: 'The Indian Express', url: 'https://indianexpress.com/section/india/feed/', category: 'state' },
    ],
    'gold': [
        { name: 'Gold Price', url: 'https://www.goldprice.org/rss/gold-price-rss.xml', category: 'gold' },
        { name: 'Moneycontrol Gold', url: 'https://www.moneycontrol.com/rss/commodities/gold.xml', category: 'gold' },
    ]
};

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
    const { searchParams } = new URL(req.url);
    const categories = searchParams.get('categories');
    
    if (!categories) {
      return Response.json({ error: 'Categories parameter is required' }, { status: 400 });
    }

    const categoryArray = categories.split(',').map(cat => cat.trim().toLowerCase()).filter(Boolean);
    console.log('Fetching news for categories:', categoryArray);

    let sourcesToUse = [];
    
    // Add category-specific sources first
    categoryArray.forEach(category => {
      if (CATEGORY_SPECIFIC_SOURCES[category]) {
        sourcesToUse = [...sourcesToUse, ...CATEGORY_SPECIFIC_SOURCES[category]];
      }
    });

    // Add general sources as fallback
    sourcesToUse = [...sourcesToUse, ...NEWS_SOURCES];

    // Remove duplicates
    const uniqueSources = sourcesToUse.filter((source, index, self) =>
      index === self.findIndex((s) => s.name === source.name)
    );

    console.log('Using sources:', uniqueSources.map(s => s.name));

    const articles = (
      await Promise.all(
        uniqueSources.map(async (source) => {
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
    ).flat();

    shuffle(articles);

    // Filter articles by requested categories
    const filteredArticles = articles.filter(article => {
      const articleCategory = article.category?.toLowerCase();
      return categoryArray.some(cat => 
        articleCategory === cat || 
        (articleCategory && articleCategory.includes(cat))
      );
    });

    const { searchParams: urlParams } = new URL(req.url);
    const page = parseInt(urlParams.get('page') || '1');
    const limit = parseInt(urlParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const paginated = filteredArticles.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredArticles.length / limit) || 1;

    return Response.json({
      news: paginated,
      totalItems: filteredArticles.length,
      currentPage: page,
      totalPages,
      categories: categoryArray,
      sourcesUsed: uniqueSources.map(s => s.name)
    });
  } catch (error) {
    console.error('Failed to fetch category-specific news:', error);
    return Response.json({ error: 'Failed to fetch news.' }, { status: 500 });
  }
}