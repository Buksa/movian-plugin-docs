# Plugin Architecture Guide

## Overview

Movian plugins follow a specific architecture pattern that enables them to integrate seamlessly with the media center platform. This guide explains the core concepts, file structure, and lifecycle of Movian plugins.

## Plugin Structure

### Essential Components

#### plugin.json

Plugin configuration and metadata

**Required:** Yes

#### *.js

Main plugin JavaScript file

**Required:** Yes

### Common Components

#### icon.png

Plugin icon (PNG format recommended)

**Required:** No

#### logo.png

Plugin logo

**Required:** No

#### README.md

Plugin documentation

**Required:** No

#### LICENSE

License file

**Required:** No

### Advanced Components

#### views/*.view

Custom UI view files

**Required:** No

#### resources/*

Additional resources (images, data files)

**Required:** No

#### lib/*.js

Helper libraries and modules

**Required:** No

## Plugin Lifecycle

Movian plugins follow a predictable lifecycle from loading to execution:

1. **Plugin Discovery** - Movian scans plugin directories for `plugin.json` files
2. **Configuration Parsing** - The `plugin.json` file is parsed and validated
3. **JavaScript Loading** - The main JavaScript file is loaded into the runtime
4. **Initialization** - If present, the `init()` function is called
5. **Service Registration** - Services and URI handlers are registered
6. **Ready State** - Plugin is ready to handle user requests

## API Categories

### HTTP API

HTTP requests and web service integration

**Common usage patterns:**
```javascript
var http = require("movian/http");
```

```javascript
http.request(url, options);
```

### PAGE API

Page manipulation and content management

**Common usage patterns:**
```javascript
page.appendItem(url, "video", metadata);
```

```javascript
page.loading = true;
```

### SETTINGS API

Plugin settings and configuration

**Common usage patterns:**
```javascript
var settings = require("movian/settings");
```

```javascript
settings.createBool("enabled", "Enable feature", true);
```

### SERVICE API

Service registration and URI handling

**Common usage patterns:**
```javascript
var service = require("movian/service");
```

```javascript
service.create("My Service", "myservice:", logo, true);
```

### STORAGE API

Data persistence and storage

**Common usage patterns:**
```javascript
var store = require("movian/store");
```

```javascript
store.set("key", value);
```

### POPUP API

User notifications and popups

**Common usage patterns:**
```javascript
var popup = require("movian/popup");
```

```javascript
popup.notify("Message", 2);
```

## Best Practices

### File Organization

- Keep the main plugin logic in a single JavaScript file for simple plugins
- Use a `lib/` directory for helper modules in complex plugins
- Store UI customizations in `views/` directory
- Place static resources in a `resources/` directory

### Code Structure

- Use the `init()` function for plugin initialization
- Create services early in the plugin lifecycle
- Handle errors gracefully with try-catch blocks
- Use meaningful variable and function names

### Performance

- Minimize HTTP requests by caching data when possible
- Use asynchronous operations for network requests
- Avoid blocking the UI thread with long-running operations
- Clean up resources when the plugin is unloaded

