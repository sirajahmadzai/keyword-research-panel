import { useState, useEffect } from 'react';

type Keyword = {
  term: string;
  volume: number;
  difficulty: number;
};

// RapidAPI Keyword Research API configuration
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'ahrefs-dr-rank-checker.p.rapidapi.com';
const RAPIDAPI_URL = 'https://ahrefs-dr-rank-checker.p.rapidapi.com/keyword-generator';

// Helper to format volume labels
function formatVolumeLabel(label: string) {
  if (!label || label === 'Unknown') return 'Unknown';
  const map: Record<string, string> = {
    MoreThanHundredThousand: '100,000+',
    MoreThanTenThousand: '10,000+',
    MoreThanOneThousand: '1,000+',
    MoreThanOneHundred: '100+',
    LessThanOneHundred: '<100',
  };
  return map[label] || label;
}

// Helper to format difficulty labels
function formatDifficultyLabel(label: string) {
  if (!label || label === 'Unknown') return 'Unknown';
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

export default function KeywordResearchPanel() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch(debouncedQuery);
    } else {
      setKeywords([]);
      setError(null);
    }
  }, [debouncedQuery]);

  const searchKeywords = async (searchQuery: string): Promise<Keyword[]> => {
    if (!RAPIDAPI_KEY) {
      throw new Error('RapidAPI key not configured. Please add VITE_RAPIDAPI_KEY to your environment variables.');
    }

    const url = `https://ahrefs-dr-rank-checker.p.rapidapi.com/keyword-generator?keyword=${encodeURIComponent(searchQuery)}&country=us`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'ahrefs-dr-rank-checker.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Extract and merge results from allIdeas and questionIdeas
      const allIdeas = data.data?.allIdeas?.results || [];
      const questionIdeas = data.data?.questionIdeas?.results || [];
      const keywords = [...allIdeas, ...questionIdeas];

      // Transform to your Keyword type
      return keywords.map((keyword: any) => {
        // Try to find an exact volume number
        const exactVolume = keyword.searchVolume || keyword.volume || keyword.monthly_searches;
        return {
          term: keyword.keyword,
          volume: typeof exactVolume === 'number' ? exactVolume : (keyword.volumeLabel || 'Unknown'),
          difficulty: keyword.difficultyLabel || 'Unknown',
        };
      });
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    
    if (!queryToSearch.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);
    setKeywords([]);

    try {
      const results = await searchKeywords(queryToSearch);
      setKeywords(results);
      
      if (results.length === 0) {
        setError('No keywords found for this query');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const toggleBookmark = (term: string) => {
    setBookmarked((prev) =>
      prev.includes(term)
        ? prev.filter((t) => t !== term)
        : [...prev, term]
    );
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100">
        <span role="img" aria-label="search">🔍</span> Keyword Research
      </h2>
      
      {!RAPIDAPI_KEY && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded mb-4">
          ⚠️ Please add your RapidAPI key to the environment variables (VITE_RAPIDAPI_KEY)
          <br />
          <small className="text-sm">
            You also need to subscribe to a keyword research API on RapidAPI Hub
          </small>
        </div>
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          placeholder="Enter a topic..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !RAPIDAPI_KEY}
          className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60"
        />
        <button
          onClick={() => handleSearch()}
          disabled={isLoading || !RAPIDAPI_KEY}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-gray-600 dark:text-gray-300">Searching for keywords...</p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded mb-4">
          ❌ {error}
        </div>
      )}
      
      {!isLoading && keywords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Found {keywords.length} keyword(s):
          </h3>
          <div className="flex flex-col gap-4">
            {keywords.map((k) => {
              const isBookmarked = bookmarked.includes(k.term);
              return (
                <div
                  key={k.term}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-5 shadow-sm flex flex-col gap-1"
                >
                  <button
                    onClick={() => toggleBookmark(k.term)}
                    className={`absolute top-3 right-3 text-2xl focus:outline-none transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </button>
                  <strong className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{k.term}</strong>
                  <p className="text-gray-700 dark:text-gray-300">
                  📊 Volume: {typeof k.volume === 'number' ? k.volume.toLocaleString() : formatVolumeLabel(String(k.volume))}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">🔥 Difficulty: {formatDifficultyLabel(String(k.difficulty))}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}