# Coding Standards and Style Guide

## Overview

This guide establishes coding standards and style conventions for Movian plugin development. Following these standards ensures code consistency, maintainability, and compatibility across the plugin ecosystem.

## JavaScript Coding Standards

### General Principles

- **Consistency**: Follow established patterns throughout your codebase
- **Readability**: Write code that is easy to understand and maintain
- **Simplicity**: Prefer simple, clear solutions over complex ones
- **Performance**: Consider performance implications of your code choices

### Naming Conventions

#### Variables and Functions
```javascript
// Use camelCase for variables and functions
var userName = "john_doe";
var maxRetryCount = 3;

function getUserProfile() {
    // Function implementation
}

function calculateVideoQuality(resolution, bitrate) {
    // Function implementation
}
```

#### Constants
```javascript
// Use UPPER_SNAKE_CASE for constants
var API_BASE_URL = "https://api.example.com";
var MAX_CONCURRENT_REQUESTS = 5;
var DEFAULT_TIMEOUT = 30000;
```

#### Plugin Identifiers
```javascript
// Use lowercase with hyphens for plugin IDs
"id": "my-streaming-service"
"id": "video-metadata-provider"
"id": "custom-ui-theme"
```

### Code Structure

#### Function Organization
```javascript
// Good: Clear function structure with proper error handling
function fetchVideoMetadata(videoId) {
    if (!videoId) {
        throw new Error("Video ID is required");
    }
    
    try {
        var response = http.request(API_BASE_URL + "/videos/" + videoId);
        return parseVideoResponse(response);
    } catch (error) {
        console.error("Failed to fetch video metadata:", error);
        return null;
    }
}

// Bad: No error handling, unclear structure
function fetchVideoMetadata(videoId) {
    var response = http.request(API_BASE_URL + "/videos/" + videoId);
    return response.data.video;
}
```

#### Variable Declarations
```javascript
// Good: Declare variables at the top of their scope
function processVideoList(videos) {
    var processedVideos = [];
    var totalDuration = 0;
    var validVideoCount = 0;
    
    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        if (isValidVideo(video)) {
            processedVideos.push(video);
            totalDuration += video.duration;
            validVideoCount++;
        }
    }
    
    return {
        videos: processedVideos,
        totalDuration: totalDuration,
        count: validVideoCount
    };
}
```

### Error Handling

#### Exception Handling
```javascript
// Good: Comprehensive error handling
function makeApiRequest(url, options) {
    try {
        var response = http.request(url, options);
        
        if (response.statuscode >= 400) {
            throw new Error("HTTP " + response.statuscode + ": " + response.statustext);
        }
        
        return JSON.parse(response.toString());
    } catch (error) {
        console.error("API request failed:", error.message);
        
        // Provide fallback behavior
        if (error.message.indexOf("timeout") !== -1) {
            return { error: "timeout", retry: true };
        }
        
        return { error: "request_failed", retry: false };
    }
}
```

#### Input Validation
```javascript
// Good: Validate inputs early
function createVideoItem(title, url, metadata) {
    // Validate required parameters
    if (!title || typeof title !== "string") {
        throw new Error("Title must be a non-empty string");
    }
    
    if (!url || typeof url !== "string") {
        throw new Error("URL must be a non-empty string");
    }
    
    // Provide defaults for optional parameters
    metadata = metadata || {};
    
    return {
        title: title.trim(),
        url: url,
        duration: metadata.duration || 0,
        thumbnail: metadata.thumbnail || null,
        description: metadata.description || ""
    };
}
```

### Performance Guidelines

#### HTTP Requests
```javascript
// Good: Efficient request handling with caching
var requestCache = {};
var CACHE_DURATION = 300000; // 5 minutes

function getCachedApiData(url) {
    var now = Date.now();
    var cached = requestCache[url];
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
    }
    
    var response = http.request(url);
    var data = JSON.parse(response.toString());
    
    requestCache[url] = {
        data: data,
        timestamp: now
    };
    
    return data;
}
```

#### Memory Management
```javascript
// Good: Clean up resources
function processLargeDataSet(dataUrl) {
    var response = http.request(dataUrl);
    var data = JSON.parse(response.toString());
    
    try {
        var results = [];
        
        for (var i = 0; i < data.items.length; i++) {
            var item = processItem(data.items[i]);
            if (item) {
                results.push(item);
            }
        }
        
        return results;
    } finally {
        // Clean up large objects
        data = null;
    }
}
```

## Plugin Structure Standards

### File Organization
```
my-plugin/
├── plugin.json          # Plugin configuration
├── main.js             # Main plugin entry point
├── lib/                # Utility libraries
│   ├── api.js         # API interaction functions
│   ├── parser.js      # Data parsing utilities
│   └── cache.js       # Caching mechanisms
├── views/             # UI view files
│   ├── main.view      # Main plugin interface
│   ├── settings.view  # Settings interface
│   └── components/    # Reusable UI components
├── assets/            # Static assets
│   ├── icon.png       # Plugin icon
│   └── images/        # Additional images
└── README.md          # Plugin documentation
```

### Plugin Configuration Standards

#### plugin.json Structure
```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "my-streaming-service",
  "file": "main.js",
  "showtimeVersion": "5.0",
  "version": "1.2.3",
  "author": "Developer Name &lt;email@example.com&gt;",
  "title": "My Streaming Service",
  "icon": "assets/icon.png",
  "category": "video",
  "synopsis": "Stream videos from My Service",
  "description": "A comprehensive plugin for streaming videos from My Service with advanced features including search, favorites, and quality selection.",
  "homepage": "https://github.com/developer/my-streaming-service",
  "control": {
    "uriprefixes": ["myservice:"]
  }
}
```

## Code Quality Metrics

### Complexity Guidelines
- **Function Length**: Keep functions under 50 lines when possible
- **Cyclomatic Complexity**: Aim for complexity score under 10
- **Nesting Depth**: Limit nesting to 4 levels maximum
- **Parameter Count**: Functions should have 5 or fewer parameters

### Code Review Checklist

#### Functionality
- [ ] Code implements the intended functionality correctly
- [ ] All edge cases are handled appropriately
- [ ] Error conditions are properly managed
- [ ] Performance considerations are addressed

#### Code Quality
- [ ] Variable and function names are descriptive
- [ ] Code follows established naming conventions
- [ ] Functions are focused and do one thing well
- [ ] Code is properly commented where necessary

#### Plugin Standards
- [ ] plugin.json follows the standard structure
- [ ] File organization follows recommended patterns
- [ ] Dependencies are properly managed
- [ ] Version numbering follows semantic versioning

#### Testing
- [ ] Core functionality has been tested
- [ ] Error conditions have been tested
- [ ] Plugin works across different Movian versions
- [ ] Performance has been validated

## Automated Code Checking

### ESLint Configuration
Create `.eslintrc.json` in your plugin directory:

```json
{
  "env": {
    "es6": false,
    "node": false
  },
  "globals": {
    "console": "readonly",
    "JSON": "readonly",
    "Date": "readonly",
    "http": "readonly",
    "page": "readonly",
    "service": "readonly",
    "settings": "readonly"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": ["error", 4],
    "no-trailing-spaces": "error",
    "eol-last": "error",
    "no-multiple-empty-lines": ["error", { "max": 2 }],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "never"],
    "no-console": "off"
  }
}
```

### Pre-commit Hooks
Add to your development workflow:

```bash
#!/bin/sh
# Pre-commit hook for plugin development

echo "Running code quality checks..."

# Check JavaScript syntax
if ! node -c main.js; then
    echo "JavaScript syntax error detected"
    exit 1
fi

# Validate plugin.json
if ! python -m json.tool plugin.json > /dev/null; then
    echo "Invalid plugin.json format"
    exit 1
fi

# Check for common issues
if grep -r "console.log" *.js; then
    echo "Warning: console.log statements found (consider using console.error for production)"
fi

echo "Code quality checks passed"
```

## Documentation Standards

### Code Comments
```javascript
/**
 * Fetches video metadata from the streaming service API
 * @param {string} videoId - Unique identifier for the video
 * @param {Object} options - Optional parameters for the request
 * @param {boolean} options.includeSubtitles - Whether to include subtitle information
 * @param {string} options.quality - Preferred video quality (low, medium, high)
 * @returns {Object} Video metadata object with title, duration, and streaming URLs
 * @throws {Error} When videoId is invalid or API request fails
 */
function fetchVideoMetadata(videoId, options) {
    options = options || {};
    
    // Validate input parameters
    if (!videoId || typeof videoId !== "string") {
        throw new Error("Invalid video ID provided");
    }
    
    // Build API request URL with parameters
    var apiUrl = buildApiUrl("/videos/" + videoId, {
        subtitles: options.includeSubtitles ? "true" : "false",
        quality: options.quality || "medium"
    });
    
    // Make API request with error handling
    try {
        var response = http.request(apiUrl);
        return parseVideoResponse(response);
    } catch (error) {
        console.error("Failed to fetch video metadata:", error);
        throw new Error("Unable to retrieve video information");
    }
}
```

### README Documentation
Every plugin should include a comprehensive README.md:

```markdown
# My Streaming Service Plugin

## Description
Brief description of what the plugin does and its main features.

## Installation
Instructions for installing and configuring the plugin.

## Configuration
Details about available settings and how to configure them.

## Usage
How to use the plugin once installed.

## Troubleshooting
Common issues and their solutions.

## Development
Information for developers who want to contribute or modify the plugin.

## License
License information and attribution.
```

Following these coding standards will help ensure your plugins are maintainable, performant, and compatible with the Movian ecosystem.