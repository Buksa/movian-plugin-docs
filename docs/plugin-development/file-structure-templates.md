# Plugin File Structure Templates

This document provides templates for organizing plugin files based on different plugin types and complexity levels.

## Basic Plugin Structure

For simple plugins with minimal functionality:

```
my-plugin/
├── plugin.json          # Plugin configuration
├── main.js              # Main plugin code
├── icon.png             # Plugin icon (64x64 recommended)
├── README.md            # Documentation
└── LICENSE              # License file
```

## Video Plugin Structure

For video streaming and content provider plugins:

```
video-plugin/
├── plugin.json          # Plugin configuration with URI prefixes
├── main.js              # Main plugin logic
├── lib/
│   ├── api.js           # API communication helpers
│   ├── parser.js        # Content parsing utilities
│   └── utils.js         # Common utilities
├── resources/
│   ├── icon.png         # Plugin icon
│   └── logo.png         # Service logo
├── views/
│   ├── search.view      # Custom search interface
│   └── player.view      # Custom player interface
├── README.md
└── LICENSE
```

## Settings Plugin Structure

For plugins that primarily manage settings and configuration:

```
settings-plugin/
├── plugin.json          # Plugin configuration
├── main.js              # Settings management logic
├── lib/
│   ├── config.js        # Configuration management
│   └── validation.js    # Settings validation
├── views/
│   ├── settings.view    # Settings interface
│   └── about.view       # About/info page
├── resources/
│   ├── icon.png
│   └── defaults.json    # Default configuration
├── README.md
└── LICENSE
```

## Complex Plugin Structure

For advanced plugins with multiple features:

```
complex-plugin/
├── plugin.json
├── main.js              # Plugin entry point
├── lib/
│   ├── core/
│   │   ├── api.js       # Core API functionality
│   │   ├── cache.js     # Caching system
│   │   └── events.js    # Event handling
│   ├── services/
│   │   ├── auth.js      # Authentication service
│   │   ├── search.js    # Search service
│   │   └── metadata.js  # Metadata service
│   └── utils/
│       ├── http.js      # HTTP utilities
│       ├── parser.js    # Parsing utilities
│       └── logger.js    # Logging utilities
├── views/
│   ├── common/
│   │   ├── header.view  # Common header
│   │   └── footer.view  # Common footer
│   ├── pages/
│   │   ├── home.view    # Home page
│   │   ├── search.view  # Search page
│   │   └── settings.view # Settings page
│   └── components/
│       ├── item.view    # Item component
│       └── list.view    # List component
├── resources/
│   ├── images/
│   │   ├── icon.png
│   │   ├── logo.png
│   │   └── background.jpg
│   ├── data/
│   │   ├── config.json  # Configuration data
│   │   └── mappings.json # Data mappings
│   └── fonts/
│       └── custom.ttf   # Custom fonts
├── tests/
│   ├── unit/
│   │   ├── api.test.js
│   │   └── utils.test.js
│   └── integration/
│       └── plugin.test.js
├── docs/
│   ├── API.md           # API documentation
│   ├── CHANGELOG.md     # Change log
│   └── CONTRIBUTING.md  # Contribution guidelines
├── README.md
├── LICENSE
└── package.json         # If using npm dependencies
```

## File Naming Conventions

### JavaScript Files
- Use lowercase with hyphens: `my-module.js`
- Use descriptive names: `video-parser.js`, `settings-manager.js`
- Group related files in subdirectories

### View Files
- Use `.view` extension: `search.view`, `player.view`
- Use lowercase with hyphens for multi-word names
- Organize by functionality or page type

### Resource Files
- Use descriptive names: `icon.png`, `service-logo.png`
- Group by type: `images/`, `fonts/`, `data/`
- Use appropriate file extensions

## Best Practices

1. **Keep it simple** - Start with basic structure and add complexity as needed
2. **Consistent naming** - Use consistent naming conventions throughout
3. **Logical grouping** - Group related files in appropriate directories
4. **Documentation** - Include README.md and inline code comments
5. **Version control** - Use .gitignore for generated or temporary files
6. **Testing** - Include test files for complex plugins
7. **Licensing** - Always include appropriate license information

