# Theming and Styling Guide

Comprehensive guide for creating custom themes and styles for Movian using view files, color schemes, and advanced styling techniques.

## Table of Contents

1. [Theme Architecture](#theme-architecture)
2. [Color Schemes and Palettes](#color-schemes-and-palettes)
3. [Layout Patterns](#layout-patterns)
4. [Typography and Text Styling](#typography-and-text-styling)
5. [Animation and Effects](#animation-and-effects)
6. [Interactive Theme Generator](#interactive-theme-generator)
7. [Responsive Design](#responsive-design)
8. [Custom Components](#custom-components)
9. [Best Practices](#best-practices)

## Theme Architecture

### Directory Structure
```
my-theme/
├── theme.json         # Theme configuration
├── views/             # View files
│   ├── colors.view   # Color definitions
│   ├── main.view     # Main interface
│   ├── video.view    # Video player
│   ├── settings.view # Settings page
│   └── components.view # Reusable components
└── assets/           # Images and resources
    ├── backgrounds/
    ├── icons/
    └── fonts/
```

## Theme Configuration

### theme.json
```json
{
  "name": "My Custom Theme",
  "version": "1.0.0",
  "author": "Theme Developer",
  "description": "A beautiful custom theme for Movian",
  "glwVersion": "1.0",
  "views": {
    "main": "views/main.view",
    "video": "views/video.view",
    "settings": "views/settings.view"
  }
}
```

## Color Schemes

### Defining Colors
Use RGB values between 0.0 and 1.0:

```xml
#define THEME_PRIMARY [0.2, 0.4, 0.8]
#define THEME_SECONDARY [0.8, 0.4, 0.2]
#define THEME_BACKGROUND [0.1, 0.1, 0.1]
#define THEME_TEXT [0.9, 0.9, 0.9]

widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(text, {
    caption: "Themed Text";
    color: THEME_TEXT;
  });
});
```

### Color Variables
Create reusable color definitions:

```xml
#define COLOR_SCHEME {
  primary: [0.2, 0.4, 0.8];
  secondary: [0.8, 0.4, 0.2];
  background: [0.1, 0.1, 0.1];
  text: [0.9, 0.9, 0.9];
  accent: [0.3, 0.8, 0.3];
}
```

## Layout Patterns

### Card Layout
```xml
widget(container_y, {
  color: [0.2, 0.2, 0.2];
  padding: 15;
  margin: 10;
  
  widget(image, {
    source: $self.thumbnail;
    width: 200;
    height: 300;
    align: center;
  });
  
  widget(text, {
    caption: $self.title;
    color: [1.0, 1.0, 1.0];
    size: 18;
    align: center;
    margin: [10, 0];
  });
  
  widget(text, {
    caption: $self.description;
    color: [0.8, 0.8, 0.8];
    size: 14;
    align: center;
  });
});
```

### Grid Layout
```xml
widget(container_x, {
  spacing: 10;
  
  cloner($self.items, container_y, {
    width: ($parent.width - 40) / 3;
    
    widget(image, {
      source: $self.poster;
      aspect: 2/3;
    });
    
    widget(text, {
      caption: $self.title;
      align: center;
    });
  });
});
```

## Responsive Design

### Screen Size Adaptation
```xml
widget(container_x, {
  // Switch to vertical layout on small screens
  $ui.width < 800 ? container_y : container_x;
  
  widget(image, {
    width: $ui.width < 800 ? $parent.width : 300;
    height: $ui.width < 800 ? 200 : 400;
  });
  
  widget(container_y, {
    weight: 1.0;
    margin: $ui.width < 800 ? [10, 0] : [20, 0];
    
    widget(text, {
      size: $ui.width < 800 ? 16 : 20;
    });
  });
});
```

### Dynamic Spacing
```xml
widget(container_y, {
  spacing: $ui.width < 600 ? 5 : 10;
  padding: $ui.width < 600 ? 10 : 20;
});
```

## Animation and Effects

### Fade Transitions
```xml
widget(text, {
  alpha: $self.focused ? 1.0 : 0.7;
  time: 0.3; // Animation duration
});
```

### Scale Effects
```xml
widget(image, {
  scale: $self.focused ? 1.1 : 1.0;
  time: 0.2;
});
```

### Color Transitions
```xml
widget(button, {
  color: $self.focused ? [0.3, 0.5, 0.9] : [0.2, 0.4, 0.8];
  time: 0.15;
});
```

## Custom Components

### Reusable Button Component
```xml
#define CUSTOM_BUTTON(caption, action) {
  widget(container_y, {
    focusable: true;
    color: $self.focused ? [0.3, 0.3, 0.3] : [0.2, 0.2, 0.2];
    padding: 10;
    
    widget(text, {
      caption: caption;
      color: [1.0, 1.0, 1.0];
      align: center;
    });
    
    onEvent(activate, action);
  });
}

// Usage
CUSTOM_BUTTON("Play", {
  $ui.playVideo($self.url);
});
```

### Progress Bar Component
```xml
#define PROGRESS_BAR(value, max) {
  widget(container_x, {
    height: 6;
    color: [0.3, 0.3, 0.3];
    
    widget(container_x, {
      width: (value / max) * $parent.width;
      color: [0.2, 0.8, 0.2];
    });
  });
}
```

## Best Practices

### Performance
- Use efficient layouts (avoid deep nesting)
- Optimize image sizes and formats
- Minimize animation complexity
- Cache reusable components

### Accessibility
- Ensure sufficient color contrast
- Provide keyboard navigation
- Use appropriate focus indicators
- Support screen readers

### Maintainability
- Use consistent naming conventions
- Create reusable components
- Document custom components
- Organize files logically

## Interactive Theme Generator

### Using the Theme Generator Tool

The Movian Theme Generator provides a visual interface for creating custom themes with live preview and automatic code generation.

**Access the tool:** [Theme Generator](../../../static/theme-generator.html)

#### Features:
- **Live Preview**: See your theme changes in real-time
- **Color Scheme Editor**: Visual color picker with preset palettes
- **Layout Customization**: Adjust spacing, padding, and border radius
- **Responsive Preview**: Test your theme on different screen sizes
- **Code Generation**: Automatic generation of theme files
- **Export Options**: Download complete theme package

#### Quick Start:
1. Open the Theme Generator tool
2. Enter your theme name and author information
3. Choose colors using the color pickers or preset palettes
4. Adjust layout settings with the sliders
5. Preview your theme in different screen sizes
6. Download the generated theme files

### Color Scheme Presets

The generator includes several built-in color schemes:

#### Dark Blue (Default)
```xml
#define THEME_PRIMARY [0.2, 0.4, 0.8]
#define THEME_SECONDARY [0.8, 0.4, 0.2]
#define THEME_BACKGROUND [0.1, 0.1, 0.1]
#define THEME_TEXT [0.9, 0.9, 0.9]
#define THEME_ACCENT [0.3, 0.8, 0.3]
```

#### Warm Orange
```xml
#define THEME_PRIMARY [0.9, 0.5, 0.2]
#define THEME_SECONDARY [0.2, 0.6, 0.9]
#define THEME_BACKGROUND [0.15, 0.1, 0.05]
#define THEME_TEXT [0.95, 0.9, 0.85]
#define THEME_ACCENT [0.8, 0.3, 0.3]
```

#### Forest Green
```xml
#define THEME_PRIMARY [0.2, 0.6, 0.3]
#define THEME_SECONDARY [0.6, 0.3, 0.2]
#define THEME_BACKGROUND [0.05, 0.15, 0.1]
#define THEME_TEXT [0.9, 0.95, 0.9]
#define THEME_ACCENT [0.4, 0.8, 0.4]
```

#### Purple Night
```xml
#define THEME_PRIMARY [0.5, 0.2, 0.8]
#define THEME_SECONDARY [0.8, 0.6, 0.2]
#define THEME_BACKGROUND [0.1, 0.05, 0.15]
#define THEME_TEXT [0.9, 0.85, 0.95]
#define THEME_ACCENT [0.7, 0.3, 0.9]
```

#### Minimal Gray
```xml
#define THEME_PRIMARY [0.4, 0.4, 0.4]
#define THEME_SECONDARY [0.6, 0.6, 0.6]
#define THEME_BACKGROUND [0.12, 0.12, 0.12]
#define THEME_TEXT [0.9, 0.9, 0.9]
#define THEME_ACCENT [0.8, 0.8, 0.8]
```

### Layout Presets

#### Compact Layout
- Spacing: 8px
- Padding: 12px
- Border Radius: 4px

#### Comfortable Layout (Default)
- Spacing: 15px
- Padding: 20px
- Border Radius: 8px

#### Spacious Layout
- Spacing: 25px
- Padding: 30px
- Border Radius: 12px

## Advanced Theming Techniques

### Dynamic Color Adaptation

Create themes that adapt to content:

```xml
#define ADAPTIVE_COLOR(base, content) {
  $content.dominant_color ? 
    blend(base, $content.dominant_color, 0.3) : 
    base
}

widget(container_y, {
  color: ADAPTIVE_COLOR(THEME_BACKGROUND, $self.currentItem);
});
```

### Theme Variants

Support multiple theme variants:

```xml
#define THEME_VARIANT $ui.settings.theme_variant

#define PRIMARY_COLOR {
  THEME_VARIANT == "light" ? [0.9, 0.9, 0.9] :
  THEME_VARIANT == "dark" ? [0.1, 0.1, 0.1] :
  THEME_PRIMARY
}
```

### Seasonal Themes

Create themes that change with seasons:

```xml
#define SEASONAL_ACCENT {
  $ui.season == "spring" ? [0.4, 0.8, 0.4] :
  $ui.season == "summer" ? [0.9, 0.7, 0.2] :
  $ui.season == "autumn" ? [0.8, 0.4, 0.2] :
  $ui.season == "winter" ? [0.6, 0.8, 0.9] :
  THEME_ACCENT
}
```

## Skin Template Generator

### Available Templates

The theme generator includes several component templates:

#### Media Card Template
Perfect for displaying movies, TV shows, and music albums with poster images and metadata.

#### Navigation Menu Template
Clean sidebar navigation with icons and item counts.

#### Button Grid Template
Organized grid layout for action buttons and quick access items.

#### Content List Template
Horizontal list layout for episodes, tracks, or search results.

#### Player Controls Template
Complete media player interface with progress bar and control buttons.

### Custom Template Creation

Create your own reusable templates:

```xml
#define CUSTOM_TEMPLATE(data, options) {
  widget(container_y, {
    color: options.background || THEME_CARD;
    padding: options.padding || THEME_PADDING;
    spacing: options.spacing || THEME_SPACING;
    
    // Template content here
    widget(text, {
      caption: data.title;
      color: options.textColor || THEME_TEXT;
      size: options.fontSize || 16;
    });
  });
}

// Usage
CUSTOM_TEMPLATE($self.item, {
  background: THEME_ACCENT;
  fontSize: 18;
});
```

## Example: Complete Generated Theme

### theme.json
```json
{
  "name": "My Custom Theme",
  "version": "1.0.0",
  "author": "Theme Developer",
  "description": "Custom theme: My Custom Theme",
  "glwVersion": "1.0",
  "views": {
    "main": "views/main.view",
    "video": "views/video.view",
    "settings": "views/settings.view",
    "components": "views/components.view"
  },
  "assets": {
    "icons": "assets/icons/",
    "backgrounds": "assets/backgrounds/"
  }
}
```

### colors.view
```xml
// My Custom Theme - Color Definitions
// Generated by Movian Theme Generator

#define THEME_PRIMARY [0.2, 0.4, 0.8]
#define THEME_SECONDARY [0.8, 0.4, 0.2]
#define THEME_BACKGROUND [0.1, 0.1, 0.1]
#define THEME_TEXT [0.9, 0.9, 0.9]
#define THEME_ACCENT [0.3, 0.8, 0.3]

// Layout Constants
#define THEME_SPACING 15
#define THEME_PADDING 20
#define THEME_BORDER_RADIUS 8

// Derived Colors
#define THEME_CARD [0.2, 0.2, 0.2]
#define THEME_BORDER [0.3, 0.3, 0.3]
#define THEME_HOVER [0.3, 0.5, 0.9]
#define THEME_FOCUS [0.5, 1.0, 0.5]
#define THEME_DISABLED [0.45, 0.45, 0.45]

// Animation Constants
#define THEME_ANIM_FAST 0.15
#define THEME_ANIM_NORMAL 0.25
#define THEME_ANIM_SLOW 0.4
```

### main.view
```xml
#include "colors.view"

// My Custom Theme - Main View
// Generated by Movian Theme Generator

widget(container_y, {
  color: THEME_BACKGROUND;
  
  // Header Section
  widget(container_x, {
    height: 60;
    color: THEME_PRIMARY;
    padding: THEME_PADDING;
    
    widget(text, {
      caption: "My Custom Theme";
      color: THEME_TEXT;
      size: 24;
      weight: 1.0;
    });
    
    widget(container_x, {
      spacing: THEME_SPACING;
      
      widget(text, {
        caption: $ui.time;
        color: THEME_TEXT;
        size: 16;
        alpha: 0.9;
      });
      
      widget(text, {
        caption: $ui.user;
        color: THEME_TEXT;
        size: 14;
        alpha: 0.8;
      });
    });
  });
  
  // Main Content Area
  widget(container_x, {
    weight: 1.0;
    
    // Sidebar Navigation
    widget(container_y, {
      width: 250;
      color: THEME_SECONDARY;
      padding: THEME_PADDING;
      spacing: THEME_SPACING;
      
      // Navigation Items
      cloner($ui.navigation, container_y, {
        widget(container_y, {
          focusable: true;
          color: $self.focused ? THEME_HOVER : transparent;
          padding: THEME_SPACING;
          time: THEME_ANIM_FAST;
          
          widget(text, {
            caption: $self.title;
            color: THEME_TEXT;
            size: 16;
            align: left;
          });
          
          onEvent(activate, {
            $ui.navigate($self.url);
          });
        });
      });
    });
    
    // Content Area with Grid Layout
    widget(container_y, {
      weight: 1.0;
      padding: THEME_PADDING;
      spacing: THEME_SPACING;
      
      // Content Grid
      cloner($ui.content, container_x, {
        spacing: THEME_SPACING;
        
        cloner($self.items, container_y, {
          width: ($parent.width - (THEME_SPACING * 3)) / 4;
          
          widget(container_y, {
            color: THEME_CARD;
            padding: THEME_PADDING;
            spacing: THEME_SPACING / 2;
            focusable: true;
            time: THEME_ANIM_NORMAL;
            
            scale: $self.focused ? 1.05 : 1.0;
            color: $self.focused ? THEME_FOCUS : THEME_CARD;
            
            widget(image, {
              source: $self.poster;
              aspect: 2/3;
              align: center;
            });
            
            widget(text, {
              caption: $self.title;
              color: THEME_TEXT;
              size: 16;
              bold: true;
              align: center;
              maxlines: 2;
            });
            
            onEvent(activate, {
              $ui.openItem($self);
            });
          });
        });
      });
    });
  });
});
```

This comprehensive theming guide provides all the tools and knowledge needed to create beautiful, functional themes for Movian. Use the interactive theme generator to get started quickly, then customize and extend your themes using the advanced techniques described above.