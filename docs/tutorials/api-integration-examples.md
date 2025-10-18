# API Integration Examples

Real-world examples of integrating with different types of APIs in content provider plugins.

## REST API Integration

### Basic REST Client
```javascript
function RestApiClient(baseUrl, options) {
  this.baseUrl = baseUrl;
  this.options = options || {};
  this.defaultHeaders = {
    'User-Agent': 'Movian Plugin/1.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}

RestApiClient.prototype.request = function(endpoint, method, data, headers) {
  var url = this.baseUrl + endpoint;
  var requestOptions = {
    headers: Object.assign({}, this.defaultHeaders, headers || {}),
    method: method || 'GET'
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    requestOptions.postdata = JSON.stringify(data);
  }
  
  if (this.options.timeout) {
    requestOptions.timeout = this.options.timeout;
  }
  
  try {
    var response = http.request(url, requestOptions);
    
    if (response.statuscode >= 200 && response.statuscode < 300) {
      return JSON.parse(response.toString());
    } else {
      throw new Error('HTTP ' + response.statuscode + ': ' + response.statusMessage);
    }
  } catch (error) {
    plugin.log('API request failed: ' + error.message);
    throw error;
  }
};

RestApiClient.prototype.get = function(endpoint, headers) {
  return this.request(endpoint, 'GET', null, headers);
};

RestApiClient.prototype.post = function(endpoint, data, headers) {
  return this.request(endpoint, 'POST', data, headers);
};
```

### Authentication Examples

#### API Key Authentication
```javascript
function ApiKeyClient(baseUrl, apiKey) {
  RestApiClient.call(this, baseUrl);
  this.apiKey = apiKey;
}

ApiKeyClient.prototype = Object.create(RestApiClient.prototype);

ApiKeyClient.prototype.request = function(endpoint, method, data, headers) {
  // Add API key to headers
  headers = headers || {};
  headers['X-API-Key'] = this.apiKey;
  
  return RestApiClient.prototype.request.call(this, endpoint, method, data, headers);
};
```

#### Bearer Token Authentication
```javascript
function BearerTokenClient(baseUrl, token) {
  RestApiClient.call(this, baseUrl);
  this.token = token;
}

BearerTokenClient.prototype = Object.create(RestApiClient.prototype);

BearerTokenClient.prototype.request = function(endpoint, method, data, headers) {
  headers = headers || {};
  headers['Authorization'] = 'Bearer ' + this.token;
  
  return RestApiClient.prototype.request.call(this, endpoint, method, data, headers);
};
```

#### OAuth 2.0 Example
```javascript
function OAuth2Client(baseUrl, clientId, clientSecret) {
  RestApiClient.call(this, baseUrl);
  this.clientId = clientId;
  this.clientSecret = clientSecret;
  this.accessToken = null;
  this.tokenExpiry = 0;
}

OAuth2Client.prototype = Object.create(RestApiClient.prototype);

OAuth2Client.prototype.authenticate = function() {
  var tokenUrl = this.baseUrl + '/oauth/token';
  var authData = {
    grant_type: 'client_credentials',
    client_id: this.clientId,
    client_secret: this.clientSecret
  };
  
  try {
    var response = http.request(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      postdata: Object.keys(authData).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(authData[key]);
      }).join('&')
    });
    
    if (response.statuscode === 200) {
      var tokenData = JSON.parse(response.toString());
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
      return true;
    }
  } catch (error) {
    plugin.log('OAuth authentication failed: ' + error.message);
  }
  
  return false;
};

OAuth2Client.prototype.request = function(endpoint, method, data, headers) {
  // Check if token is expired
  if (!this.accessToken || Date.now() >= this.tokenExpiry) {
    if (!this.authenticate()) {
      throw new Error('Authentication failed');
    }
  }
  
  headers = headers || {};
  headers['Authorization'] = 'Bearer ' + this.accessToken;
  
  return RestApiClient.prototype.request.call(this, endpoint, method, data, headers);
};
```

## GraphQL Integration

### GraphQL Client
```javascript
function GraphQLClient(endpoint, options) {
  this.endpoint = endpoint;
  this.options = options || {};
  this.defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

GraphQLClient.prototype.query = function(query, variables, headers) {
  var requestData = {
    query: query,
    variables: variables || {}
  };
  
  var requestOptions = {
    method: 'POST',
    headers: Object.assign({}, this.defaultHeaders, headers || {}),
    postdata: JSON.stringify(requestData)
  };
  
  try {
    var response = http.request(this.endpoint, requestOptions);
    
    if (response.statuscode === 200) {
      var result = JSON.parse(response.toString());
      
      if (result.errors) {
        throw new Error('GraphQL errors: ' + JSON.stringify(result.errors));
      }
      
      return result.data;
    } else {
      throw new Error('HTTP ' + response.statuscode);
    }
  } catch (error) {
    plugin.log('GraphQL request failed: ' + error.message);
    throw error;
  }
};

// Example usage
var client = new GraphQLClient('https://api.example.com/graphql');

var moviesQuery = `
  query GetMovies($limit: Int, $genre: String) {
    movies(limit: $limit, genre: $genre) {
      id
      title
      description
      releaseDate
      poster
      rating
    }
  }
`;

var movies = client.query(moviesQuery, { limit: 20, genre: 'action' });
```

## RSS/XML Feed Integration

### RSS Parser
```javascript
function RSSParser() {}

RSSParser.prototype.parse = function(xmlContent) {
  var items = [];
  
  try {
    // Extract channel information
    var channelMatch = xmlContent.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    if (!channelMatch) {
      throw new Error('Invalid RSS feed: no channel found');
    }
    
    var channelContent = channelMatch[1];
    
    // Extract items
    var itemMatches = channelContent.match(/<item[^>]*>([\s\S]*?)<\/item>/gi);
    
    if (itemMatches) {
      itemMatches.forEach(function(itemXml) {
        var item = this.parseItem(itemXml);
        if (item) {
          items.push(item);
        }
      }.bind(this));
    }
    
  } catch (error) {
    plugin.log('RSS parsing error: ' + error.message);
    throw error;
  }
  
  return items;
};

RSSParser.prototype.parseItem = function(itemXml) {
  return {
    title: this.extractTag(itemXml, 'title'),
    description: this.extractTag(itemXml, 'description'),
    link: this.extractTag(itemXml, 'link'),
    pubDate: this.extractTag(itemXml, 'pubDate'),
    author: this.extractTag(itemXml, 'author'),
    category: this.extractTag(itemXml, 'category'),
    guid: this.extractTag(itemXml, 'guid'),
    enclosure: this.extractEnclosure(itemXml)
  };
};

RSSParser.prototype.extractTag = function(xml, tagName) {
  var regex = new RegExp('<' + tagName + '[^>]*>([\s\S]*?)<\/' + tagName + '>', 'i');
  var match = xml.match(regex);
  return match ? this.cleanText(match[1]) : null;
};

RSSParser.prototype.extractEnclosure = function(xml) {
  var match = xml.match(/<enclosure[^>]*>/i);
  if (match) {
    var enclosureTag = match[0];
    var url = enclosureTag.match(/url=["']([^"']+)["']/i);
    var type = enclosureTag.match(/type=["']([^"']+)["']/i);
    var length = enclosureTag.match(/length=["']([^"']+)["']/i);
    
    return {
      url: url ? url[1] : null,
      type: type ? type[1] : null,
      length: length ? parseInt(length[1]) : null
    };
  }
  return null;
};

RSSParser.prototype.cleanText = function(text) {
  if (!text) return '';
  
  // Remove CDATA
  text = text.replace(/<![CDATA[(.*?)]]>/g, '$1');
  
  // Clean HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  return text.trim();
};
```

## Rate Limiting and Throttling

### Rate Limiter Implementation
```javascript
function RateLimiter(maxRequests, timeWindow) {
  this.maxRequests = maxRequests;
  this.timeWindow = timeWindow;
  this.requests = [];
}

RateLimiter.prototype.canMakeRequest = function() {
  var now = Date.now();
  
  // Remove old requests outside the time window
  this.requests = this.requests.filter(function(timestamp) {
    return now - timestamp < this.timeWindow;
  }.bind(this));
  
  return this.requests.length < this.maxRequests;
};

RateLimiter.prototype.recordRequest = function() {
  this.requests.push(Date.now());
};

RateLimiter.prototype.waitTime = function() {
  if (this.requests.length === 0) return 0;
  
  var oldestRequest = Math.min.apply(Math, this.requests);
  var waitTime = this.timeWindow - (Date.now() - oldestRequest);
  
  return Math.max(0, waitTime);
};

// Usage example
var rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

function makeRateLimitedRequest(url, options) {
  if (!rateLimiter.canMakeRequest()) {
    var waitTime = rateLimiter.waitTime();
    throw new Error('Rate limit exceeded. Wait ' + Math.ceil(waitTime / 1000) + ' seconds.');
  }
  
  rateLimiter.recordRequest();
  return http.request(url, options);
}
```

## Error Handling and Retry Logic

### Retry with Exponential Backoff
```javascript
function RetryableApiClient(baseUrl, options) {
  RestApiClient.call(this, baseUrl, options);
  this.maxRetries = options.maxRetries || 3;
  this.baseDelay = options.baseDelay || 1000;
}

RetryableApiClient.prototype = Object.create(RestApiClient.prototype);

RetryableApiClient.prototype.request = function(endpoint, method, data, headers) {
  var attempt = 0;
  var lastError;
  
  while (attempt <= this.maxRetries) {
    try {
      return RestApiClient.prototype.request.call(this, endpoint, method, data, headers);
    } catch (error) {
      lastError = error;
      attempt++;
      
      if (attempt <= this.maxRetries) {
        var delay = this.baseDelay * Math.pow(2, attempt - 1);
        plugin.log('Request failed, retrying in ' + delay + 'ms (attempt ' + attempt + ')');
        
        // Simple delay implementation
        var start = Date.now();
        while (Date.now() - start < delay) {
          // Wait
        }
      }
    }
  }
  
  throw lastError;
};
```

## Caching Strategies

### Multi-Level Cache
```javascript
function ApiCache() {
  this.memoryCache = {};
  this.memoryCacheSize = 0;
  this.maxMemorySize = 100; // Max items in memory
  this.defaultTTL = 5 * 60 * 1000; // 5 minutes
}

ApiCache.prototype.get = function(key) {
  var cached = this.memoryCache[key];
  
  if (cached) {
    if (Date.now() < cached.expiry) {
      // Move to front (LRU)
      cached.lastAccessed = Date.now();
      return cached.data;
    } else {
      // Expired
      delete this.memoryCache[key];
      this.memoryCacheSize--;
    }
  }
  
  return null;
};

ApiCache.prototype.set = function(key, data, ttl) {
  ttl = ttl || this.defaultTTL;
  
  // Remove oldest items if cache is full
  if (this.memoryCacheSize >= this.maxMemorySize) {
    this.evictOldest();
  }
  
  this.memoryCache[key] = {
    data: data,
    expiry: Date.now() + ttl,
    lastAccessed: Date.now()
  };
  
  this.memoryCacheSize++;
};

ApiCache.prototype.evictOldest = function() {
  var oldestKey = null;
  var oldestTime = Date.now();
  
  for (var key in this.memoryCache) {
    if (this.memoryCache[key].lastAccessed < oldestTime) {
      oldestTime = this.memoryCache[key].lastAccessed;
      oldestKey = key;
    }
  }
  
  if (oldestKey) {
    delete this.memoryCache[oldestKey];
    this.memoryCacheSize--;
  }
};

// Usage
var cache = new ApiCache();

function cachedApiRequest(endpoint) {
  var cached = cache.get(endpoint);
  if (cached) {
    return cached;
  }
  
  var data = makeApiRequest(endpoint);
  cache.set(endpoint, data);
  return data;
}
```

These examples provide a solid foundation for integrating with various types of APIs in your content provider plugins. Remember to always handle errors gracefully and respect API rate limits and terms of service.
