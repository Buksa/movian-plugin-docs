# Getting Started

This section covers the basics of Movian plugin development.

## Prerequisites

Before you begin developing plugins for Movian, you'll need:

- Basic knowledge of JavaScript
- Understanding of JSON configuration files
- Familiarity with HTTP requests and APIs

## Your First Plugin

Let's create a simple "Hello World" plugin:

```javascript
// main.js
(function(plugin) {
  plugin.createService("Hello World", "helloworld:start", "video", true, 
    plugin.path + "logo.png");

  plugin.addURI("helloworld:start", function(page) {
    page.type = "directory";
    page.contents = "items";
    page.metadata.logo = plugin.path + "logo.png";
    page.metadata.title = "Hello World Plugin";
    
    page.appendItem("", "directory", {
      title: "Hello World!",
      description: "This is your first plugin"
    });
  });

})(this);
```

```json
{
  "type": "javascript",
  "apiversion": 1,
  "id": "helloworld",
  "file": "main.js",
  "version": "1.0.0",
  "author": "Your Name",
  "title": "Hello World Plugin",
  "synopsis": "A simple hello world plugin",
  "description": "This plugin demonstrates the basics of Movian plugin development",
  "homepage": "https://github.com/yourusername/movian-helloworld"
}
```

## Next Steps

- [Plugin Architecture](architecture.md)
- [API Overview](../api-reference/README.md)
- [Examples](../examples/README.md)