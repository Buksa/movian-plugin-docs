# Creating Your First Plugin

Learn how to create a basic Movian plugin from scratch.

## Plugin Structure

Every Movian plugin requires at minimum:
- `plugin.json` - Configuration file
- `main.js` - Main plugin code

## Basic Plugin Template

### plugin.json
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
  "description": "This is my first Movian plugin"
}
```

### main.js
```javascript
(function(plugin) {
  plugin.createService("My Service", "myservice:", "video", true, plugin.path + "icon.png");
  
  plugin.addURI("myservice:start", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.title = "My First Plugin";
    
    page.appendItem("", "separator", {
      title: "Welcome to my plugin!"
    });
  });
})(this);
```

## Testing Your Plugin

1. Copy your plugin folder to Movian's plugin directory
2. Restart Movian
3. Navigate to your plugin service

Continue to [Plugin Development](../plugin-development/plugin-structure.md) for more advanced topics.