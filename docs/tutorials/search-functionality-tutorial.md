# Advanced Search Functionality

Learn how to implement powerful search features in your content provider plugins.

## Search Architecture Patterns

### 1. Simple Text Search
Basic keyword matching within your content.

```javascript
function simpleSearch(items, query) {
  var lowerQuery = query.toLowerCase();
  return items.filter(function(item) {
    return item.title.toLowerCase().indexOf(lowerQuery) !== -1 ||
           (item.description && item.description.toLowerCase().indexOf(lowerQuery) !== -1);
  });
}
```

### 2. API-Based Search
Leverage external search APIs for better results.

```javascript
function apiSearch(query, page) {
  var url = API_BASE_URL + '/search';
  var params = {
    q: query,
    page: page || 1,
    limit: 20
  };
  
  var response = http.request(url + '?' + buildQueryString(params));
  return JSON.parse(response.toString());
}
```

### 3. Multi-Source Search
Search across multiple content sources.

```javascript
function multiSourceSearch(query) {
  var results = [];
  var sources = ['movies', 'tv', 'documentaries'];
  
  sources.forEach(function(source) {
    try {
      var sourceResults = searchSource(source, query);
      results = results.concat(sourceResults.map(function(item) {
        return { ...item, source: source };
      }));
    } catch (error) {
      plugin.log('Search failed for source ' + source + ': ' + error.message);
    }
  });
  
  return results;
}
```

## Advanced Search Features

### Search Suggestions
Provide helpful search suggestions to users.

```javascript
plugin.addURI("myplugin:search:(.*)$", function(page, query) {
  page.type = "directory";
  page.contents = "items";
  
  if (!query) {
    page.metadata.title = "Search";
    
    // Show popular searches
    var popularSearches = getPopularSearches();
    if (popularSearches.length > 0) {
      page.appendItem("", "separator", { title: "Popular Searches" });
      popularSearches.forEach(function(term) {
        page.appendItem("myplugin:search:" + term, "directory", {
          title: term,
          description: "Search for " + term
        });
      });
    }
    
    // Show recent searches
    var recentSearches = getRecentSearches();
    if (recentSearches.length > 0) {
      page.appendItem("", "separator", { title: "Recent Searches" });
      recentSearches.forEach(function(term) {
        page.appendItem("myplugin:search:" + term, "directory", {
          title: term,
          description: "Recent search"
        });
      });
    }
    
    return;
  }
  
  // Perform actual search
  performSearch(page, query);
});

function getPopularSearches() {
  // Return popular search terms based on your content
  return ['action', 'comedy', 'drama', 'thriller', 'documentary'];
}

function getRecentSearches() {
  // In a real plugin, you'd store recent searches
  return [];
}
```

### Search Filters
Allow users to filter search results.

```javascript
function performAdvancedSearch(query, filters) {
  var params = { q: query };
  
  // Add filters to search parameters
  if (filters.year) params.year = filters.year;
  if (filters.genre) params.genre = filters.genre;
  if (filters.rating) params.min_rating = filters.rating;
  if (filters.duration) params.max_duration = filters.duration;
  
  return makeApiRequest('/search/advanced', params);
}

// Example usage in URI handler
plugin.addURI("myplugin:search:(.*)$", function(page, query) {
  // Parse query for filters (e.g., "action year:2020 rating:8+")
  var searchTerms = parseSearchQuery(query);
  
  var results = performAdvancedSearch(searchTerms.query, searchTerms.filters);
  displaySearchResults(page, results, query);
});

function parseSearchQuery(query) {
  var filters = {};
  var cleanQuery = query;
  
  // Extract year filter
  var yearMatch = query.match(/year:(\d{4})/);
  if (yearMatch) {
    filters.year = yearMatch[1];
    cleanQuery = cleanQuery.replace(yearMatch[0], '').trim();
  }
  
  // Extract rating filter
  var ratingMatch = query.match(/rating:(\d+)\+?/);
  if (ratingMatch) {
    filters.rating = ratingMatch[1];
    cleanQuery = cleanQuery.replace(ratingMatch[0], '').trim();
  }
  
  return {
    query: cleanQuery,
    filters: filters
  };
}
```

### Search Result Ranking
Implement intelligent result ranking.

```javascript
function rankSearchResults(results, query) {
  var lowerQuery = query.toLowerCase();
  
  return results.map(function(item) {
    var score = 0;
    
    // Exact title match gets highest score
    if (item.title.toLowerCase() === lowerQuery) {
      score += 100;
    }
    // Title starts with query
    else if (item.title.toLowerCase().startsWith(lowerQuery)) {
      score += 50;
    }
    // Title contains query
    else if (item.title.toLowerCase().indexOf(lowerQuery) !== -1) {
      score += 25;
    }
    
    // Description contains query
    if (item.description && item.description.toLowerCase().indexOf(lowerQuery) !== -1) {
      score += 10;
    }
    
    // Boost popular items
    if (item.popularity) {
      score += item.popularity * 0.1;
    }
    
    // Boost recent items
    if (item.releaseDate) {
      var age = Date.now() - new Date(item.releaseDate).getTime();
      var ageInYears = age / (1000 * 60 * 60 * 24 * 365);
      score += Math.max(0, 10 - ageInYears);
    }
    
    return { ...item, searchScore: score };
  }).sort(function(a, b) {
    return b.searchScore - a.searchScore;
  });
}
```

### Search History and Analytics
Track search patterns for improvements.

```javascript
var searchHistory = [];
var searchAnalytics = {};

function recordSearch(query, resultCount) {
  var searchRecord = {
    query: query,
    timestamp: Date.now(),
    resultCount: resultCount
  };
  
  searchHistory.push(searchRecord);
  
  // Keep only last 100 searches
  if (searchHistory.length > 100) {
    searchHistory = searchHistory.slice(-100);
  }
  
  // Update analytics
  if (!searchAnalytics[query]) {
    searchAnalytics[query] = { count: 0, lastUsed: 0 };
  }
  searchAnalytics[query].count++;
  searchAnalytics[query].lastUsed = Date.now();
}

function getPopularSearches() {
  return Object.keys(searchAnalytics)
    .sort(function(a, b) {
      return searchAnalytics[b].count - searchAnalytics[a].count;
    })
    .slice(0, 10);
}
```

### Auto-complete and Suggestions
Provide real-time search suggestions.

```javascript
function getSearchSuggestions(partialQuery) {
  var suggestions = [];
  
  // Get suggestions from search history
  var historySuggestions = searchHistory
    .filter(function(record) {
      return record.query.toLowerCase().startsWith(partialQuery.toLowerCase());
    })
    .map(function(record) {
      return record.query;
    })
    .slice(0, 5);
  
  suggestions = suggestions.concat(historySuggestions);
  
  // Get suggestions from content titles
  var contentSuggestions = getContentTitleSuggestions(partialQuery);
  suggestions = suggestions.concat(contentSuggestions);
  
  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 10);
}

function getContentTitleSuggestions(partialQuery) {
  // This would query your content database or cache
  // For demonstration, returning static suggestions
  var commonTerms = [
    'action movies', 'comedy shows', 'drama series',
    'documentary films', 'thriller movies', 'sci-fi shows'
  ];
  
  return commonTerms.filter(function(term) {
    return term.toLowerCase().indexOf(partialQuery.toLowerCase()) !== -1;
  });
}
```

## Search Performance Optimization

### Caching Search Results
Cache frequently searched terms.

```javascript
var searchCache = {};
var SEARCH_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCachedSearchResults(query) {
  var cached = searchCache[query];
  if (cached && (Date.now() - cached.timestamp) < SEARCH_CACHE_DURATION) {
    return cached.results;
  }
  return null;
}

function setCachedSearchResults(query, results) {
  searchCache[query] = {
    results: results,
    timestamp: Date.now()
  };
}

function performCachedSearch(query) {
  var cached = getCachedSearchResults(query);
  if (cached) {
    return cached;
  }
  
  var results = performActualSearch(query);
  setCachedSearchResults(query, results);
  return results;
}
```

### Debounced Search
Prevent excessive API calls during typing.

```javascript
var searchTimeout;

function debouncedSearch(query, callback) {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(function() {
    performSearch(query, callback);
  }, 300); // Wait 300ms after user stops typing
}
```

### Pagination for Large Result Sets
Handle large search results efficiently.

```javascript
plugin.addURI("myplugin:search:(.*)$", function(page, query) {
  var pageNum = 1;
  var pageSize = 20;
  
  // Extract page number from query if present
  var pageMatch = query.match(/page:(\d+)/);
  if (pageMatch) {
    pageNum = parseInt(pageMatch[1]);
    query = query.replace(pageMatch[0], '').trim();
  }
  
  page.type = "directory";
  page.contents = "items";
  page.metadata.title = "Search: " + query;
  page.loading = true;
  
  try {
    var results = performPaginatedSearch(query, pageNum, pageSize);
    
    results.items.forEach(function(item) {
      addSearchResultItem(page, item);
    });
    
    // Add pagination controls
    if (pageNum > 1) {
      page.appendItem("myplugin:search:" + query + " page:" + (pageNum - 1), "directory", {
        title: "← Previous Page",
        description: "Page " + (pageNum - 1)
      });
    }
    
    if (results.hasMore) {
      page.appendItem("myplugin:search:" + query + " page:" + (pageNum + 1), "directory", {
        title: "Next Page →",
        description: "Page " + (pageNum + 1)
      });
    }
    
  } catch (error) {
    page.error("Search failed: " + error.message);
  } finally {
    page.loading = false;
  }
});
```

## Testing Search Functionality

### Test Cases
1. **Empty query handling**
2. **Special character handling**
3. **Very long queries**
4. **No results scenarios**
5. **Network failure handling**
6. **Large result sets**
7. **Search filter combinations**

### Performance Testing
- Measure search response times
- Test with large datasets
- Verify caching effectiveness
- Monitor memory usage

## Best Practices

1. **User Experience**
   - Provide instant feedback
   - Show loading indicators
   - Handle empty results gracefully
   - Offer search suggestions

2. **Performance**
   - Implement result caching
   - Use pagination for large results
   - Debounce search requests
   - Optimize API queries

3. **Error Handling**
   - Handle network failures
   - Validate search queries
   - Provide meaningful error messages
   - Implement retry logic

4. **Analytics**
   - Track popular searches
   - Monitor search success rates
   - Analyze user search patterns
   - Improve based on data

This comprehensive search implementation will provide users with a powerful and responsive search experience in your content provider plugins.
