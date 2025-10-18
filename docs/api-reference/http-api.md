# HTTP API Reference

Complete reference for HTTP operations in Movian plugins

# Overview

The HTTP API in Movian allows plugins to make HTTP requests to external services, APIs, and web resources. This is essential for content providers, metadata services, and any plugin that needs to communicate with external systems.

## Key Features

- Support for all standard HTTP methods (GET, POST, PUT, DELETE, etc.)
- Custom headers and authentication
- Request/response caching
- SSL/TLS support with optional verification
- Automatic redirect handling
- Form data and JSON payload support
- Error handling and status code access

## Basic Usage

The primary function for HTTP operations is `http.request()`, which is available in the global `http` object within plugin contexts.

# http.request

## http.request

Make HTTP requests to external services

### Syntax

```javascript
http.request(url, options)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL to request. Must start with http:// or https://

#### options (optional)
- **Type:** object
- **Description:** Request configuration options

**Properties:**

- **method** (string) - Default: GET: HTTP method (GET, POST, PUT, DELETE, etc.)
- **headers** (object): HTTP headers as key-value pairs
- **postdata** (string|object|buffer): Data to send in request body
- **args** (object): URL query parameters as key-value pairs
- **debug** (boolean) - Default: false: Enable debug logging for the request
- **noFollow** (boolean) - Default: false: Disable automatic redirect following
- **compression** (boolean) - Default: false: Enable compression for the request
- **noAuth** (boolean) - Default: false: Disable authentication for the request
- **noFail** (boolean) - Default: false: Return content even on HTTP error status
- **verifySSL** (boolean) - Default: false: Verify SSL certificates
- **headRequest** (boolean) - Default: false: Make a HEAD request instead of GET
- **caching** (boolean) - Default: false: Enable response caching
- **cacheTime** (number) - Default: 0: Cache expiration time in seconds

### Returns

**Type:** object

HTTP response object

**Properties:**

- **toString()** (function): Convert response body to string
- **statuscode** (number): HTTP status code
- **headers** (object): Response headers

### Examples

#### Basic GET Request

Simple GET request to fetch data from an API

```javascript
// Basic GET request
var response = http.request('https://api.example.com/data');
var data = JSON.parse(response.toString());
console.log('Response:', data);
```

#### GET Request with Headers

GET request with custom headers

```javascript
// GET request with custom headers
var response = http.request('https://api.example.com/data', {
  headers: {
    'User-Agent': 'Movian Plugin/1.0',
    'Accept': 'application/json',
    'Authorization': 'Bearer your-token-here'
  }
});

if (response.statuscode === 200) {
  var data = JSON.parse(response.toString());
  console.log('Success:', data);
} else {
  console.log('Error:', response.statuscode);
}
```

#### POST Request with JSON Data

POST request sending JSON data

```javascript
// POST request with JSON data
var postData = JSON.stringify({
  title: 'My Movie',
  year: 2023,
  genre: 'Action'
});

var response = http.request('https://api.example.com/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  postdata: postData
});

var result = JSON.parse(response.toString());
console.log('Created:', result);
```

#### POST Request with Form Data

POST request with form-encoded data

```javascript
// POST request with form data
var response = http.request('https://api.example.com/login', {
  method: 'POST',
  postdata: {
    username: 'user@example.com',
    password: 'secretpassword'
  }
});

var loginResult = JSON.parse(response.toString());
if (loginResult.success) {
  console.log('Login successful, token:', loginResult.token);
}
```

#### Request with Query Parameters

GET request with URL query parameters

```javascript
// Request with query parameters
var response = http.request('https://api.themoviedb.org/3/search/movie', {
  args: {
    api_key: 'your-api-key',
    query: 'The Matrix',
    year: '1999',
    page: '1'
  }
});

var searchResults = JSON.parse(response.toString());
console.log('Found movies:', searchResults.results.length);
```

#### Request with Caching

GET request with response caching enabled

```javascript
// Request with caching (cache for 1 hour)
var response = http.request('https://api.example.com/popular-movies', {
  caching: true,
  cacheTime: 3600, // 1 hour in seconds
  headers: {
    'Accept': 'application/json'
  }
});

var movies = JSON.parse(response.toString());
console.log('Popular movies (cached):', movies);
```

#### Error Handling

Proper error handling for HTTP requests

```javascript
// Error handling example
try {
  var response = http.request('https://api.example.com/data', {
    noFail: true, // Don't throw on HTTP errors
    verifySSL: true
  });
  
  if (response.statuscode >= 200 && response.statuscode < 300) {
    var data = JSON.parse(response.toString());
    console.log('Success:', data);
  } else if (response.statuscode === 404) {
    console.log('Resource not found');
  } else if (response.statuscode >= 500) {
    console.log('Server error:', response.statuscode);
  } else {
    console.log('Client error:', response.statuscode);
  }
} catch (error) {
  console.log('Request failed:', error);
}
```



# Best Practices

## Performance Optimization

- Use caching for frequently requested data
- Set appropriate cache expiration times
- Minimize the number of HTTP requests
- Use compression when supported by the server

## Error Handling

- Always check HTTP status codes
- Use the `noFail` option to handle errors gracefully
- Implement retry logic for transient failures
- Log errors appropriately for debugging

## Security

- Use HTTPS whenever possible
- Enable SSL verification in production
- Avoid hardcoding sensitive credentials
- Use proper authentication headers

## Rate Limiting

- Respect API rate limits
- Implement backoff strategies
- Cache responses to reduce API calls
- Use appropriate request intervals

