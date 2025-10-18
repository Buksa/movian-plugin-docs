# Plugin Structure and Architecture

Understanding the fundamental structure of Movian plugins.

## Core Components

### plugin.json Configuration
The plugin.json file defines your plugin's metadata and configuration.

### Main JavaScript File
Contains your plugin's logic and functionality.

### Asset Management
Images, icons, and other resources used by your plugin.

## Plugin Lifecycle

1. **Initialization** - Plugin loads and registers services
2. **Service Registration** - URI handlers and services are created
3. **Runtime** - Plugin responds to user interactions
4. **Cleanup** - Plugin unloads when Movian exits

## File Organization

```
my-plugin/
├── plugin.json          # Plugin configuration
├── main.js              # Main plugin code
├── lib/                 # Helper libraries
│   └── utils.js
├── assets/              # Images and resources
│   ├── icon.png
│   └── background.jpg
└── views/               # Custom UI views
    └── settings.view
```

## Next Steps

Learn about [plugin.json Reference](plugin-json-reference.md) for detailed configuration options.