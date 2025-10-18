# Metadata and Storage API Reference

Complete reference for metadata services and storage operations in Movian plugins

# Overview

The Metadata and Storage APIs in Movian provide essential functionality for managing data persistence, user settings, and automatic metadata lookup. These APIs enable plugins to store user preferences, cache data, and integrate with metadata services for rich media information.

## Metadata API Features

- Automatic video metadata lookup and binding
- Integration with external metadata services (TMDB, IMDb)
- Playback progress tracking and restoration
- Season/episode parsing for TV shows

## Storage API Features

- Key-value storage for plugin data
- Domain-based storage isolation
- Support for strings, integers, and booleans
- Persistent storage across plugin sessions

## Settings API Features

- Global settings page creation
- Various setting types (string, boolean, info, dividers)
- Real-time setting change callbacks
- User-friendly settings interface

## Service Integration

- Home screen service creation
- Plugin registration and visibility
- Service metadata and icons

# Metadata API

The Metadata API provides automatic metadata lookup and binding for media content.

## metadata.videoMetadataBind

Bind video metadata to a property for automatic metadata lookup

### Syntax

```javascript
metadata.videoMetadataBind(url, title, imdbId)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The video URL or identifier

#### title (required)
- **Type:** string
- **Description:** The video title for metadata lookup

#### imdbId (optional)
- **Type:** string
- **Description:** Optional IMDb ID for precise metadata matching

### Returns

**Type:** object

Metadata binding object

### Examples

#### Bind Video Metadata

Automatically fetch and bind metadata for a video

```javascript
// Bind metadata for a movie
var metadataBinding = metadata.videoMetadataBind(
  'http://example.com/movie.mp4',
  'The Matrix',
  'tt0133093' // IMDb ID
);

// The metadata will be automatically populated
console.log('Metadata bound for:', metadataBinding);
```

#### Bind TV Episode Metadata

Bind metadata for a TV show episode

```javascript
// Bind metadata for a TV episode
var episodeMetadata = metadata.videoMetadataBind(
  'http://example.com/episode.mp4',
  'Breaking Bad S01E01 - Pilot'
);

// Metadata service will parse season/episode info
console.log('Episode metadata bound');
```

## metadata.bindPlayInfo

Bind playback information to track viewing progress

### Syntax

```javascript
metadata.bindPlayInfo(property, url)
```

### Parameters

#### property (required)
- **Type:** object
- **Description:** Property object to bind playback info to

#### url (required)
- **Type:** string
- **Description:** The media URL

### Examples

#### Track Playback Progress

Bind playback information to track viewing progress

```javascript
// Create property for the video item
var videoProp = prop.create();

// Bind playback info to track progress
metadata.bindPlayInfo(videoProp, videoUrl);

// Progress will be automatically saved and restored
console.log('Playback tracking enabled');
```



# Storage API (KVStore)

The Storage API (KVStore) provides persistent key-value storage for plugin data.

## kvstore.getString

Get a string value from key-value storage

### Syntax

```javascript
kvstore.getString(url, domain, key)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL context for the storage operation

#### domain (required)
- **Type:** string
- **Description:** Storage domain (typically "plugin")

#### key (required)
- **Type:** string
- **Description:** The key to retrieve

### Returns

**Type:** string|undefined

The stored string value or undefined if not found

### Examples

#### Get Stored String

Retrieve a string value from storage

```javascript
// Get stored user preference
var username = kvstore.getString(
  'plugin://myPlugin',
  'plugin',
  'username'
);

if (username) {
  console.log('Welcome back,', username);
} else {
  console.log('First time user');
}
```

## kvstore.getInteger

Get an integer value from key-value storage

### Syntax

```javascript
kvstore.getInteger(url, domain, key, defaultValue)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL context for the storage operation

#### domain (required)
- **Type:** string
- **Description:** Storage domain (typically "plugin")

#### key (required)
- **Type:** string
- **Description:** The key to retrieve

#### defaultValue (optional)
- **Type:** number
- **Description:** Default value if key not found

### Returns

**Type:** number

The stored integer value or default value

### Examples

#### Get Stored Integer

Retrieve an integer value with default

```javascript
// Get stored page size with default
var pageSize = kvstore.getInteger(
  'plugin://myPlugin',
  'plugin',
  'pageSize',
  20 // default value
);

console.log('Using page size:', pageSize);
```

## kvstore.getBoolean

Get a boolean value from key-value storage

### Syntax

```javascript
kvstore.getBoolean(url, domain, key, defaultValue)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL context for the storage operation

#### domain (required)
- **Type:** string
- **Description:** Storage domain (typically "plugin")

#### key (required)
- **Type:** string
- **Description:** The key to retrieve

#### defaultValue (optional)
- **Type:** boolean
- **Description:** Default value if key not found

### Returns

**Type:** boolean

The stored boolean value or default value

### Examples

#### Get Stored Boolean

Retrieve a boolean setting with default

```javascript
// Get debug mode setting
var debugMode = kvstore.getBoolean(
  'plugin://myPlugin',
  'plugin',
  'debugMode',
  false // default value
);

if (debugMode) {
  console.log('Debug mode enabled');
}
```

## kvstore.set

Set a value in key-value storage

### Syntax

```javascript
kvstore.set(url, domain, key, value)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL context for the storage operation

#### domain (required)
- **Type:** string
- **Description:** Storage domain (typically "plugin")

#### key (required)
- **Type:** string
- **Description:** The key to store

#### value (required)
- **Type:** any
- **Description:** The value to store

### Examples

#### Store Values

Store different types of values

```javascript
// Store user preferences
kvstore.set('plugin://myPlugin', 'plugin', 'username', 'john_doe');
kvstore.set('plugin://myPlugin', 'plugin', 'pageSize', 25);
kvstore.set('plugin://myPlugin', 'plugin', 'autoPlay', true);

console.log('Preferences saved');
```



# Settings API

The Settings API provides user-configurable settings with automatic UI generation.

## settings.globalSettings

Create global settings page for the plugin

### Syntax

```javascript
settings.globalSettings(id, title, icon, description)
```

### Parameters

#### id (required)
- **Type:** string
- **Description:** Plugin identifier

#### title (required)
- **Type:** string
- **Description:** Settings page title

#### icon (required)
- **Type:** string
- **Description:** Settings page icon URL

#### description (optional)
- **Type:** string
- **Description:** Settings page description

### Examples

#### Create Settings Page

Create a global settings page for the plugin

```javascript
// Create global settings page
settings.globalSettings(
  plugin.id,
  plugin.title,
  Plugin.path + 'icon.png',
  'Configure plugin settings'
);
```

## settings.createString

Create a string setting with callback

### Syntax

```javascript
settings.createString(key, title, defaultValue, callback)
```

### Parameters

#### key (required)
- **Type:** string
- **Description:** Setting key identifier

#### title (required)
- **Type:** string
- **Description:** Display title for the setting

#### defaultValue (required)
- **Type:** string
- **Description:** Default value for the setting

#### callback (required)
- **Type:** function
- **Description:** Function called when setting changes

### Examples

#### Create String Setting

Create a configurable string setting

```javascript
// Create API endpoint setting
settings.createString(
  'apiEndpoint',
  'API Endpoint URL',
  'https://api.example.com',
  function(value) {
    service.apiEndpoint = value;
    console.log('API endpoint updated:', value);
  }
);
```

## settings.createBool

Create a boolean setting with callback

### Syntax

```javascript
settings.createBool(key, title, defaultValue, callback)
```

### Parameters

#### key (required)
- **Type:** string
- **Description:** Setting key identifier

#### title (required)
- **Type:** string
- **Description:** Display title for the setting

#### defaultValue (required)
- **Type:** boolean
- **Description:** Default value for the setting

#### callback (required)
- **Type:** function
- **Description:** Function called when setting changes

### Examples

#### Create Boolean Setting

Create a configurable boolean setting

```javascript
// Create debug mode setting
settings.createBool(
  'debugMode',
  'Enable Debug Mode',
  false,
  function(enabled) {
    service.debug = enabled;
    if (enabled) {
      console.log('Debug mode enabled');
    }
  }
);
```

## settings.createInfo

Create an informational display in settings

### Syntax

```javascript
settings.createInfo(key, icon, text)
```

### Parameters

#### key (required)
- **Type:** string
- **Description:** Info item key identifier

#### icon (required)
- **Type:** string
- **Description:** Icon URL for the info item

#### text (required)
- **Type:** string
- **Description:** Information text to display

### Examples

#### Create Info Display

Display plugin information in settings

```javascript
// Create plugin info display
settings.createInfo(
  'pluginInfo',
  Plugin.path + 'icon.png',
  'Plugin developed by ' + plugin.author
);
```

## settings.createDivider

Create a visual divider in settings

### Syntax

```javascript
settings.createDivider(title)
```

### Parameters

#### title (required)
- **Type:** string
- **Description:** Divider title text

### Examples

#### Create Settings Divider

Add a section divider in settings

```javascript
// Create section divider
settings.createDivider('Advanced Settings');

// Add settings under this section
settings.createBool('advancedMode', 'Advanced Mode', false, callback);
```



# Service API

The Service API provides plugin registration and home screen integration.

## service.create

Create a service entry on the home screen

### Syntax

```javascript
service.create(title, url, type, enabled, icon)
```

### Parameters

#### title (required)
- **Type:** string
- **Description:** Service display title

#### url (required)
- **Type:** string
- **Description:** Service URL to open when selected

#### type (required)
- **Type:** string
- **Description:** Service type (video, audio, etc.)

#### enabled (required)
- **Type:** boolean
- **Description:** Whether the service is enabled

#### icon (required)
- **Type:** string
- **Description:** Service icon URL

### Examples

#### Create Service Entry

Add plugin to home screen

```javascript
// Create service on home screen
service.create(
  plugin.title,
  PREFIX + ':start',
  'video',
  true,
  Plugin.path + 'icon.png'
);
```



# Integration Patterns

## Complete Plugin Setup

```javascript
// 1. Create service on home screen
service.create(plugin.title, PREFIX + ':start', 'video', true, LOGO);

// 2. Setup global settings
settings.globalSettings(plugin.id, plugin.title, LOGO, plugin.synopsis);

// 3. Create settings
settings.createString('apiKey', 'API Key', '', function(value) {
  service.apiKey = value;
});

settings.createBool('caching', 'Enable Caching', true, function(enabled) {
  service.caching = enabled;
});

// 4. Use storage for user data
function saveUserPreference(key, value) {
  kvstore.set('plugin://' + plugin.id, 'plugin', key, value);
}

function getUserPreference(key, defaultValue) {
  return kvstore.getString('plugin://' + plugin.id, 'plugin', key) || defaultValue;
}
```

## Metadata Integration

```javascript
// Bind metadata for automatic lookup
function addVideoWithMetadata(url, title, imdbId) {
  var metadataBinding = metadata.videoMetadataBind(url, title, imdbId);
  
  page.appendItem(url, 'video', {
    title: title,
    metadata: metadataBinding
  });
}

// Track playback progress
function setupPlaybackTracking(videoProp, videoUrl) {
  metadata.bindPlayInfo(videoProp, videoUrl);
}
```

## Settings and Storage Integration

```javascript
// Create settings that automatically save to storage
settings.createString('username', 'Username', '', function(value) {
  kvstore.set('plugin://' + plugin.id, 'plugin', 'username', value);
  service.username = value;
});

// Load saved settings on startup
function loadSettings() {
  var username = kvstore.getString('plugin://' + plugin.id, 'plugin', 'username');
  if (username) {
    service.username = username;
  }
  
  var debugMode = kvstore.getBoolean('plugin://' + plugin.id, 'plugin', 'debug', false);
  service.debug = debugMode;
}
```

# Best Practices

## Storage Management

- Use consistent URL patterns for storage operations
- Always specify the "plugin" domain for plugin-specific data
- Provide sensible default values for settings
- Clean up unused storage keys periodically

## Metadata Optimization

- Cache metadata lookups to reduce API calls
- Use IMDb IDs when available for accurate matching
- Handle metadata lookup failures gracefully
- Implement fallback metadata sources

## Settings Design

- Group related settings with dividers
- Use descriptive titles and help text
- Provide reasonable default values
- Validate user input in callbacks

## Performance

- Minimize storage operations in loops
- Cache frequently accessed settings
- Use appropriate data types for storage
- Implement lazy loading for metadata

