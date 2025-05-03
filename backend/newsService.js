import axios from 'axios';
import dotenv from 'dotenv';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { extract } from '@extractus/feed-extractor';

// Load environment variables
dotenv.config();

// Get API key from environment or use default
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY || 'pub_30397a6e9b8e1f9e5e0b6fb1f9c8b9d70ac2a';

// Initialize RSS parser with retry mechanism
const rssParser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 5000,
    maxRedirects: 5
});

// Define trusted news sources RSS feeds
const RSS_FEEDS = {
    'Reuters': 'https://www.reutersagency.com/feed/',
    'Associated Press': 'https://feeds.feedburner.com/apnews/world',
    'BBC': 'http://feeds.bbci.co.uk/news/world/rss.xml',
    'NPR': 'https://feeds.npr.org/1001/rss.xml',
    'The Guardian': 'https://www.theguardian.com/world/rss'
};

// Define trusted news websites for scraping
const NEWS_WEBSITES = {
    'Reuters': {
        url: 'https://www.reuters.com/world/',
        articleSelector: 'article',
        titleSelector: '.article-heading',
        descriptionSelector: '.article-description',
        dateSelector: 'time'
    },
    'AP News': {
        url: 'https://apnews.com/hub/world-news',
        articleSelector: '.FeedCard',
        titleSelector: '.CardHeadline',
        descriptionSelector: '.content',
        dateSelector: '.Timestamp'
    }
};

// Current date for query timeframes
const today = new Date();
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Format date for API requests
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

/**
 * Sort articles by relevance and recency using a combined score
 * @param {Array} articles - Array of news articles
 * @param {string} query - The search query
 * @returns {Array} Sorted articles
 */
function sortArticlesByRelevanceAndRecency(articles, query) {
    if (!articles || articles.length === 0) return [];
    
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
    const queryLower = query.toLowerCase();
    
    // Identify if this is a person query
    const isPersonQuery = queryTerms.some(term => term.charAt(0) === term.charAt(0).toUpperCase());
    
    return articles.map(article => {
        let relevanceScore = 0;
        const title = article.title ? article.title.toLowerCase() : '';
        const description = article.description ? article.description.toLowerCase() : '';
        const content = article.content ? article.content.toLowerCase() : '';
        
        // Check for exact name matches (higher weight for person queries)
        if (isPersonQuery) {
            if (title.includes(queryLower)) relevanceScore += 15;
            if (description.includes(queryLower)) relevanceScore += 10;
            if (content.includes(queryLower)) relevanceScore += 8;
            
            // Check for biographical indicators
            const bioTerms = ['return', 'arrived', 'landed', 'completed', 'mission', 'astronaut', 'space', 'nasa', 'current', 'status', 'location'];
            bioTerms.forEach(term => {
                if (title.includes(term)) relevanceScore += 5;
                if (description.includes(term)) relevanceScore += 3;
                if (content.includes(term)) relevanceScore += 2;
            });
        } else {
            // Standard relevance scoring for non-person queries
            if (title.includes(queryLower)) relevanceScore += 10;
            if (description.includes(queryLower)) relevanceScore += 5;
            if (content.includes(queryLower)) relevanceScore += 3;
        }
        
        // Check for individual terms
        queryTerms.forEach(term => {
            if (title.includes(term)) relevanceScore += 3;
            if (description.includes(term)) relevanceScore += 2;
            if (content.includes(term)) relevanceScore += 1;
        });
        
        // Calculate recency score with adjusted weights for person queries
        let recencyScore = 0;
        if (article.publishedAt) {
            const publishDate = new Date(article.publishedAt);
            const ageInHours = (Date.now() - publishDate) / (1000 * 60 * 60);
            
            if (isPersonQuery) {
                // For person queries, recent news is important but not as dominant
                if (ageInHours < 24) {
                    recencyScore = 10;
                } else if (ageInHours < 72) {
                    recencyScore = 8;
                } else if (ageInHours < 168) { // 1 week
                    recencyScore = 6;
                } else if (ageInHours < 720) { // 1 month
                    recencyScore = 4;
                } else {
                    recencyScore = 2;
                }
            } else {
                // Standard recency scoring for non-person queries
                if (ageInHours < 6) {
                    recencyScore = 10;
                } else if (ageInHours < 24) {
                    recencyScore = 8;
                } else if (ageInHours < 48) {
                    recencyScore = 6;
                } else if (ageInHours < 72) {
                    recencyScore = 4;
                } else {
                    recencyScore = 2;
                }
            }
        }
        
        // Calculate source reliability score
        let sourceScore = 0;
        const reliableSources = ['Reuters', 'AP', 'Associated Press', 'BBC', 'CNN', 'NASA', 'Space.com', 'Al Jazeera', 'Bloomberg', 'The Guardian', 'New York Times', 'Washington Post'];
        if (article.source && article.source.name) {
            const sourceName = article.source.name;
            if (reliableSources.some(s => sourceName.includes(s))) {
                sourceScore = isPersonQuery ? 4 : 2; // Higher weight for reliable sources in person queries
            }
        }
        
        // Adjust score weights based on query type
        const combinedScore = isPersonQuery
            ? (relevanceScore * 0.6) + (recencyScore * 0.25) + (sourceScore * 0.15) // More weight on relevance for person queries
            : (relevanceScore * 0.5) + (recencyScore * 0.4) + (sourceScore * 0.1);  // Standard weights for other queries
        
        return { ...article, _score: combinedScore };
    })
    .sort((a, b) => b._score - a._score)
    .map(article => {
        const { _score, ...cleanedArticle } = article;
        return cleanedArticle;
    });
}

/**
 * Filter out duplicate articles based on title similarity
 * @param {Array} articles - Array of news articles
 * @returns {Array} Filtered articles without duplicates
 */
function filterDuplicateArticles(articles) {
    if (!articles || articles.length === 0) return [];
    
    const uniqueArticles = [];
    const seenTitles = new Set();
    
    articles.forEach(article => {
        if (!article.title) return;
        
        // Create a simplified title for comparison (lowercase, no punctuation)
        const simplifiedTitle = article.title.toLowerCase().replace(/[^\w\s]/g, '');
        
        // Check if we've seen a very similar title
        let isDuplicate = false;
        for (const title of seenTitles) {
            // Calculate similarity (very basic approach)
            const similarity = calculateTitleSimilarity(title, simplifiedTitle);
            if (similarity > 0.7) { // 70% similarity threshold
                isDuplicate = true;
                break;
            }
        }
        
        if (!isDuplicate) {
            seenTitles.add(simplifiedTitle);
            uniqueArticles.push(article);
        }
    });
    
    return uniqueArticles;
}

/**
 * Calculate similarity between two titles using a simple approach
 * @param {string} title1 - First title
 * @param {string} title2 - Second title
 * @returns {number} Similarity score (0-1)
 */
function calculateTitleSimilarity(title1, title2) {
    const words1 = title1.split(/\s+/);
    const words2 = title2.split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    // Count common words
    let commonCount = 0;
    for (const word of set1) {
        if (set2.has(word)) commonCount++;
    }
    
    // Calculate Jaccard similarity
    const similarity = commonCount / (set1.size + set2.size - commonCount);
    
    return similarity;
}

/**
 * Get top headlines based on query parameters
 * @param {Object} params - Query parameters (country, category, q, sources)
 * @returns {Promise<Object>} Top headlines
 */
async function getTopHeadlines(params = {}) {
    try {
        const response = await fetchNewsDataArticles({
            ...params,
            category: params.category || 'top',
            country: params.country || 'us'
        });
        
        if (response.articles && response.articles.length > 0) {
            // Sort headlines by recency and relevance
            const sortedArticles = sortArticlesByRelevanceAndRecency(response.articles, params.query || '');
            const uniqueArticles = filterDuplicateArticles(sortedArticles);
            
            return {
                articles: uniqueArticles,
                totalResults: response.totalResults
            };
        } else {
            console.log('No headlines found through NewsData.io, trying backup API...');
            return await fetchNewsWithBackupAPI(params);
        }
    } catch (error) {
        console.error('Error fetching top headlines:', error);
        // Use the backup API if the primary fails
        return await fetchNewsWithBackupAPI(params);
    }
}

/**
 * Preprocess and enhance search query
 * @param {string} query - Original search query
 * @returns {Object} Enhanced query parameters
 */
function preprocessQuery(query) {
    query = query.replace(/\[Context:.*?\]/g, '').trim();
    
    const entities = {
        people: [],
        locations: [],
        organizations: [],
        events: [],
        dates: []
    };
    
    const words = query.split(/\s+/);
    const capitalizedWords = words.filter(word => word.charAt(0) === word.charAt(0).toUpperCase());
    
    capitalizedWords.forEach(word => {
        if (word.length > 1) {
            entities.people.push(word);
        }
    });
    
    const queryVariations = [query];
    
    if (entities.people.length > 0) {
        const person = entities.people.join(' ');
        // Add more specific variations for person queries
        queryVariations.push(
            `${person} current location`,
            `${person} latest news`,
            `${person} current status`,
            `${person} recent update`,
            `${person} whereabouts`,
            `${person} latest activity`,
            // Add space-related variations if relevant
            `astronaut ${person}`,
            `${person} space mission`,
            `${person} NASA`,
            `${person} return Earth`,
            `${person} landing`,
            // Add biographical variations
            `${person} biography`,
            `${person} career`,
            `${person} achievements`
        );
    }
    
    // Extend time ranges for person queries
    const timeRanges = [
        {
            from: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            to: formatDate(new Date()),
            priority: 'critical'
        },
        {
            from: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
            to: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            priority: 'high'
        },
        {
            from: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
            to: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
            priority: 'medium'
        },
        {
            from: formatDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)),
            to: formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
            priority: 'low'
        }
    ];
    
    return {
        originalQuery: query,
        queryVariations,
        entities,
        timeRanges,
        isHistoricalSearch: true,
        isPerson: entities.people.length > 0
    };
}

/**
 * Search for historical news articles
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Historical news articles
 */
async function searchHistoricalNews(params) {
    try {
        const articles = [];
        const promises = [];
        
        // Search across all time ranges
        for (const timeRange of params.timeRanges) {
            promises.push(
                fetchNewsDataArticles({
                    query: params.query,
                    from: timeRange.from,
                    to: timeRange.to,
                    language: 'en',
                    sortBy: 'relevancy'
                }).catch(error => {
                    console.error(`Error fetching news for time range ${timeRange.from} to ${timeRange.to}:`, error);
                    return { articles: [] };
                })
            );
            
            // Add MediaStack search for the same period
            promises.push(
                fetchMediaStackNews({
                    ...params,
                    date: timeRange.from,
                    sort: 'relevancy'
                }).catch(error => {
                    console.error(`Error fetching MediaStack news for time range ${timeRange.from}:`, error);
                    return { articles: [] };
                })
            );
            
            // Add GNews search
            promises.push(
                fetchGNewsArticles({
                    ...params,
                    from: timeRange.from,
                    to: timeRange.to
                }).catch(error => {
                    console.error(`Error fetching GNews for time range ${timeRange.from} to ${timeRange.to}:`, error);
                    return { articles: [] };
                })
            );
        }
        
        const results = await Promise.all(promises);
        results.forEach(result => {
            if (result.articles && result.articles.length > 0) {
                articles.push(...result.articles);
            }
        });
        
        // Remove duplicates and sort by relevance and date
        const uniqueArticles = filterDuplicateArticles(articles);
        const sortedArticles = sortArticlesByRelevanceAndRecency(uniqueArticles, params.query);
        
        return {
            articles: sortedArticles,
            totalResults: sortedArticles.length
        };
    } catch (error) {
        console.error('Error in searchHistoricalNews:', error);
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Search for news articles based on query parameters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Search results
 */
async function searchNews(params = {}) {
    try {
        if (!params.query) {
            throw new Error('Query is required for searching news');
        }
        
        // Preprocess and enhance the query
        const enhancedQuery = preprocessQuery(params.query);
        console.log('Enhanced query:', enhancedQuery);
        
        // Search for both recent and historical news
        const [recentNews, historicalNews] = await Promise.all([
            // Recent news (using existing sources)
            Promise.all(enhancedQuery.queryVariations.flatMap(queryVariation => [
                fetchRSSFeeds({ ...params, query: queryVariation }),
                scrapeNewsWebsites({ ...params, query: queryVariation }),
                fetchNewsDataArticles({
                    ...params,
                    query: queryVariation,
                    timeframe: 'recent'
                })
            ])).catch(error => {
                console.error('Error fetching recent news:', error);
                return [];
            }),
            
            // Historical news
            searchHistoricalNews({ ...params, ...enhancedQuery })
        ]);
        
        // Combine all articles
        let allArticles = [
            ...(recentNews.flat().map(result => result.articles || []).flat()),
            ...(historicalNews.articles || [])
        ];
        
        // Remove duplicates and sort
        const uniqueArticles = filterDuplicateArticles(allArticles);
        const sortedArticles = sortArticlesByRelevanceAndRecency(uniqueArticles, params.query);
        
        // Group articles by time period
        const groupedArticles = {
            recent: sortedArticles.filter(article => {
                const publishDate = new Date(article.publishedAt);
                return (Date.now() - publishDate) <= 7 * 24 * 60 * 60 * 1000;
            }),
            lastMonth: sortedArticles.filter(article => {
                const publishDate = new Date(article.publishedAt);
                const age = Date.now() - publishDate;
                return age > 7 * 24 * 60 * 60 * 1000 && age <= 30 * 24 * 60 * 60 * 1000;
            }),
            older: sortedArticles.filter(article => {
                const publishDate = new Date(article.publishedAt);
                return (Date.now() - publishDate) > 30 * 24 * 60 * 60 * 1000;
            })
        };
        
        return {
            articles: sortedArticles,
            groupedArticles,
            totalResults: sortedArticles.length,
            enhancedQuery
        };
    } catch (error) {
        console.error('Error in searchNews:', error);
        return {
            articles: [],
            totalResults: 0,
            error: error.message
        };
    }
}

/**
 * Fetch news from MediaStack API with improved error handling
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchMediaStackNews(params = {}) {
    try {
        const url = `https://api.mediastack.com/v1/news`;
        const response = await axios.get(url, {
            params: {
                access_key: MEDIASTACK_API_KEY,
                keywords: params.query,
                languages: 'en',
                limit: 15,
                sort: 'published_desc'
            },
            timeout: 5000
        });
        
        if (response.data && response.data.data && response.data.data.length > 0) {
            console.log(`Found ${response.data.data.length} news articles with MediaStack`);
            return {
                articles: response.data.data.map(article => ({
                    source: { id: null, name: article.source || 'MediaStack' },
                    author: article.author || article.source,
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    urlToImage: article.image,
                    publishedAt: article.published_at,
                    content: article.description
                })),
                totalResults: response.data.pagination ? response.data.pagination.total : response.data.data.length
            };
        }
        console.log('No results from MediaStack');
        return { articles: [], totalResults: 0 };
    } catch (error) {
        console.error('Error fetching from MediaStack:', error.message);
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Fetch news from GNews API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchGNewsArticles(params = {}) {
    try {
        const url = `https://gnews.io/api/v4/search?q=${params.query}&lang=en&max=15&sortby=publishedAt&apikey=${GNEWS_API_KEY}`;
        
        const response = await axios.get(url);
        
        if (response.data && response.data.articles && response.data.articles.length > 0) {
            console.log(`Found ${response.data.articles.length} news articles with GNews`);
            
            // Transform response to match NewsAPI format
            const articles = response.data.articles.map(article => ({
                source: { id: null, name: article.source.name },
                author: article.source.name,
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.image,
                publishedAt: article.publishedAt,
                content: article.content
            }));
            
            // Apply custom sorting and filtering
            const sortedArticles = sortArticlesByRelevanceAndRecency(articles, params.query);
            const uniqueArticles = filterDuplicateArticles(sortedArticles);
            
            return {
                articles: uniqueArticles.slice(0, params.pageSize || 10),
                totalResults: response.data.totalArticles || uniqueArticles.length
            };
        } else {
            throw new Error('No results from GNews');
        }
    } catch (error) {
        console.error('Error fetching from GNews:', error.message);
        // Try one more fallback with a general query if needed
        if (params.query.length > 20) {
            const generalQuery = params.query.split(' ').slice(0, 3).join(' ');
            console.log(`Trying with more general query: ${generalQuery}`);
            return fetchWithSimplifiedQuery(generalQuery);
        }
        throw error;
    }
}

/**
 * Fetch news with a more general query as last resort
 * @param {string} query - Simplified search query
 * @returns {Promise<Object>} News articles
 */
async function fetchWithSimplifiedQuery(query) {
    try {
        // Using Contextual Web Search API as last resort
        const options = {
            method: 'GET',
            url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI',
            params: {
                q: query,
                pageNumber: '1',
                pageSize: '15',
                autoCorrect: 'true',
                withThumbnails: 'true',
                fromPublishedDate: formatDate(lastWeek),
                toPublishedDate: formatDate(today)
            },
            headers: {
                'X-RapidAPI-Key': '9450aa6ac1mshfcdcae6c0e3582fp13aaa3jsna5fc01dc6f4e',
                'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.value && response.data.value.length > 0) {
            console.log(`Found ${response.data.value.length} news articles with Contextual Web Search`);
            
            // Transform response to match NewsAPI format
            const articles = response.data.value.map(article => ({
                source: { id: null, name: article.provider.name },
                author: article.provider.name,
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.image?.thumbnail?.contentUrl,
                publishedAt: article.datePublished,
                content: article.body || article.description
            }));
            
            // Apply custom sorting and filtering
            const sortedArticles = sortArticlesByRelevanceAndRecency(articles, query);
            const uniqueArticles = filterDuplicateArticles(sortedArticles);
            
            return {
                articles: uniqueArticles.slice(0, 10),
                totalResults: response.data.totalCount || uniqueArticles.length
            };
        } else {
            throw new Error('No results from Contextual Web Search');
        }
    } catch (error) {
        console.error('Error fetching from Contextual Web Search:', error.message);
        // Return empty results if this last attempt also fails
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Fetch news from World News API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchWorldNewsArticles(params = {}) {
    try {
        const url = `https://api.worldnewsapi.com/search-news?api-key=${WORLD_NEWS_API_KEY}&text=${params.query}&language=en&number=15&sort=publish-time`;
        
        const response = await axios.get(url);
        
        if (response.data && response.data.news && response.data.news.length > 0) {
            console.log(`Found ${response.data.news.length} articles with World News API`);
            
            // Transform response to match our standard format
            const articles = response.data.news.map(article => ({
                source: { id: null, name: article.source },
                author: article.authors?.join(', ') || article.source,
                title: article.title,
                description: article.text?.substring(0, 200) + '...',
                url: article.url,
                urlToImage: article.image,
                publishedAt: article.publish_date,
                content: article.text,
                sentiment: article.sentiment, // Additional field from World News API
                entities: article.entities // Additional field for named entities
            }));
            
            return {
                articles: articles,
                totalResults: response.data.available || articles.length
            };
        }
        throw new Error('No results from World News API');
    } catch (error) {
        console.error('Error fetching from World News API:', error.message);
        throw error;
    }
}

/**
 * Fetch news from NewsAPI.ai
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchNewsApiAiArticles(params = {}) {
    try {
        const url = 'https://api.newsapi.ai/api/v1/article/getArticles';
        const requestData = {
            apiKey: NEWSAPIAI_API_KEY,
            articlesSortBy: 'date',
            articlesSortByAsc: false,
            articlesPage: 1,
            articlesCount: 15,
            articleBodyLen: -1,
            query: params.query,
            dataType: ['news'],
            lang: 'eng',
            isDuplicateFilter: true
        };
        
        const response = await axios.post(url, requestData);
        
        if (response.data && response.data.articles && response.data.articles.results) {
            const articles = response.data.articles.results;
            console.log(`Found ${articles.length} articles with NewsAPI.ai`);
            
            // Transform response to match our standard format
            const transformedArticles = articles.map(article => ({
                source: { id: null, name: article.source.title },
                author: article.authors?.join(', '),
                title: article.title,
                description: article.body?.substring(0, 200) + '...',
                url: article.url,
                urlToImage: article.image,
                publishedAt: article.dateTime,
                content: article.body,
                sentiment: article.sentiment, // Additional field from NewsAPI.ai
                categories: article.categories, // Additional categorization
                concepts: article.concepts // Named entities and concepts
            }));
            
            return {
                articles: transformedArticles,
                totalResults: response.data.articles.totalResults
            };
        }
        throw new Error('No results from NewsAPI.ai');
    } catch (error) {
        console.error('Error fetching from NewsAPI.ai:', error.message);
        throw error;
    }
}

/**
 * Fetch news from RSS feeds
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchRSSFeeds(params = {}) {
    try {
        const feedPromises = Object.entries(RSS_FEEDS).map(async ([source, url]) => {
            try {
                // Use feed-extractor for better compatibility
                const feed = await extract(url);
                if (!feed || !feed.entries) {
                    console.log(`No entries found for ${source} RSS feed`);
                    return [];
                }

                return feed.entries.map(entry => ({
                    source: { id: null, name: source },
                    author: entry.author || source,
                    title: entry.title,
                    description: entry.description?.substring(0, 200) || entry.summary?.substring(0, 200),
                    url: entry.link,
                    urlToImage: entry.enclosure?.url || extractImageFromContent(entry.content),
                    publishedAt: entry.published || entry.pubDate,
                    content: entry.content || entry.description
                }));
            } catch (error) {
                console.error(`Error fetching RSS feed from ${source}:`, error.message);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const articles = results.flat();
        
        console.log(`Found ${articles.length} articles from RSS feeds`);
        return { articles, totalResults: articles.length };
    } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Extract image URL from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} Image URL
 */
function extractImageFromContent(content) {
    if (!content) return null;
    try {
        const $ = cheerio.load(content);
        const img = $('img').first();
        return img.attr('src') || null;
    } catch (error) {
        return null;
    }
}

/**
 * Scrape news from trusted websites
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function scrapeNewsWebsites(params = {}) {
    try {
        const scrapePromises = Object.entries(NEWS_WEBSITES).map(async ([source, config]) => {
            try {
                const response = await axios.get(config.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                const $ = cheerio.load(response.data);
                const articles = [];

                $(config.articleSelector).each((i, element) => {
                    const $element = $(element);
                    const title = $element.find(config.titleSelector).text().trim();
                    const description = $element.find(config.descriptionSelector).text().trim();
                    const url = $element.find('a').first().attr('href');
                    const publishedAt = $element.find(config.dateSelector).attr('datetime') || 
                                      $element.find(config.dateSelector).text().trim();
                    
                    if (title && (params.query ? title.toLowerCase().includes(params.query.toLowerCase()) : true)) {
                        articles.push({
                            source: { id: null, name: source },
                            author: source,
                            title,
                            description: description.substring(0, 200),
                            url: url.startsWith('http') ? url : `${new URL(config.url).origin}${url}`,
                            urlToImage: $element.find('img').first().attr('src'),
                            publishedAt,
                            content: description
                        });
                    }
                });

                return articles;
            } catch (error) {
                console.error(`Error scraping ${source}:`, error.message);
                return [];
            }
        });

        const results = await Promise.all(scrapePromises);
        const articles = results.flat();
        
        console.log(`Found ${articles.length} articles from web scraping`);
        return { articles, totalResults: articles.length };
    } catch (error) {
        console.error('Error scraping news websites:', error);
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Extract news topics from text
 * @param {string} text - Text to extract topics from
 * @returns {string[]} Array of news topics
 */
function extractNewsTopics(text) {
    // Define common news categories and events
    const newsKeywords = [
        // Categories
        'politics', 'business', 'technology', 'science', 'health', 
        'sports', 'entertainment', 'world', 'national', 'economy',
        'coronavirus', 'covid', 'pandemic', 'climate', 'election',
        
        // Events
        'earthquake', 'hurricane', 'tornado', 'flood', 'disaster',
        'war', 'conflict', 'attack', 'shooting', 'protest',
        'summit', 'conference', 'election', 'vote', 'bill',
        'legislation', 'court', 'ruling', 'verdict', 'investigation',
        'scandal', 'controversy', 'accident', 'crash', 'incident',
        'launch', 'release', 'announcement', 'discovery', 'breakthrough',
        'award', 'ceremony', 'festival', 'concert', 'game',
        'tournament', 'championship', 'match', 'race', 'competition'
    ];
    
    // Extract topics mentioned in the text
    const topics = [];
    const lowercaseText = text.toLowerCase();
    
    for (const keyword of newsKeywords) {
        if (lowercaseText.includes(keyword)) {
            topics.push(keyword);
        }
    }
    
    return [...new Set(topics)]; // Remove duplicates
}

/**
 * Get news sources
 * @param {Object} params - Query parameters (category, language, country)
 * @returns {Promise<Object>} News sources
 */
async function getNewsSources(params = {}) {
    try {
        const response = await newsapi.v2.sources({
            category: params.category,
            language: params.language,
            country: params.country
        });
        
        return response.sources;
    } catch (error) {
        console.error('Error fetching news sources:', error);
        return [];
    }
}

export { getTopHeadlines, searchNews, extractNewsTopics, getNewsSources };

/**
 * Fetch news from NewsData.io API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchNewsDataArticles(params = {}) {
    try {
        const url = 'https://newsdata.io/api/1/news';
        
        const apiParams = {
            apikey: NEWSDATA_API_KEY,
            q: params.query || '',
            language: params.language || 'en',
            country: params.country || '',
            category: params.category || ''
        };
        
        // Add date range if specified
        if (params.from) {
            apiParams.from_date = params.from;
        }
        if (params.to) {
            apiParams.to_date = params.to;
        }
        
        const response = await axios.get(url, {
            params: apiParams,
            timeout: 10000
        });
        
        if (response.data && response.data.results && response.data.results.length > 0) {
            console.log(`Found ${response.data.results.length} articles with NewsData.io`);
            
            // Transform response to match your existing format
            const articles = response.data.results.map(article => ({
                source: { id: null, name: article.source_id || 'NewsData.io' },
                author: article.creator?.join(', ') || '',
                title: article.title,
                description: article.description || article.content?.substring(0, 150) || '',
                url: article.link,
                urlToImage: article.image_url,
                publishedAt: article.pubDate,
                content: article.content,
                keywords: article.keywords || []
            }));
            
            return { 
                articles, 
                totalResults: articles.length,
                nextPage: response.data.nextPage
            };
        }
        
        console.log('No results from NewsData.io');
        return { articles: [], totalResults: 0 };
    } catch (error) {
        console.error('Error fetching from NewsData.io:', error.message);
        return { articles: [], totalResults: 0 };
    }
}

/**
 * Fetch news using backup APIs when NewsAPI fails
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News articles
 */
async function fetchNewsWithBackupAPI(params = {}) {
  try {
    // Try GNews first
    const gnewsResponse = await fetchGNewsArticles(params);
    if (gnewsResponse.articles && gnewsResponse.articles.length > 0) {
      return gnewsResponse;
    }
    
    // Then try MediaStack
    const mediaStackResponse = await fetchMediaStackNews(params);
    if (mediaStackResponse.articles && mediaStackResponse.articles.length > 0) {
      return mediaStackResponse;
    }
    
    // Finally try RSS feeds and scraping
    const [rssResults, scrapedResults] = await Promise.all([
      fetchRSSFeeds(params),
      scrapeNewsWebsites(params)
    ]);
    
    const combinedArticles = [
      ...(rssResults.articles || []),
      ...(scrapedResults.articles || [])
    ];
    
    if (combinedArticles.length > 0) {
      return {
        articles: combinedArticles,
        totalResults: combinedArticles.length
      };
    }
    
    // If all else fails, return empty results
    return { articles: [], totalResults: 0 };
  } catch (error) {
    console.error('Error in fetchNewsWithBackupAPI:', error);
    return { articles: [], totalResults: 0 };
  }
}