# Video Streaming Plugin Tutorial

## Overview

This comprehensive tutorial covers building advanced video streaming plugins for Movian, including sophisticated URL resolution techniques, robust authentication systems, and support for multiple streaming protocols. You'll learn to handle complex scenarios like encrypted streams, multi-quality video sources, and user session management.

## Prerequisites

- Solid understanding of JavaScript and Movian plugin architecture
- Experience with HTTP requests, JSON parsing, and asynchronous programming
- Knowledge of video streaming concepts (HLS, DASH, MP4)
- Understanding of web authentication mechanisms

## Table of Contents

1. [Basic Plugin Structure](#basic-plugin-structure)
2. [Advanced URL Resolution](#advanced-url-resolution)
3. [Streaming Protocol Support](#streaming-protocol-support)
4. [Authentication and Session Management](#authentication-and-session-management)
5. [Error Handling and Fallbacks](#error-handling-and-fallbacks)
6. [Advanced Features](#advanced-features)
7. [Performance Optimization](#performance-optimization)
8. [Security Best Practices](#security-best-practices)

## Basic Plugin Structure

### Plugin Configuration

```json
{
    "type": "ecmascript",
    "apiversion": 2,
    "id": "advanced-video-streaming",
    "file": "main.js",
    "showtimeVersion": "5.0",
    "version": "2.0.0",
    "author": "Your Name",
    "title": "Advanced Video Streaming",
    "icon": "icon.png",
    "category": "video",
    "synopsis": "Advanced video streaming with multi-protocol support",
    "description": "Comprehensive video streaming plugin with HLS, DASH, and MP4 support, authentication, and quality selection",
    "homepage": "https://github.com/yourname/advanced-video-plugin",
    "control": {
        "uriprefixes": ["advstream:"]
    }
}
```

### Core Plugin Structure

```javascript
// Import required Movian modules
var page = require('movian/page');
var service = require('movian/service');
var http = require('movian/http');
var html = require('movian/html');
var popup = require('movian/popup');
var store = require('movian/store');

// Plugin metadata and configuration
var plugin = JSON.parse(Plugin.manifest);
var PREFIX = plugin.id;
var LOGO = Plugin.path + plugin.icon;
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Global state management
var globalState = {
    authToken: null,
    sessionCookies: {},
    userAgent: UA,
    requestTimeout: 30000,
    maxRetries: 3
};

// Service registration
service.create(plugin.title, PREFIX + ':start', 'video', true, LOGO);

// Main entry point
new page.Route(PREFIX + ':start', function(page) {
    page.type = 'directory';
    page.metadata.title = plugin.title;
    page.metadata.logo = LOGO;
    
    initializePlugin(page);
});
```

## Advanced URL Resolution

### Multi-Pattern URL Extraction

```javascript
function resolveVideoUrl(sourceUrl, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    
    var resolvers = [
        resolveFromJSON,
        resolveFromJavaScript,
        resolveFromHTML5Video,
        resolveFromEmbeddedPlayer,
        resolveFromM3U8Playlist,
        resolveFromDASHManifest
    ];
    
    var attempts = 0;
    var maxAttempts = resolvers.length;
    
    function tryNextResolver() {
        if (attempts >= maxAttempts) {
            callback(new Error('All URL resolution methods failed'), null);
            return;
        }
        
        var resolver = resolvers[attempts++];
        resolver(sourceUrl, options, function(err, result) {
            if (err || !result) {
                tryNextResolver();
                return;
            }
            
            callback(null, result);
        });
    }
    
    tryNextResolver();
}

function resolveFromJSON(sourceUrl, options, callback) {
    makeRequest(sourceUrl, options, function(err, content) {
        if (err) {
            callback(err, null);
            return;
        }
        
        try {
            // Look for JSON data in various formats
            var patterns = [
                /var\s+videoData\s*=\s*({.*?});/,
                /window\.videoConfig\s*=\s*({.*?});/,
                /"videoUrl"\s*:\s*"([^"]+)"/,
                /"sources"\s*:\s*(\[.*?\])/
            ];
            
            for (var i = 0; i < patterns.length; i++) {
                var match = content.match(patterns[i]);
                if (match) {
                    if (i < 2) {
                        // Full JSON object
                        var data = JSON.parse(match[1]);
                        var url = extractUrlFromObject(data);
                        if (url) {
                            callback(null, { url: url, type: 'json', quality: 'auto' });
                            return;
                        }
                    } else if (i === 2) {
                        // Direct URL
                        callback(null, { url: match[1], type: 'direct', quality: 'auto' });
                        return;
                    } else {
                        // Sources array
                        var sources = JSON.parse(match[1]);
                        var bestSource = selectBestSource(sources);
                        if (bestSource) {
                            callback(null, bestSource);
                            return;
                        }
                    }
                }
            }
            
            callback(new Error('No JSON video data found'), null);
        } catch (e) {
            callback(e, null);
        }
    });
}

function resolveFromJavaScript(sourceUrl, options, callback) {
    makeRequest(sourceUrl, options, function(err, content) {
        if (err) {
            callback(err, null);
            return;
        }
        
        try {
            // Advanced JavaScript parsing patterns
            var jsPatterns = [
                /atob\s*\(\s*["']([^"']+)["']\s*\)/g, // Base64 encoded URLs
                /decodeURIComponent\s*\(\s*["']([^"']+)["']\s*\)/g, // URL encoded
                /\\x([0-9a-fA-F]{2})/g, // Hex encoded strings
                /eval\s*\(\s*["']([^"']+)["']\s*\)/g // Eval statements
            ];
            
            var decodedContent = content;
            
            // Apply decoders
            jsPatterns.forEach(function(pattern, index) {
                var matches = decodedContent.match(pattern);
                if (matches) {
                    matches.forEach(function(match) {
                        var encoded = match.match(pattern)[1];
                        var decoded = '';
                        
                        switch (index) {
                            case 0: // Base64
                                try {
                                    decoded = atob(encoded);
                                } catch (e) { /* ignore */ }
                                break;
                            case 1: // URL encoded
                                decoded = decodeURIComponent(encoded);
                                break;
                            case 2: // Hex encoded
                                decoded = encoded.replace(/\\x([0-9a-fA-F]{2})/g, function(match, hex) {
                                    return String.fromCharCode(parseInt(hex, 16));
                                });
                                break;
                        }
                        
                        if (decoded) {
                            decodedContent += '\n' + decoded;
                        }
                    });
                }
            });
            
            // Look for video URLs in decoded content
            var urlPatterns = [
                /https?:\/\/[^\s"']+\.(?:mp4|m3u8|mpd)[^\s"']*/g,
                /"(https?:\/\/[^"]+\.(?:mp4|m3u8|mpd)[^"]*)"/g,
                /'(https?:\/\/[^']+\.(?:mp4|m3u8|mpd)[^']*)'/g
            ];
            
            for (var i = 0; i < urlPatterns.length; i++) {
                var matches = decodedContent.match(urlPatterns[i]);
                if (matches && matches.length > 0) {
                    var url = matches[0].replace(/['"]/g, '');
                    callback(null, { 
                        url: url, 
                        type: getStreamType(url), 
                        quality: 'auto' 
                    });
                    return;
                }
            }
            
            callback(new Error('No JavaScript video URLs found'), null);
        } catch (e) {
            callback(e, null);
        }
    });
}

function resolveFromHTML5Video(sourceUrl, options, callback) {
    makeRequest(sourceUrl, options, function(err, content) {
        if (err) {
            callback(err, null);
            return;
        }
        
        try {
            // Parse HTML5 video elements
            var videoMatches = content.match(/<video[^>]*>.*?<\/video>/gis);
            if (videoMatches) {
                for (var i = 0; i < videoMatches.length; i++) {
                    var videoElement = videoMatches[i];
                    
                    // Check for src attribute
                    var srcMatch = videoElement.match(/src\s*=\s*["']([^"']+)["']/i);
                    if (srcMatch) {
                        callback(null, { 
                            url: srcMatch[1], 
                            type: getStreamType(srcMatch[1]), 
                            quality: 'auto' 
                        });
                        return;
                    }
                    
                    // Check for source elements
                    var sourceMatches = videoElement.match(/<source[^>]*>/gi);
                    if (sourceMatches) {
                        var sources = [];
                        sourceMatches.forEach(function(source) {
                            var srcMatch = source.match(/src\s*=\s*["']([^"']+)["']/i);
                            var typeMatch = source.match(/type\s*=\s*["']([^"']+)["']/i);
                            var labelMatch = source.match(/label\s*=\s*["']([^"']+)["']/i);
                            
                            if (srcMatch) {
                                sources.push({
                                    url: srcMatch[1],
                                    type: typeMatch ? typeMatch[1] : getStreamType(srcMatch[1]),
                                    quality: labelMatch ? labelMatch[1] : 'auto'
                                });
                            }
                        });
                        
                        if (sources.length > 0) {
                            var bestSource = selectBestSource(sources);
                            callback(null, bestSource);
                            return;
                        }
                    }
                }
            }
            
            callback(new Error('No HTML5 video sources found'), null);
        } catch (e) {
            callback(e, null);
        }
    });
}
```

## Streaming Protocol Support

### HLS (HTTP Live Streaming) Advanced Support

```javascript
function parseHLSPlaylist(playlistUrl, callback) {
    makeRequest(playlistUrl, {}, function(err, content) {
        if (err) {
            callback(err, null);
            return;
        }
        
        try {
            var lines = content.split('\n').map(function(line) { return line.trim(); });
            var streams = [];
            var currentStream = null;
            var isVariantPlaylist = false;
            
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                
                if (line.startsWith('#EXTM3U')) {
                    continue;
                } else if (line.startsWith('#EXT-X-VERSION:')) {
                    continue;
                } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
                    isVariantPlaylist = true;
                    currentStream = parseStreamInfo(line);
                } else if (line.startsWith('#EXT-X-MEDIA:')) {
                    // Handle audio/subtitle tracks
                    var mediaInfo = parseMediaInfo(line);
                    if (mediaInfo.type === 'AUDIO' || mediaInfo.type === 'SUBTITLES') {
                        // Store for later use
                    }
                } else if (line && !line.startsWith('#')) {
                    if (isVariantPlaylist && currentStream) {
                        currentStream.url = resolveRelativeUrl(playlistUrl, line);
                        streams.push(currentStream);
                        currentStream = null;
                    } else if (!isVariantPlaylist) {
                        // This is a media playlist, return the URL directly
                        callback(null, [{
                            url: playlistUrl,
                            bandwidth: 0,
                            resolution: 'auto',
                            codecs: 'unknown',
                            type: 'hls'
                        }]);
                        return;
                    }
                }
            }
            
            if (streams.length === 0 && !isVariantPlaylist) {
                // Fallback: treat as direct playlist
                streams.push({
                    url: playlistUrl,
                    bandwidth: 0,
                    resolution: 'auto',
                    codecs: 'unknown',
                    type: 'hls'
                });
            }
            
            // Sort streams by bandwidth (highest first)
            streams.sort(function(a, b) { return b.bandwidth - a.bandwidth; });
            
            callback(null, streams);
        } catch (e) {
            callback(e, null);
        }
    });
}

function parseStreamInfo(line) {
    var stream = {
        bandwidth: 0,
        resolution: 'unknown',
        codecs: 'unknown',
        frameRate: null,
        type: 'hls'
    };
    
    // Parse BANDWIDTH
    var bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
    if (bandwidthMatch) {
        stream.bandwidth = parseInt(bandwidthMatch[1]);
    }
    
    // Parse RESOLUTION
    var resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
    if (resolutionMatch) {
        stream.resolution = resolutionMatch[1];
    }
    
    // Parse CODECS
    var codecsMatch = line.match(/CODECS="([^"]+)"/);
    if (codecsMatch) {
        stream.codecs = codecsMatch[1];
    }
    
    // Parse FRAME-RATE
    var frameRateMatch = line.match(/FRAME-RATE=([\d.]+)/);
    if (frameRateMatch) {
        stream.frameRate = parseFloat(frameRateMatch[1]);
    }
    
    return stream;
}
```

### DASH (Dynamic Adaptive Streaming) Support

```javascript
function parseDASHManifest(manifestUrl, callback) {
    makeRequest(manifestUrl, {}, function(err, content) {
        if (err) {
            callback(err, null);
            return;
        }
        
        try {
            // Parse XML content (simplified XML parsing)
            var representations = [];
            
            // Extract AdaptationSet elements
            var adaptationSets = extractXMLElements(content, 'AdaptationSet');
            
            adaptationSets.forEach(function(adaptationSet) {
                var mimeType = extractXMLAttribute(adaptationSet, 'mimeType');
                
                if (mimeType && mimeType.startsWith('video/')) {
                    var reps = extractXMLElements(adaptationSet, 'Representation');
                    
                    reps.forEach(function(rep) {
                        var representation = {
                            id: extractXMLAttribute(rep, 'id'),
                            bandwidth: parseInt(extractXMLAttribute(rep, 'bandwidth')) || 0,
                            width: parseInt(extractXMLAttribute(rep, 'width')) || 0,
                            height: parseInt(extractXMLAttribute(rep, 'height')) || 0,
                            codecs: extractXMLAttribute(rep, 'codecs'),
                            mimeType: mimeType,
                            type: 'dash'
                        };
                        
                        representation.resolution = representation.width + 'x' + representation.height;
                        representation.url = manifestUrl; // DASH uses the manifest URL
                        
                        representations.push(representation);
                    });
                }
            });
            
            // Sort by bandwidth (highest first)
            representations.sort(function(a, b) { return b.bandwidth - a.bandwidth; });
            
            callback(null, representations);
        } catch (e) {
            callback(e, null);
        }
    });
}

function extractXMLElements(content, tagName) {
    var regex = new RegExp('<' + tagName + '[^>]*>.*?<\/' + tagName + '>', 'gis');
    var matches = content.match(regex);
    return matches || [];
}

function extractXMLAttribute(element, attributeName) {
    var regex = new RegExp(attributeName + '\s*=\s*["']([^"']*)["']', 'i');
    var match = element.match(regex);
    return match ? match[1] : null;
}
```

### Multi-Quality MP4 Support

```javascript
function parseMP4Sources(content, baseUrl) {
    var sources = [];
    
    // Pattern 1: Data attributes
    var dataMatches = content.match(/data-quality\s*=\s*["']([^"']+)["'][^>]*data-url\s*=\s*["']([^"']+)["']/gi);
    if (dataMatches) {
        dataMatches.forEach(function(match) {
            var qualityMatch = match.match(/data-quality\s*=\s*["']([^"']+)["']/i);
            var urlMatch = match.match(/data-url\s*=\s*["']([^"']+)["']/i);
            
            if (qualityMatch && urlMatch) {
                sources.push({
                    quality: qualityMatch[1],
                    url: resolveRelativeUrl(baseUrl, urlMatch[1]),
                    type: 'mp4',
                    bandwidth: qualityToBandwidth(qualityMatch[1])
                });
            }
        });
    }
    
    // Pattern 2: JSON configuration
    var jsonMatches = content.match(/sources\s*:\s*(\[.*?\])/gi);
    if (jsonMatches) {
        jsonMatches.forEach(function(match) {
            try {
                var sourcesMatch = match.match(/sources\s*:\s*(\[.*?\])/i);
                if (sourcesMatch) {
                    var sourcesArray = JSON.parse(sourcesMatch[1]);
                    sourcesArray.forEach(function(source) {
                        if (source.file || source.src) {
                            sources.push({
                                quality: source.label || source.quality || 'auto',
                                url: resolveRelativeUrl(baseUrl, source.file || source.src),
                                type: source.type || 'mp4',
                                bandwidth: qualityToBandwidth(source.label || source.quality)
                            });
                        }
                    });
                }
            } catch (e) {
                // Ignore JSON parsing errors
            }
        });
    }
    
    // Pattern 3: Select options
    var selectMatches = content.match(/<select[^>]*quality[^>]*>.*?<\/select>/gis);
    if (selectMatches) {
        selectMatches.forEach(function(select) {
            var optionMatches = select.match(/<option[^>]*value\s*=\s*["']([^"']+)["'][^>]*>([^<]+)<\/option>/gi);
            if (optionMatches) {
                optionMatches.forEach(function(option) {
                    var valueMatch = option.match(/value\s*=\s*["']([^"']+)["']/i);
                    var textMatch = option.match(/>([^<]+)</);
                    
                    if (valueMatch && textMatch) {
                        sources.push({
                            quality: textMatch[1].trim(),
                            url: resolveRelativeUrl(baseUrl, valueMatch[1]),
                            type: 'mp4',
                            bandwidth: qualityToBandwidth(textMatch[1])
                        });
                    }
                });
            }
        });
    }
    
    // Remove duplicates and sort by quality
    sources = removeDuplicateSources(sources);
    sources.sort(function(a, b) { return b.bandwidth - a.bandwidth; });
    
    return sources;
}

function qualityToBandwidth(quality) {
    var qualityMap = {
        '2160p': 25000000, '4K': 25000000,
        '1440p': 16000000, '2K': 16000000,
        '1080p': 8000000, 'FHD': 8000000,
        '720p': 5000000, 'HD': 5000000,
        '480p': 2500000, 'SD': 2500000,
        '360p': 1000000,
        '240p': 500000,
        '144p': 250000
    };
    
    for (var key in qualityMap) {
        if (quality.toLowerCase().includes(key.toLowerCase())) {
            return qualityMap[key];
        }
    }
    
    // Extract numeric quality
    var numMatch = quality.match(/(\d+)/);
    if (numMatch) {
        var num = parseInt(numMatch[1]);
        if (num >= 2000) return 25000000;
        if (num >= 1400) return 16000000;
        if (num >= 1000) return 8000000;
        if (num >= 700) return 5000000;
        if (num >= 400) return 2500000;
        return 1000000;
    }
    
    return 0;
}
```

## Authentication and Session Management

### Advanced Authentication Patterns

```javascript
var AuthManager = {
    authState: {
        token: null,
        refreshToken: null,
        cookies: {},
        expiresAt: null,
        userId: null
    },
    
    initialize: function() {
        this.loadAuthState();
        this.setupTokenRefresh();
    },
    
    authenticate: function(credentials, callback) {
        var self = this;
        var authUrl = 'https://api.example.com/auth/login';
        
        var requestData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': globalState.userAgent
            },
            postdata: JSON.stringify(credentials),
            noFail: true
        };
        
        http.request(authUrl, requestData, function(err, result, headers) {
            if (err) {
                callback(err, null);
                return;
            }
            
            try {
                var response = JSON.parse(result);
                
                if (response.success || response.access_token) {
                    self.authState.token = response.access_token || response.token;
                    self.authState.refreshToken = response.refresh_token;
                    self.authState.expiresAt = Date.now() + (response.expires_in * 1000);
                    self.authState.userId = response.user_id;
                    
                    // Handle cookies
                    if (headers['set-cookie']) {
                        self.processCookies(headers['set-cookie']);
                    }
                    
                    self.saveAuthState();
                    callback(null, self.authState);
                } else {
                    callback(new Error(response.message || 'Authentication failed'), null);
                }
            } catch (e) {
                callback(e, null);
            }
        });
    },
    
    refreshAccessToken: function(callback) {
        var self = this;
        
        if (!this.authState.refreshToken) {
            callback(new Error('No refresh token available'), null);
            return;
        }
        
        var refreshUrl = 'https://api.example.com/auth/refresh';
        var requestData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.authState.refreshToken,
                'User-Agent': globalState.userAgent
            },
            noFail: true
        };
        
        http.request(refreshUrl, requestData, function(err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            
            try {
                var response = JSON.parse(result);
                
                if (response.access_token) {
                    self.authState.token = response.access_token;
                    self.authState.expiresAt = Date.now() + (response.expires_in * 1000);
                    self.saveAuthState();
                    callback(null, self.authState.token);
                } else {
                    callback(new Error('Token refresh failed'), null);
                }
            } catch (e) {
                callback(e, null);
            }
        });
    },
    
    makeAuthenticatedRequest: function(url, options, callback) {
        var self = this;
        
        // Check if token needs refresh
        if (this.authState.token && this.authState.expiresAt && 
            Date.now() > (this.authState.expiresAt - 300000)) { // Refresh 5 minutes before expiry
            
            this.refreshAccessToken(function(err, newToken) {
                if (err) {
                    callback(err, null);
                    return;
                }
                
                self.executeAuthenticatedRequest(url, options, callback);
            });
        } else {
            this.executeAuthenticatedRequest(url, options, callback);
        }
    },
    
    executeAuthenticatedRequest: function(url, options, callback) {
        options = options || {};
        options.headers = options.headers || {};
        
        // Add authentication headers
        if (this.authState.token) {
            options.headers['Authorization'] = 'Bearer ' + this.authState.token;
        }
        
        // Add cookies
        if (Object.keys(this.authState.cookies).length > 0) {
            var cookieString = Object.keys(this.authState.cookies)
                .map(function(key) { 
                    return key + '=' + this.authState.cookies[key]; 
                }, this)
                .join('; ');
            options.headers['Cookie'] = cookieString;
        }
        
        options.headers['User-Agent'] = globalState.userAgent;
        options.noFail = true;
        
        http.request(url, options, function(err, result, headers) {
            if (err) {
                callback(err, null);
                return;
            }
            
            // Check for authentication errors
            if (result.includes('unauthorized') || result.includes('invalid_token')) {
                callback(new Error('Authentication required'), null);
                return;
            }
            
            callback(null, result, headers);
        });
    },
    
    processCookies: function(setCookieHeaders) {
        var self = this;
        setCookieHeaders.forEach(function(cookie) {
            var parts = cookie.split(';')[0].split('=');
            if (parts.length === 2) {
                self.authState.cookies[parts[0].trim()] = parts[1].trim();
            }
        });
    },
    
    saveAuthState: function() {
        try {
            store.set('authState', JSON.stringify(this.authState));
        } catch (e) {
            console.log('Failed to save auth state:', e.message);
        }
    },
    
    loadAuthState: function() {
        try {
            var stored = store.get('authState');
            if (stored) {
                this.authState = JSON.parse(stored);
            }
        } catch (e) {
            console.log('Failed to load auth state:', e.message);
            this.clearAuthState();
        }
    },
    
    clearAuthState: function() {
        this.authState = {
            token: null,
            refreshToken: null,
            cookies: {},
            expiresAt: null,
            userId: null
        };
        this.saveAuthState();
    },
    
    setupTokenRefresh: function() {
        // This would set up automatic token refresh
        // Implementation depends on Movian's timer capabilities
    }
};
```

## Error Handling and Fallbacks

### Comprehensive Error Handling System

```javascript
var ErrorHandler = {
    errorTypes: {
        NETWORK_ERROR: 'network',
        AUTH_ERROR: 'authentication',
        PARSE_ERROR: 'parsing',
        STREAM_ERROR: 'streaming',
        TIMEOUT_ERROR: 'timeout'
    },
    
    handleError: function(error, context, callback) {
        var errorInfo = this.analyzeError(error, context);
        
        switch (errorInfo.type) {
            case this.errorTypes.NETWORK_ERROR:
                this.handleNetworkError(errorInfo, callback);
                break;
            case this.errorTypes.AUTH_ERROR:
                this.handleAuthError(errorInfo, callback);
                break;
            case this.errorTypes.STREAM_ERROR:
                this.handleStreamError(errorInfo, callback);
                break;
            case this.errorTypes.TIMEOUT_ERROR:
                this.handleTimeoutError(errorInfo, callback);
                break;
            default:
                this.handleGenericError(errorInfo, callback);
        }
    },
    
    analyzeError: function(error, context) {
        var errorInfo = {
            originalError: error,
            context: context,
            type: 'unknown',
            severity: 'medium',
            retryable: false,
            userMessage: 'An error occurred'
        };
        
        var message = error.message || error.toString();
        
        if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
            errorInfo.type = this.errorTypes.TIMEOUT_ERROR;
            errorInfo.retryable = true;
            errorInfo.userMessage = 'Request timed out. Retrying...';
        } else if (message.includes('unauthorized') || message.includes('authentication')) {
            errorInfo.type = this.errorTypes.AUTH_ERROR;
            errorInfo.severity = 'high';
            errorInfo.userMessage = 'Authentication required. Please login.';
        } else if (message.includes('network') || message.includes('connection')) {
            errorInfo.type = this.errorTypes.NETWORK_ERROR;
            errorInfo.retryable = true;
            errorInfo.userMessage = 'Network error. Checking connection...';
        } else if (message.includes('parse') || message.includes('JSON')) {
            errorInfo.type = this.errorTypes.PARSE_ERROR;
            errorInfo.userMessage = 'Failed to parse server response.';
        } else if (message.includes('stream') || message.includes('video')) {
            errorInfo.type = this.errorTypes.STREAM_ERROR;
            errorInfo.retryable = true;
            errorInfo.userMessage = 'Video streaming error. Trying alternative source...';
        }
        
        return errorInfo;
    },
    
    handleNetworkError: function(errorInfo, callback) {
        var self = this;
        var retryCount = errorInfo.context.retryCount || 0;
        var maxRetries = globalState.maxRetries;
        
        if (retryCount < maxRetries) {
            var delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
            
            setTimeout(function() {
                errorInfo.context.retryCount = retryCount + 1;
                callback(null, { retry: true, delay: delay });
            }, delay);
        } else {
            callback(errorInfo, null);
        }
    },
    
    handleAuthError: function(errorInfo, callback) {
        // Clear auth state and redirect to login
        AuthManager.clearAuthState();
        callback(errorInfo, { requiresAuth: true });
    },
    
    handleStreamError: function(errorInfo, callback) {
        var context = errorInfo.context;
        
        if (context.alternativeSources && context.alternativeSources.length > 0) {
            var nextSource = context.alternativeSources.shift();
            callback(null, { useAlternative: true, source: nextSource });
        } else {
            callback(errorInfo, null);
        }
    },
    
    handleTimeoutError: function(errorInfo, callback) {
        // Increase timeout and retry
        globalState.requestTimeout = Math.min(globalState.requestTimeout * 1.5, 60000);
        this.handleNetworkError(errorInfo, callback);
    },
    
    handleGenericError: function(errorInfo, callback) {
        callback(errorInfo, null);
    }
};

function makeRobustRequest(url, options, callback) {
    var context = {
        url: url,
        options: options,
        retryCount: 0,
        startTime: Date.now()
    };
    
    function attemptRequest() {
        var requestOptions = Object.assign({}, options);
        requestOptions.timeout = globalState.requestTimeout;
        
        http.request(url, requestOptions, function(err, result, headers) {
            if (err) {
                ErrorHandler.handleError(err, context, function(handlerErr, action) {
                    if (action && action.retry) {
                        setTimeout(attemptRequest, action.delay || 1000);
                    } else if (action && action.requiresAuth) {
                        callback(new Error('Authentication required'), null);
                    } else {
                        callback(handlerErr || err, null);
                    }
                });
            } else {
                callback(null, result, headers);
            }
        });
    }
    
    attemptRequest();
}
```

## Advanced Features

### Quality Selection and Adaptive Streaming

```javascript
var QualityManager = {
    userPreferences: {
        preferredQuality: 'auto',
        maxBandwidth: null,
        adaptiveStreaming: true
    },
    
    selectOptimalQuality: function(sources, networkInfo) {
        if (!sources || sources.length === 0) {
            return null;
        }
        
        // Sort sources by quality/bandwidth
        var sortedSources = sources.slice().sort(function(a, b) {
            return b.bandwidth - a.bandwidth;
        });
        
        // Auto quality selection based on network conditions
        if (this.userPreferences.preferredQuality === 'auto') {
            return this.selectBasedOnNetwork(sortedSources, networkInfo);
        }
        
        // User-specified quality
        var preferredSource = this.findQualityMatch(sortedSources, this.userPreferences.preferredQuality);
        return preferredSource || sortedSources[0];
    },
    
    selectBasedOnNetwork: function(sources, networkInfo) {
        var estimatedBandwidth = networkInfo ? networkInfo.bandwidth : 5000000; // Default 5 Mbps
        
        // Select highest quality that fits within bandwidth constraints
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (source.bandwidth <= estimatedBandwidth * 0.8) { // Use 80% of available bandwidth
                return source;
            }
        }
        
        // Fallback to lowest quality
        return sources[sources.length - 1];
    },
    
    findQualityMatch: function(sources, targetQuality) {
        // Exact match
        for (var i = 0; i < sources.length; i++) {
            if (sources[i].quality === targetQuality) {
                return sources[i];
            }
        }
        
        // Partial match
        for (var i = 0; i < sources.length; i++) {
            if (sources[i].quality.toLowerCase().includes(targetQuality.toLowerCase())) {
                return sources[i];
            }
        }
        
        return null;
    },
    
    createQualitySelector: function(page, sources, videoData) {
        var self = this;
        
        // Add auto quality option
        page.appendItem(PREFIX + ':play:' + encodeURIComponent(JSON.stringify({
            url: sources[0].url,
            title: videoData.title,
            quality: 'auto',
            sources: sources
        })), 'video', {
            title: 'Auto Quality (Recommended)',
            icon: videoData.thumbnail || LOGO
        });
        
        page.appendItem('', 'separator');
        
        // Add individual quality options
        sources.forEach(function(source) {
            var qualityInfo = self.getQualityDisplayInfo(source);
            
            page.appendItem(PREFIX + ':play:' + encodeURIComponent(JSON.stringify({
                url: source.url,
                title: videoData.title,
                quality: source.quality,
                bandwidth: source.bandwidth
            })), 'video', {
                title: qualityInfo.title,
                icon: videoData.thumbnail || LOGO,
                description: qualityInfo.description
            });
        });
    },
    
    getQualityDisplayInfo: function(source) {
        var bandwidth = source.bandwidth;
        var bandwidthMbps = (bandwidth / 1000000).toFixed(1);
        
        return {
            title: source.quality + ' (' + source.type.toUpperCase() + ')',
            description: 'Bitrate: ' + bandwidthMbps + ' Mbps' + 
                        (source.resolution ? ' • Resolution: ' + source.resolution : '') +
                        (source.codecs ? ' • Codecs: ' + source.codecs : '')
        };
    }
};
```

### Subtitle and Caption Support

```javascript
var SubtitleManager = {
    supportedFormats: ['srt', 'vtt', 'ass', 'ssa', 'sub'],
    
    loadSubtitles: function(videoData, callback) {
        var self = this;
        var subtitleSources = [];
        
        // Check for embedded subtitles in video data
        if (videoData.subtitles && videoData.subtitles.length > 0) {
            videoData.subtitles.forEach(function(sub) {
                subtitleSources.push({
                    language: sub.language || 'unknown',
                    url: sub.url,
                    format: sub.format || self.detectSubtitleFormat(sub.url),
                    label: sub.label || sub.language || 'Unknown'
                });
            });
        }
        
        // Try to find external subtitles
        this.findExternalSubtitles(videoData.url, function(err, externalSubs) {
            if (!err && externalSubs) {
                subtitleSources = subtitleSources.concat(externalSubs);
            }
            
            // Remove duplicates
            subtitleSources = self.removeDuplicateSubtitles(subtitleSources);
            
            callback(null, subtitleSources);
        });
    },
    
    findExternalSubtitles: function(videoUrl, callback) {
        var self = this;
        var subtitleSources = [];
        var baseUrl = videoUrl.replace(/\.[^.]+$/, '');
        
        var languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];
        var formats = this.supportedFormats;
        
        var checkCount = 0;
        var totalChecks = languages.length * formats.length;
        
        languages.forEach(function(lang) {
            formats.forEach(function(format) {
                var subtitleUrl = baseUrl + '.' + lang + '.' + format;
                
                http.request(subtitleUrl, { 
                    method: 'HEAD', 
                    noFail: true,
                    timeout: 5000
                }, function(err, result, headers) {
                    checkCount++;
                    
                    if (!err && headers && headers['content-length'] && 
                        parseInt(headers['content-length']) > 0) {
                        subtitleSources.push({
                            language: lang,
                            url: subtitleUrl,
                            format: format,
                            label: self.getLanguageName(lang) + ' (' + format.toUpperCase() + ')'
                        });
                    }
                    
                    if (checkCount === totalChecks) {
                        callback(null, subtitleSources);
                    }
                });
            });
        });
        
        // Timeout fallback
        setTimeout(function() {
            if (checkCount < totalChecks) {
                callback(null, subtitleSources);
            }
        }, 10000);
    },
    
    detectSubtitleFormat: function(url) {
        var extension = url.split('.').pop().toLowerCase();
        return this.supportedFormats.includes(extension) ? extension : 'srt';
    },
    
    getLanguageName: function(code) {
        var languageMap = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean'
        };
        
        return languageMap[code] || code.toUpperCase();
    },
    
    removeDuplicateSubtitles: function(subtitles) {
        var seen = {};
        return subtitles.filter(function(sub) {
            var key = sub.language + '_' + sub.format;
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        });
    }
};
```

## Performance Optimization

### Caching and Request Optimization

```javascript
var CacheManager = {
    cache: {},
    maxCacheSize: 100,
    cacheTimeout: 300000, // 5 minutes
    
    get: function(key) {
        var item = this.cache[key];
        if (!item) {
            return null;
        }
        
        if (Date.now() > item.expires) {
            delete this.cache[key];
            return null;
        }
        
        item.lastAccessed = Date.now();
        return item.data;
    },
    
    set: function(key, data, ttl) {
        // Clean cache if it's getting too large
        if (Object.keys(this.cache).length >= this.maxCacheSize) {
            this.cleanup();
        }
        
        this.cache[key] = {
            data: data,
            expires: Date.now() + (ttl || this.cacheTimeout),
            lastAccessed: Date.now()
        };
    },
    
    cleanup: function() {
        var now = Date.now();
        var items = Object.keys(this.cache).map(function(key) {
            return {
                key: key,
                lastAccessed: this.cache[key].lastAccessed
            };
        }, this);
        
        // Sort by last accessed time
        items.sort(function(a, b) {
            return a.lastAccessed - b.lastAccessed;
        });
        
        // Remove oldest 25% of items
        var removeCount = Math.floor(items.length * 0.25);
        for (var i = 0; i < removeCount; i++) {
            delete this.cache[items[i].key];
        }
    },
    
    clear: function() {
        this.cache = {};
    }
};

function makeRequest(url, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    
    // Check cache first
    var cacheKey = url + JSON.stringify(options);
    var cached = CacheManager.get(cacheKey);
    if (cached && options.caching !== false) {
        callback(null, cached);
        return;
    }
    
    // Set default options
    options = Object.assign({
        headers: {
            'User-Agent': globalState.userAgent
        },
        timeout: globalState.requestTimeout,
        noFail: true
    }, options);
    
    http.request(url, options, function(err, result, headers) {
        if (err) {
            callback(err, null);
            return;
        }
        
        // Cache successful responses
        if (options.caching !== false) {
            CacheManager.set(cacheKey, result);
        }
        
        callback(null, result, headers);
    });
}
```

## Security Best Practices

### Input Validation and Sanitization

```javascript
var SecurityUtils = {
    validateUrl: function(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        
        // Check for valid URL format
        try {
            var urlObj = new URL(url);
            
            // Only allow HTTP and HTTPS
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                return false;
            }
            
            // Block local/private IP ranges
            var hostname = urlObj.hostname;
            if (this.isPrivateIP(hostname)) {
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    },
    
    isPrivateIP: function(hostname) {
        // Check for localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return true;
        }
        
        // Check for private IP ranges
        var privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^192\.168\./,
            /^169\.254\./
        ];
        
        return privateRanges.some(function(range) {
            return range.test(hostname);
        });
    },
    
    sanitizeInput: function(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        // Remove potentially dangerous characters
        return input.replace(/[<>"'&]/g, function(match) {
            var entityMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entityMap[match];
        });
    },
    
    validateVideoData: function(videoData) {
        if (!videoData || typeof videoData !== 'object') {
            return false;
        }
        
        // Validate required fields
        if (!videoData.title || !videoData.url) {
            return false;
        }
        
        // Validate URL
        if (!this.validateUrl(videoData.url)) {
            return false;
        }
        
        // Sanitize string fields
        videoData.title = this.sanitizeInput(videoData.title);
        videoData.description = this.sanitizeInput(videoData.description || '');
        
        return true;
    }
};
```

## Conclusion

This comprehensive tutorial has covered advanced video streaming plugin development for Movian, including:

- **Sophisticated URL Resolution**: Multiple extraction patterns, protocol detection, and fallback mechanisms
- **Multi-Protocol Support**: HLS, DASH, and MP4 with quality selection and adaptive streaming
- **Robust Authentication**: Token-based auth, session management, and automatic refresh
- **Error Handling**: Comprehensive error analysis, retry logic, and graceful degradation
- **Performance Optimization**: Caching, request optimization, and resource management
- **Security**: Input validation, URL sanitization, and safe request handling

## Best Practices Summary

1. **Always validate and sanitize user inputs**
2. **Implement comprehensive error handling with retry logic**
3. **Use caching to improve performance and reduce server load**
4. **Support multiple streaming protocols for maximum compatibility**
5. **Implement proper authentication with token refresh**
6. **Provide quality selection for different network conditions**
7. **Handle edge cases and provide fallback mechanisms**
8. **Follow security best practices to protect users**

## Next Steps

- Explore the [complete code examples](../code-examples/video-streaming/)
- Review the [API reference documentation](../api-reference/)
- Check out [performance optimization techniques](../advanced-topics/performance.md)
- Learn about [debugging and testing](../advanced-topics/debugging.md)

## Additional Resources

- [Movian Plugin API Reference](../api-reference/)
- [Video Streaming Examples](../examples/video-streaming/)
- [Plugin Development Best Practices](../advanced-topics/best-practices.md)
- [Security Guidelines](../advanced-topics/security.md)
