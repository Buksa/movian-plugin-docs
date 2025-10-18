# Building Content Provider Plugins

Learn how to create plugins that browse and display content from various sources.

## What You'll Learn

- Content provider architecture patterns
- API integration and data fetching
- Content categorization and navigation
- Search functionality implementation
- Error handling and user feedback
- Performance optimization techniques

## Prerequisites

- Completed the [Basic Plugin Tutorial](basic-plugin-tutorial.html)
- Understanding of HTTP requests and JSON APIs
- Basic knowledge of asynchronous JavaScript

## Content Provider Architecture

Content provider plugins typically follow this structure:

```
content-provider-plugin/
├── plugin.json          # Plugin configuration
├── main.js             # Main plugin logic
├── api/
│   ├── client.js       # API client implementation
│   └── parser.js       # Response parsing logic
├── content/
│   ├── categories.js   # Content categorization
│   └── search.js       # Search functionality
└── utils/
    ├── cache.js        # Caching utilities
    └── helpers.js      # Helper functions
```

## Step 1: Basic Content Provider Structure

Let's start with a simple content provider that fetches data from a public API.

### plugin.json
```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "content-provider-example",
  "file": "main.js",
  "showtimeVersion": "5.0",
  "version": "1.0.0",
  "author": "Your Name",
  "title": "Content Provider Example",
  "synopsis": "Example content browsing plugin",
  "description": "Demonstrates content provider patterns with API integration",
  "category": "video",
  "icon": "icon.png"
}
```

### Basic main.js Structure
```javascript
(function(plugin) {
  // Import required modules
  var http = require('movian/http');
  
  // Configuration
  var API_BASE_URL = 'https://api.example.com';
  var ITEMS_PER_PAGE = 20;
  
  // Create the main service
  plugin.createService("Content Provider", "contentprovider:", "video", true, plugin.path + "icon.png");
  
  // Main page handler
  plugin.addURI("contentprovider:start", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Content Provider";
    
    // Add categories
    addCategories(page);
    
    // Add search
    page.appendItem("", "separator", { title: "Search" });
    page.appendItem("contentprovider:search:", "search", {
      title: "Search Content"
    });
  });
  
  function addCategories(page) {
    var categories = [
      { id: 'popular', title: 'Popular', description: 'Most popular content' },
      { id: 'recent', title: 'Recent', description: 'Recently added content' },
      { id: 'trending', title: 'Trending', description: 'Trending content' }
    ];
    
    categories.forEach(function(category) {
      page.appendItem("contentprovider:category:" + category.id, "directory", {
        title: category.title,
        description: category.description
      });
    });
  }
  
})(this);
```

## Step 2: API Integration

Now let's add real API integration to fetch content.

### HTTP Client Implementation
```javascript
// API client functions
function makeApiRequest(endpoint, params) {
  var url = API_BASE_URL + endpoint;
  
  if (params) {
    var queryString = Object.keys(params).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
    
    if (queryString) {
      url += '?' + queryString;
    }
  }
  
  try {
    var response = http.request(url, {
      headers: {
        'User-Agent': 'Movian Content Provider Plugin/1.0'
      }
    });
    
    if (response.statuscode === 200) {
      return JSON.parse(response.toString());
    } else {
      throw new Error('API request failed with status: ' + response.statuscode);
    }
  } catch (error) {
    plugin.log('API request error: ' + error.message);
    throw error;
  }
}

function fetchCategoryContent(categoryId, page, limit) {
  return makeApiRequest('/content/' + categoryId, {
    page: page || 1,
    limit: limit || ITEMS_PER_PAGE
  });
}

function searchContent(query, page, limit) {
  return makeApiRequest('/search', {
    q: query,
    page: page || 1,
    limit: limit || ITEMS_PER_PAGE
  });
}
```

### Category Handler with API Integration
```javascript
// Handle category pages
plugin.addURI("contentprovider:category:(.*)$", function(page, categoryId) {
  page.type = "directory";
  page.contents = "items";
  page.metadata.title = getCategoryTitle(categoryId);
  
  // Show loading indicator
  page.loading = true;
  
  try {
    // Fetch content from API
    var data = fetchCategoryContent(categoryId);
    
    if (data && data.items) {
      data.items.forEach(function(item) {
        addContentItem(page, item);
      });
      
      // Add pagination if needed
      if (data.hasMore) {
        page.appendItem("contentprovider:category:" + categoryId + ":page:2", "directory", {
          title: "Load More...",
          description: "Load more content"
        });
      }
    } else {
      page.appendItem("", "separator", {
        title: "No content available"
      });
    }
    
  } catch (error) {
    page.error("Failed to load content: " + error.message);
  } finally {
    page.loading = false;
  }
});

function addContentItem(page, item) {
  var itemType = item.type === 'video' ? 'video' : 'directory';
  
  page.appendItem("contentprovider:item:" + item.id, itemType, {
    title: item.title,
    description: item.description,
    icon: item.thumbnail,
    duration: item.duration,
    year: item.year,
    genre: item.genre
  });
}

function getCategoryTitle(categoryId) {
  var titles = {
    'popular': 'Popular Content',
    'recent': 'Recent Content',
    'trending': 'Trending Content'
  };
  return titles[categoryId] || 'Content';
}
```

## Step 3: Content Item Handling

Handle individual content items and video playback.

```javascript
// Handle individual content items
plugin.addURI("contentprovider:item:(.*)$", function(page, itemId) {
  page.loading = true;
  
  try {
    // Fetch detailed item information
    var item = makeApiRequest('/content/item/' + itemId);
    
    if (item.type === 'video') {
      // Handle video content
      page.type = "video";
      page.metadata.title = item.title;
      page.metadata.description = item.description;
      page.metadata.icon = item.thumbnail;
      
      // Set video source
      if (item.videoUrl) {
        page.source = "videoparams:" + JSON.stringify({
          title: item.title,
          sources: [{
            url: item.videoUrl
          }]
        });
      } else {
        page.error("Video source not available");
      }
      
    } else if (item.type === 'series') {
      // Handle series/season content
      page.type = "directory";
      page.contents = "items";
      page.metadata.title = item.title;
      
      if (item.episodes) {
        item.episodes.forEach(function(episode) {
          page.appendItem("contentprovider:item:" + episode.id, "video", {
            title: episode.title,
            description: episode.description,
            icon: episode.thumbnail,
            season: episode.season,
            episode: episode.episode
          });
        });
      }
    }
    
  } catch (error) {
    page.error("Failed to load item: " + error.message);
  } finally {
    page.loading = false;
  }
});
```

## Step 4: Search Implementation

Implement comprehensive search functionality.

```javascript
// Handle search requests
plugin.addURI("contentprovider:search:(.*)$", function(page, query) {
  page.type = "directory";
  page.contents = "items";
  page.metadata.title = query ? "Search: " + query : "Search";
  
  if (!query) {
    // Show search suggestions or recent searches
    page.appendItem("", "separator", {
      title: "Enter a search term to find content"
    });
    
    // Add popular search terms
    var popularSearches = ['action', 'comedy', 'drama', 'documentary'];
    popularSearches.forEach(function(term) {
      page.appendItem("contentprovider:search:" + term, "directory", {
        title: term,
        description: "Search for " + term
      });
    });
    
    return;
  }
  
  page.loading = true;
  
  try {
    var results = searchContent(query);
    
    if (results && results.items && results.items.length > 0) {
      results.items.forEach(function(item) {
        addContentItem(page, item);
      });
      
      // Add pagination for search results
      if (results.hasMore) {
        page.appendItem("contentprovider:search:" + query + ":page:2", "directory", {
          title: "More Results...",
          description: "Load more search results"
        });
      }
      
    } else {
      page.appendItem("", "separator", {
        title: "No results found for '" + query + "'"
      });
      
      // Suggest alternative searches
      page.appendItem("", "separator", {
        title: "Try different keywords or browse categories"
      });
    }
    
  } catch (error) {
    page.error("Search failed: " + error.message);
  } finally {
    page.loading = false;
  }
});
```

## Step 5: Advanced Features

### Caching Implementation
```javascript
// Simple caching system
var cache = {};
var CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key) {
  var cached = cache[key];
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  cache[key] = {
    data: data,
    timestamp: Date.now()
  };
}

function makeApiRequestWithCache(endpoint, params) {
  var cacheKey = endpoint + JSON.stringify(params || {});
  var cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  var data = makeApiRequest(endpoint, params);
  setCachedData(cacheKey, data);
  return data;
}
```

### Error Handling and Retry Logic
```javascript
function makeApiRequestWithRetry(endpoint, params, maxRetries) {
  maxRetries = maxRetries || 3;
  var retries = 0;
  
  function attempt() {
    try {
      return makeApiRequest(endpoint, params);
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        plugin.log('API request failed, retrying... (' + retries + '/' + maxRetries + ')');
        // Wait before retry
        setTimeout(function() {}, 1000 * retries);
        return attempt();
      } else {
        throw error;
      }
    }
  }
  
  return attempt();
}
```

### User Settings Integration
```javascript
// Add user settings
plugin.createSettings("Content Provider Settings", plugin.path + "icon.png", "Configure content provider");

var itemsPerPage = plugin.createIntSetting("items_per_page", "Items per page", 20, 5, 50);
var enableCache = plugin.createBoolSetting("enable_cache", "Enable caching", true);
var apiTimeout = plugin.createIntSetting("api_timeout", "API timeout (seconds)", 30, 5, 120);

// Use settings in API requests
function makeApiRequest(endpoint, params) {
  var url = API_BASE_URL + endpoint;
  
  // Use settings
  var timeout = apiTimeout.value * 1000;
  var useCache = enableCache.value;
  
  if (useCache) {
    var cached = getCachedData(url);
    if (cached) return cached;
  }
  
  // Make request with timeout
  var response = http.request(url, {
    headers: {
      'User-Agent': 'Movian Content Provider Plugin/1.0'
    },
    timeout: timeout
  });
  
  // Process response...
}
```

## Best Practices

### 1. Error Handling
- Always wrap API calls in try-catch blocks
- Provide meaningful error messages to users
- Implement retry logic for transient failures
- Log errors for debugging

### 2. Performance Optimization
- Implement caching for frequently accessed data
- Use pagination to avoid loading too much data at once
- Optimize image loading and thumbnails
- Implement lazy loading where possible

### 3. User Experience
- Show loading indicators during API calls
- Provide search suggestions and popular terms
- Implement proper navigation and back button support
- Handle empty states gracefully

### 4. API Integration
- Respect API rate limits
- Use appropriate HTTP headers
- Handle different response formats
- Implement proper authentication if required

## Testing Your Content Provider

1. **Test with different API responses**
2. **Verify error handling with network issues**
3. **Test search functionality with various queries**
4. **Validate pagination and loading states**
5. **Check performance with large datasets**

## Next Steps

- [Video Streaming Tutorial](video-streaming-tutorial.html) - Handle video URL resolution
- [Advanced Plugin Features](../plugin-development/advanced-features.html) - More complex functionality
- [API Reference](../api-reference/) - Complete API documentation

## Troubleshooting

### Common Issues

**API requests failing:**
- Check network connectivity
- Verify API endpoint URLs
- Check for proper error handling

**Content not displaying:**
- Validate JSON parsing
- Check item type handling
- Verify page type settings

**Search not working:**
- Test search API endpoints
- Check query encoding
- Validate search result parsing

**Performance issues:**
- Implement caching
- Optimize API requests
- Use pagination effectively
