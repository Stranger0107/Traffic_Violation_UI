import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  source: { name: string };
  publishedAt: string;
}

const FALLBACK_NEWS: NewsArticle[] = [
  {
    title: "New Traffic Penalties Implemented Across Major Indian Cities",
    description: "Authorities have announced stricter penalties for helmetless driving and overspeeding effective from next month to curb rising accidents.",
    url: "#",
    image: "https://images.unsplash.com/photo-1517524285303-d6fc683cbdf7?auto=format&fit=crop&w=600&q=80",
    source: { name: "India Traffic Daily" },
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Road Safety Awareness Campaign Launched in Delhi",
    description: "A week-long campaign targeting young drivers emphasizes the importance of seatbelts and the dangers of distracted driving.",
    url: "#",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80",
    source: { name: "Metro News" },
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    title: "AI Cameras Reduce Traffic Violations by 40%",
    description: "Implementation of AI-powered smart cameras at busy intersections has successfully deterred signal jumping and wrong-way driving.",
    url: "#",
    image: "https://images.unsplash.com/photo-1566375638423-f222db2e0573?auto=format&fit=crop&w=600&q=80",
    source: { name: "Tech & Roads" },
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

export function RoadSafetyNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For demonstration, we attempt to use GNews API. 
      // If you have a key, add it to your .env as VITE_GNEWS_API_KEY
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
      
      if (!apiKey) {
        console.warn('No GNews API key found, using fallback data.');
        setTimeout(() => {
          setNews(FALLBACK_NEWS);
          setIsLoading(false);
        }, 800);
        return;
      }

      const query = encodeURIComponent('India road safety OR traffic accidents OR helmet rules');
      const response = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&max=5&apikey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('API limit reached or network error');
      }

      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles);
      } else {
        setNews(FALLBACK_NEWS);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load live news. Showing latest available updates.');
      setNews(FALLBACK_NEWS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Latest Updates</h2>
        </div>
        <button 
          onClick={fetchNews}
          className="p-2 bg-muted text-muted-foreground hover:text-primary rounded-full transition-colors"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-sm text-amber-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {isLoading && news.length === 0 ? (
          // Skeleton loading state
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="h-40 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : (
          news.map((article, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-primary px-2 py-1 bg-blue-50 rounded-full">
                    {article.source.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-700"
                >
                  Read full story <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
