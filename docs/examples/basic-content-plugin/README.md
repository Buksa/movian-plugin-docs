# Basic Content Plugin Example

This example demonstrates how to create a simple content provider plugin for Movian.

## Plugin Structure

```
basic-content-plugin/
├── plugin.json
├── main.js
├── icon.png
└── README.md
```

## Files

### plugin.json
```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "basic-content-example",
  "file": "main.js",
  "showtimeVersion": "5.0",
  "version": "1.0.0",
  "author": "Example Developer",
  "title": "Basic Content Plugin",
  "synopsis": "A simple content provider example",
  "description": "Demonstrates basic content listing and navigation",
  "category": "video",
  "icon": "icon.png"
}
```

### main.js
```javascript
(function(plugin) {
  // Create the main service
  plugin.createService("Basic Content", "basiccontent:", "video", true, plugin.path + "icon.png");
  
  // Handle the main page
  plugin.addURI("basiccontent:start", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Basic Content Plugin";
    
    // Add some sample content
    page.appendItem("basiccontent:category:movies", "directory", {
      title: "Movies",
      icon: plugin.path + "icon.png"
    });
    
    page.appendItem("basiccontent:category:shows", "directory", {
      title: "TV Shows", 
      icon: plugin.path + "icon.png"
    });
    
    page.appendItem("", "separator", {
      title: "Search"
    });
    
    page.appendItem("basiccontent:search:", "search", {
      title: "Search Content"
    });
  });
  
  // Handle category pages
  plugin.addURI("basiccontent:category:(.*)$", function(page, category) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Sample content for demonstration
    for (var i = 1; i <= 10; i++) {
      page.appendItem("basiccontent:item:" + category + ":" + i, "video", {
        title: category.slice(0, -1) + " " + i,
        description: "Sample " + category.slice(0, -1) + " number " + i,
        icon: plugin.path + "icon.png"
      });
    }
  });
  
  // Handle individual items
  plugin.addURI("basiccontent:item:(.*):(.*):(.*)$", function(page, category, item, id) {
    page.type = "video";
    page.metadata.title = category.slice(0, -1) + " " + id;
    page.metadata.description = "This is a sample " + category.slice(0, -1);
    
    // In a real plugin, you would resolve the actual video URL here
    page.source = "videoparams:" + JSON.stringify({
      title: page.metadata.title,
      no_fs_scan: true,
      sources: [{
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }]
    });
  });
  
  // Handle search
  plugin.addURI("basiccontent:search:(.*)$", function(page, query) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "Search: " + query;
    
    // Simple search simulation
    if (query) {
      for (var i = 1; i <= 5; i++) {
        page.appendItem("basiccontent:item:search:" + query + ":" + i, "video", {
          title: "Search Result " + i + " for '" + query + "'",
          description: "Found content matching: " + query,
          icon: plugin.path + "icon.png"
        });
      }
    }
  });
  
})(this);
```

## Installation

1. Copy the plugin folder to your Movian plugins directory
2. Restart Movian
3. Navigate to the "Basic Content" service

## Features Demonstrated

- Service creation and registration
- Directory navigation
- Content listing
- Search functionality
- Video playback integration
- URI routing and parameter handling

This example provides a foundation for building more complex content provider plugins.