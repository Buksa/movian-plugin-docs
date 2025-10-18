# Your First Movian Plugin: Step-by-Step Tutorial

Welcome to plugin development for Movian! This tutorial will guide you through creating your first plugin from scratch.

## What You'll Learn

- Plugin structure and configuration
- Basic JavaScript plugin development
- Service creation and URI handling
- Content listing and navigation
- Testing and debugging

## Prerequisites

- Basic JavaScript knowledge
- Movian media center installed
- Text editor or IDE

## Step 1: Understanding Plugin Structure

Every Movian plugin consists of at least two files:

```
my-first-plugin/
├── plugin.json    # Plugin configuration
├── main.js        # Main plugin code
└── icon.png       # Plugin icon (optional)
```

### The plugin.json File

This file tells Movian about your plugin:

```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "my-first-plugin",
  "file": "main.js",
  "showtimeVersion": "5.0",
  "version": "1.0.0",
  "author": "Your Name",
  "title": "My First Plugin",
  "synopsis": "A simple example plugin",
  "description": "This is my first Movian plugin",
  "category": "video",
  "icon": "icon.png"
}
```

**Key Fields Explained:**
- `id`: Unique identifier for your plugin
- `file`: Main JavaScript file
- `title`: Display name in Movian
- `category`: Plugin category (video, audio, other, etc.)

## Step 2: Creating the Main Plugin Code

The `main.js` file contains your plugin logic:

```javascript
(function(plugin) {
  // Create a service that appears in Movian's main menu
  plugin.createService("My First Plugin", "myfirst:", "video", true, plugin.path + "icon.png");
  
  // Handle the main page when users click your service
  plugin.addURI("myfirst:start", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Welcome to My Plugin";
    
    // Add a welcome message
    page.appendItem("", "separator", {
      title: "Hello, World!"
    });
    
    // Add some sample content
    page.appendItem("myfirst:content", "directory", {
      title: "Sample Content",
      description: "Click to see sample content"
    });
  });
  
  // Handle the content page
  plugin.addURI("myfirst:content", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Sample Content";
    
    // Add some sample items
    for (var i = 1; i <= 5; i++) {
      page.appendItem("myfirst:item:" + i, "video", {
        title: "Sample Item " + i,
        description: "This is sample item number " + i
      });
    }
  });
  
  // Handle individual items
  plugin.addURI("myfirst:item:(.*)$", function(page, itemId) {
    page.type = "video";
    page.metadata.title = "Sample Item " + itemId;
    page.metadata.description = "Playing sample item " + itemId;
    
    // In a real plugin, you would set the actual video source here
    // For this example, we'll use a sample video
    page.source = "videoparams:" + JSON.stringify({
      title: page.metadata.title,
      sources: [{
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }]
    });
  });
  
})(this);
```

## Step 3: Understanding the Code

Let's break down what this code does:

### Service Creation
```javascript
plugin.createService("My First Plugin", "myfirst:", "video", true, plugin.path + "icon.png");
```
- Creates a service that appears in Movian's main menu
- `"myfirst:"` is the URI prefix for your plugin
- `"video"` indicates this is a video content plugin

### URI Handlers
```javascript
plugin.addURI("myfirst:start", function(page) { ... });
```
- Handles URLs that match the pattern
- The function receives a `page` object to populate with content

### Page Types
- `"directory"`: A page that lists items
- `"video"`: A page that plays video content
- `"separator"`: A visual separator in lists

## Step 4: Testing Your Plugin

1. **Create the plugin directory:**
   ```
   mkdir my-first-plugin
   cd my-first-plugin
   ```

2. **Create the files:**
   - Copy the `plugin.json` content above
   - Copy the `main.js` content above
   - Add an icon.png file (optional)

3. **Install the plugin:**
   - Copy your plugin folder to Movian's plugin directory
   - On Windows: `%APPDATA%\Movian\plugins\`
   - On macOS: `~/Library/Application Support/Movian/plugins/`
   - On Linux: `~/.movian/plugins/`

4. **Test in Movian:**
   - Restart Movian
   - Look for "My First Plugin" in the main menu
   - Navigate through your plugin's content

## Step 5: Common Patterns

### Error Handling
```javascript
plugin.addURI("myfirst:content", function(page) {
  try {
    // Your code here
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Content";
  } catch (error) {
    page.error("Failed to load content: " + error.message);
  }
});
```

### Loading Indicators
```javascript
plugin.addURI("myfirst:content", function(page) {
  page.loading = true;
  
  // Simulate loading time
  setTimeout(function() {
    page.loading = false;
    // Add your content here
  }, 1000);
});
```

### User Settings
```javascript
// Add settings to your plugin
plugin.createSettings("My Plugin Settings", plugin.path + "icon.png", "My Plugin Configuration");

var enableFeature = plugin.createBoolSetting("enable_feature", "Enable Special Feature", true);

// Use settings in your code
if (enableFeature.value) {
  // Feature is enabled
}
```

## Next Steps

Congratulations! You've created your first Movian plugin. Here's what to explore next:

1. **[Content Provider Tutorial](content-provider-tutorial.html)** - Learn to fetch content from APIs
2. **[Video Streaming Tutorial](video-streaming-tutorial.html)** - Handle video URL resolution
3. **[API Reference](../api-reference/)** - Complete API documentation
4. **[Plugin Examples](../examples/)** - More complex plugin examples

## Troubleshooting

### Plugin Not Appearing
- Check that plugin.json is valid JSON
- Verify the plugin ID is unique
- Ensure files are in the correct plugin directory

### JavaScript Errors
- Check Movian's log files for error messages
- Use `plugin.log()` for debugging
- Validate your JavaScript syntax

### Content Not Loading
- Verify URI patterns match your handlers
- Check page type is set correctly
- Ensure content is added to the page

## Interactive Tutorial

Try the [Interactive Plugin Builder](interactive-tutorial.html) to experiment with plugin code in real-time!
