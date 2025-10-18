# UI Component Library and Examples

Comprehensive reference for all available UI widgets and components in Movian view files, with interactive examples and customization options.

## Table of Contents

1. [Container Widgets](#container-widgets)
2. [Display Widgets](#display-widgets)
3. [Interactive Widgets](#interactive-widgets)
4. [Layout Widgets](#layout-widgets)
5. [Advanced Widgets](#advanced-widgets)
6. [Component Properties](#component-properties)
7. [Event Handling](#event-handling)
8. [Responsive Design](#responsive-design)
9. [Component Examples](#component-examples)
10. [Interactive Showcase](#interactive-showcase)

## Container Widgets

Container widgets are used to organize and layout other widgets. They provide structure and spacing for your UI.

### container_x
**Purpose:** Horizontal container that arranges child widgets side by side  
**Use Cases:** Navigation bars, button groups, horizontal layouts  
**Children:** Yes  

**Properties:**
- `spacing` - Space between child widgets (number)
- `padding` - Internal padding (number or array)
- `margin` - External margin (number or array)
- `align` - Horizontal alignment (left, center, right)
- `valign` - Vertical alignment (top, center, bottom)
- `homogeneous` - Equal sizing for all children (boolean)

**Basic Example:**
```xml
widget(container_x, {
  spacing: 10;
  padding: 15;
  
  widget(text, { caption: "Left"; });
  widget(text, { caption: "Center"; });
  widget(text, { caption: "Right"; });
});
```

**Advanced Example:**
```xml
widget(container_x, {
  spacing: 15;
  align: center;
  valign: center;
  color: [0.1, 0.1, 0.1];
  padding: 20;
  
  widget(image, {
    source: "icon.png";
    width: 32;
    height: 32;
  });
  
  widget(text, {
    caption: "Navigation Item";
    color: [1.0, 1.0, 1.0];
    weight: 1.0;
  });
  
  widget(text, {
    caption: "Badge";
    color: [0.8, 0.2, 0.2];
    size: 12;
  });
});
```

### container_y
**Purpose:** Vertical container that arranges child widgets top to bottom  
**Use Cases:** Menus, forms, vertical lists  
**Children:** Yes  

**Properties:**
- `spacing` - Space between child widgets (number)
- `padding` - Internal padding (number or array)
- `margin` - External margin (number or array)
- `align` - Horizontal alignment (left, center, right)
- `valign` - Vertical alignment (top, center, bottom)

**Basic Example:**
```xml
widget(container_y, {
  spacing: 8;
  align: center;
  
  widget(text, { caption: "Title"; size: 20; });
  widget(text, { caption: "Subtitle"; size: 14; });
  widget(text, { caption: "Description"; size: 12; });
});
```

**Form Example:**
```xml
widget(container_y, {
  spacing: 15;
  padding: 25;
  color: [0.15, 0.15, 0.15];
  
  widget(text, {
    caption: "Settings";
    size: 24;
    color: [1.0, 1.0, 1.0];
    align: center;
    margin: [0, 20];
  });
  
  widget(container_x, {
    spacing: 15;
    
    widget(text, {
      caption: "Username:";
      color: [0.9, 0.9, 0.9];
      width: 100;
    });
    
    widget(text, {
      caption: "user@example.com";
      color: [0.7, 0.7, 0.7];
      weight: 1.0;
    });
  });
  
  widget(container_x, {
    spacing: 15;
    
    widget(text, {
      caption: "Theme:";
      color: [0.9, 0.9, 0.9];
      width: 100;
    });
    
    widget(button, {
      caption: "Dark";
      focusable: true;
      weight: 1.0;
    });
  });
});
```

### container_z
**Purpose:** Stack container that layers child widgets on top of each other  
**Use Cases:** Overlays, backgrounds with content, layered effects  
**Children:** Yes  

**Properties:**
- `padding` - Internal padding (number or array)
- `margin` - External margin (number or array)
- `align` - Horizontal alignment (left, center, right)
- `valign` - Vertical alignment (top, center, bottom)

**Basic Example:**
```xml
widget(container_z, {
  width: 300;
  height: 200;
  
  widget(image, {
    source: "background.jpg";
    alpha: 0.7;
  });
  
  widget(text, {
    caption: "Overlay Text";
    color: [1.0, 1.0, 1.0];
    size: 18;
    align: center;
    valign: center;
  });
});
```

**Card with Overlay Example:**
```xml
widget(container_z, {
  width: 250;
  height: 350;
  
  # Background image
  widget(image, {
    source: $self.poster;
    width: 250;
    height: 350;
  });
  
  # Gradient overlay
  widget(container_y, {
    valign: bottom;
    color: [0.0, 0.0, 0.0];
    alpha: 0.8;
    padding: 20;
    
    widget(text, {
      caption: $self.title;
      color: [1.0, 1.0, 1.0];
      size: 16;
      bold: true;
    });
    
    widget(text, {
      caption: $self.year;
      color: [0.8, 0.8, 0.8];
      size: 12;
    });
  });
});
```

## Display Widgets

Display widgets show content like text and images to the user.

### text / label
**Purpose:** Display text content with formatting options  
**Use Cases:** Titles, descriptions, labels, captions  
**Children:** No  

**Properties:**
- `caption` - Text content to display (string)
- `color` - Text color (RGB array)
- `size` - Font size in pixels (number)
- `font` - Font family name (string)
- `bold` - Bold text (boolean)
- `italic` - Italic text (boolean)
- `align` - Text alignment (left, center, right)
- `valign` - Vertical alignment (top, center, bottom)
- `outline` - Text outline (boolean)
- `shadow` - Text shadow (boolean)

**Basic Examples:**
```xml
# Simple text
widget(text, {
  caption: "Hello World";
  color: [1.0, 1.0, 1.0];
  size: 16;
});

# Styled heading
widget(text, {
  caption: "Main Title";
  color: [0.2, 0.6, 1.0];
  size: 28;
  bold: true;
  align: center;
});

# Subtitle with styling
widget(text, {
  caption: "Subtitle text";
  color: [0.7, 0.7, 0.7];
  size: 14;
  italic: true;
  align: center;
});
```

**Advanced Text Styling:**
```xml
widget(container_y, {
  spacing: 10;
  align: center;
  
  # Hero title
  widget(text, {
    caption: "Welcome to Movian";
    color: [1.0, 1.0, 1.0];
    size: 32;
    bold: true;
    outline: true;
    shadow: true;
  });
  
  # Tagline
  widget(text, {
    caption: "Your Ultimate Media Center";
    color: [0.8, 0.9, 1.0];
    size: 18;
    italic: true;
  });
  
  # Description
  widget(text, {
    caption: "Stream, organize, and enjoy your media collection";
    color: [0.6, 0.7, 0.8];
    size: 14;
    align: center;
  });
});
```

### image
**Purpose:** Display images from files or URLs  
**Use Cases:** Icons, photos, backgrounds, thumbnails  
**Children:** No  

**Properties:**
- `source` - Image file path or URL (string)
- `width` - Image width (number or percentage)
- `height` - Image height (number or percentage)
- `alpha` - Transparency (0.0-1.0)
- `aspect` - Aspect ratio (number)
- `color` - Tint color (RGB array)
- `saturation` - Color saturation (number)
- `hue` - Color hue shift (number)
- `scale` - Scale factor (number)
- `rotation` - Rotation angle (number)

**Basic Examples:**
```xml
# Simple icon
widget(image, {
  source: "icon.png";
  width: 32;
  height: 32;
});

# Responsive image
widget(image, {
  source: "poster.jpg";
  width: $ui.width < 600 ? 150 : 200;
  aspect: 2/3;
});

# Styled image
widget(image, {
  source: "background.jpg";
  alpha: 0.8;
  saturation: 1.2;
  scale: 1.1;
});
```

**Image Gallery Example:**
```xml
widget(container_x, {
  spacing: 10;
  
  widget(image, {
    source: "photo1.jpg";
    width: 120;
    height: 120;
    focusable: true;
    
    onEvent(focus, {
      $self.scale = 1.1;
      $self.alpha = 1.0;
    });
    
    onEvent(blur, {
      $self.scale = 1.0;
      $self.alpha = 0.8;
    });
  });
  
  widget(image, {
    source: "photo2.jpg";
    width: 120;
    height: 120;
    focusable: true;
    alpha: 0.8;
  });
  
  widget(image, {
    source: "photo3.jpg";
    width: 120;
    height: 120;
    focusable: true;
    alpha: 0.8;
  });
});
```

## Interactive Widgets

Interactive widgets respond to user input and provide functionality.

### button
**Purpose:** Clickable button for user actions  
**Use Cases:** Navigation, actions, toggles, forms  
**Children:** No  

**Properties:**
- `caption` - Button text (string)
- `color` - Background color (RGB array)
- `focusable` - Can receive focus (boolean)
- `enabled` - Button is enabled (boolean)
- `pressed` - Button is pressed (boolean)

**Basic Examples:**
```xml
# Simple button
widget(button, {
  caption: "Click Me";
  focusable: true;
  
  onEvent(activate, {
    $ui.message = "Button clicked!";
  });
});

# Styled button
widget(button, {
  caption: "Primary Action";
  color: [0.2, 0.6, 1.0];
  focusable: true;
  padding: 15;
  
  onEvent(focus, {
    $self.color = [0.3, 0.7, 1.0];
  });
  
  onEvent(blur, {
    $self.color = [0.2, 0.6, 1.0];
  });
});
```

**Button Group Example:**
```xml
widget(container_x, {
  spacing: 10;
  
  widget(button, {
    caption: "Play";
    color: [0.2, 0.8, 0.2];
    focusable: true;
    weight: 1.0;
    
    onEvent(activate, {
      $ui.playVideo($self.videoUrl);
    });
  });
  
  widget(button, {
    caption: "Pause";
    color: [0.8, 0.6, 0.2];
    focusable: true;
    weight: 1.0;
    
    onEvent(activate, {
      $ui.pauseVideo();
    });
  });
  
  widget(button, {
    caption: "Stop";
    color: [0.8, 0.2, 0.2];
    focusable: true;
    weight: 1.0;
    
    onEvent(activate, {
      $ui.stopVideo();
    });
  });
});
```

## Layout Widgets

Layout widgets provide advanced layout and organization capabilities.

### list
**Purpose:** Scrollable container for dynamic content  
**Use Cases:** Menus, file browsers, content lists  
**Children:** Yes (via cloner)  

**Properties:**
- `spacing` - Space between items (number)
- `padding` - Internal padding (number or array)
- `scrollable` - Enable scrolling (boolean)
- `orientation` - Scroll direction (vertical, horizontal)

**Basic Example:**
```xml
widget(list, {
  spacing: 5;
  
  cloner($self.menuItems, container_x, {
    padding: 10;
    focusable: true;
    color: $self.focused ? [0.3, 0.3, 0.3] : [0.1, 0.1, 0.1];
    
    widget(text, {
      caption: $self.title;
      color: [1.0, 1.0, 1.0];
      weight: 1.0;
    });
  });
});
```

**Media List Example:**
```xml
widget(list, {
  spacing: 8;
  padding: 15;
  
  cloner($self.mediaItems, container_x, {
    padding: 12;
    spacing: 15;
    focusable: true;
    color: $self.focused ? [0.25, 0.25, 0.25] : [0.15, 0.15, 0.15];
    
    # Thumbnail
    widget(image, {
      source: $self.thumbnail;
      width: 80;
      height: 80;
    });
    
    # Content
    widget(container_y, {
      weight: 1.0;
      spacing: 4;
      
      widget(text, {
        caption: $self.title;
        color: [1.0, 1.0, 1.0];
        size: 16;
        bold: true;
      });
      
      widget(text, {
        caption: $self.subtitle;
        color: [0.8, 0.8, 0.8];
        size: 14;
      });
      
      widget(text, {
        caption: $self.description;
        color: [0.6, 0.6, 0.6];
        size: 12;
      });
    });
    
    # Metadata
    widget(container_y, {
      align: right;
      spacing: 4;
      
      widget(text, {
        caption: $self.duration;
        color: [0.7, 0.7, 0.7];
        size: 12;
      });
      
      widget(text, {
        caption: $self.fileSize;
        color: [0.5, 0.5, 0.5];
        size: 10;
      });
    });
  });
});
```

### deck
**Purpose:** Stack of widgets where only one is visible  
**Use Cases:** Tab content, page navigation, wizards  
**Children:** Yes  

**Properties:**
- `page` - Currently visible page index (number)
- `transition` - Page transition effect (string)
- `time` - Transition duration (number)

**Basic Example:**
```xml
widget(deck, {
  page: $self.currentPage;
  transition: "fade";
  time: 0.3;
  
  # Page 1
  widget(container_y, {
    align: center;
    spacing: 20;
    
    widget(text, {
      caption: "Welcome";
      size: 24;
      color: [1.0, 1.0, 1.0];
    });
    
    widget(text, {
      caption: "This is the first page";
      size: 16;
      color: [0.8, 0.8, 0.8];
    });
  });
  
  # Page 2
  widget(container_y, {
    align: center;
    spacing: 20;
    
    widget(text, {
      caption: "Settings";
      size: 24;
      color: [1.0, 1.0, 1.0];
    });
    
    widget(text, {
      caption: "Configure your preferences";
      size: 16;
      color: [0.8, 0.8, 0.8];
    });
  });
});
```

### expander
**Purpose:** Collapsible container widget  
**Use Cases:** Accordion menus, collapsible sections, advanced options  
**Children:** Yes  

**Properties:**
- `caption` - Header text (string)
- `expanded` - Initially expanded (boolean)
- `focusable` - Can receive focus (boolean)

**Example:**
```xml
widget(container_y, {
  spacing: 10;
  
  widget(expander, {
    caption: "Basic Settings";
    focusable: true;
    expanded: true;
    
    widget(container_y, {
      spacing: 8;
      padding: 15;
      
      widget(text, { caption: "Volume: 80%"; });
      widget(text, { caption: "Quality: HD"; });
      widget(text, { caption: "Language: English"; });
    });
  });
  
  widget(expander, {
    caption: "Advanced Settings";
    focusable: true;
    expanded: false;
    
    widget(container_y, {
      spacing: 8;
      padding: 15;
      
      widget(text, { caption: "Buffer Size: 4MB"; });
      widget(text, { caption: "Cache: Enabled"; });
      widget(text, { caption: "Debug: Disabled"; });
    });
  });
});
```

## Advanced Widgets

Advanced widgets provide specialized functionality for complex UI patterns.

### slider
**Purpose:** Adjustable value control  
**Use Cases:** Volume, brightness, progress, settings  
**Children:** No  

**Properties:**
- `min` - Minimum value (number)
- `max` - Maximum value (number)
- `value` - Current value (number)
- `step` - Value increment (number)

**Example:**
```xml
widget(container_y, {
  spacing: 15;
  
  widget(container_x, {
    spacing: 10;
    
    widget(text, {
      caption: "Volume:";
      width: 80;
    });
    
    widget(slider, {
      min: 0;
      max: 100;
      value: $self.volume;
      weight: 1.0;
      
      onEvent(changed, {
        $self.volume = $self.value;
      });
    });
    
    widget(text, {
      caption: $self.volume + "%";
      width: 40;
    });
  });
});
```

### bar
**Purpose:** Progress or level indicator  
**Use Cases:** Progress bars, level meters, loading indicators  
**Children:** No  

**Properties:**
- `value` - Current value (0.0-1.0)
- `color` - Bar color (RGB array)
- `backgroundColor` - Background color (RGB array)

**Example:**
```xml
widget(container_y, {
  spacing: 10;
  
  widget(text, {
    caption: "Download Progress";
    color: [1.0, 1.0, 1.0];
  });
  
  widget(bar, {
    value: $self.downloadProgress;
    color: [0.2, 0.8, 0.2];
    backgroundColor: [0.3, 0.3, 0.3];
    height: 8;
  });
  
  widget(text, {
    caption: Math.round($self.downloadProgress * 100) + "%";
    color: [0.8, 0.8, 0.8];
    size: 12;
    align: center;
  });
});
```

## Component Properties

### Universal Properties
All widgets support these common properties:

#### Dimensions
- `width` - Widget width (number, percentage, or expression)
- `height` - Widget height (number, percentage, or expression)
- `weight` - Layout weight for flexible sizing (number)

#### Positioning
- `align` - Horizontal alignment (left, center, right)
- `valign` - Vertical alignment (top, center, bottom)
- `margin` - External spacing (number or array)
- `padding` - Internal spacing (number or array)

#### Appearance
- `color` - Background/primary color (RGB array)
- `alpha` - Transparency (0.0-1.0)
- `scale` - Scale factor (number)
- `rotation` - Rotation angle in degrees (number)

#### Behavior
- `hidden` - Widget visibility (boolean or expression)
- `focusable` - Can receive focus (boolean)
- `enabled` - Widget is enabled (boolean)
- `id` - Unique identifier (string)

#### Animation
- `time` - Animation duration (number)
- `transition` - Transition type (string)

### Property Value Types

#### Numbers
```xml
width: 100;
height: 50;
size: 16;
alpha: 0.8;
```

#### Percentages
```xml
width: "50%";
height: "100%";
```

#### Colors (RGB Arrays)
```xml
color: [1.0, 1.0, 1.0];    # White
color: [0.0, 0.0, 0.0];    # Black
color: [1.0, 0.0, 0.0];    # Red
color: [0.2, 0.6, 1.0];    # Blue
```

#### Strings
```xml
caption: "Hello World";
source: "image.png";
font: "Arial";
```

#### Booleans
```xml
focusable: true;
hidden: false;
bold: true;
```

#### Arrays (for margins/padding)
```xml
margin: [10, 15];          # [vertical, horizontal]
padding: [5, 10, 5, 10];   # [top, right, bottom, left]
```

#### Expressions
```xml
width: $parent.width / 2;
color: $self.focused ? [1.0, 1.0, 1.0] : [0.7, 0.7, 0.7];
hidden: !$self.visible;
```

## Event Handling

### Event Types

#### User Interaction Events
- `activate` - Widget activated (clicked, selected, pressed Enter)
- `focus` - Widget gained focus
- `blur` - Widget lost focus
- `changed` - Widget value changed

#### System Events
- `loaded` - Widget finished loading
- `destroyed` - Widget is being destroyed

### Event Syntax
```xml
onEvent(eventType, {
  # Event handler code
});
```

### Event Examples

#### Button with Multiple Events
```xml
widget(button, {
  caption: "Interactive Button";
  focusable: true;
  
  onEvent(activate, {
    $ui.navigate("nextPage");
    $self.clickCount = $self.clickCount + 1;
  });
  
  onEvent(focus, {
    $self.color = [0.3, 0.5, 0.9];
    $self.scale = 1.05;
  });
  
  onEvent(blur, {
    $self.color = [0.2, 0.4, 0.8];
    $self.scale = 1.0;
  });
});
```

#### List Item with Selection
```xml
cloner($self.items, container_x, {
  focusable: true;
  
  onEvent(activate, {
    $parent.selectedItem = $self;
    $ui.showDetails($self.id);
  });
  
  onEvent(focus, {
    $self.color = [0.3, 0.3, 0.3];
  });
  
  onEvent(blur, {
    $self.color = $parent.selectedItem == $self ? [0.2, 0.2, 0.2] : [0.1, 0.1, 0.1];
  });
});
```

## Responsive Design

### Screen Size Adaptation
Use expressions to adapt to different screen sizes:

```xml
widget(container_x, {
  # Switch to vertical layout on small screens
  $ui.width < 800 ? container_y : container_x;
  spacing: $ui.width < 600 ? 5 : 10;
  
  widget(image, {
    width: $ui.width < 800 ? $parent.width : 300;
    height: $ui.width < 800 ? 200 : 400;
  });
  
  widget(container_y, {
    weight: 1.0;
    margin: $ui.width < 800 ? [10, 0] : [20, 0];
    
    widget(text, {
      size: $ui.width < 800 ? 16 : 20;
      caption: $self.title;
    });
  });
});
```

### Responsive Grid
```xml
widget(container_y, {
  spacing: 10;
  
  cloner($self.items, container_x, {
    spacing: 10;
    
    # Responsive column count
    cloner($self.chunk($ui.width < 600 ? 2 : $ui.width < 1000 ? 3 : 4), container_y, {
      weight: 1.0;
      
      widget(image, {
        source: $self.thumbnail;
        aspect: 1.0;
      });
      
      widget(text, {
        caption: $self.title;
        size: $ui.width < 600 ? 12 : 14;
        align: center;
      });
    });
  });
});
```

## Component Examples

### Media Card Component
```xml
widget(container_y, {
  color: [0.15, 0.15, 0.15];
  padding: 15;
  margin: 10;
  spacing: 12;
  focusable: true;
  
  # Poster image
  widget(image, {
    source: $self.poster;
    width: 180;
    height: 270;
    align: center;
    
    onEvent(focus, {
      $self.scale = 1.05;
    });
    
    onEvent(blur, {
      $self.scale = 1.0;
    });
  });
  
  # Title
  widget(text, {
    caption: $self.title;
    color: [1.0, 1.0, 1.0];
    size: 16;
    bold: true;
    align: center;
  });
  
  # Metadata
  widget(text, {
    caption: $self.year + " • " + $self.genre;
    color: [0.7, 0.7, 0.7];
    size: 12;
    align: center;
  });
  
  # Rating
  widget(container_x, {
    align: center;
    spacing: 5;
    
    widget(text, {
      caption: "★".repeat($self.rating);
      color: [1.0, 0.8, 0.0];
      size: 14;
    });
    
    widget(text, {
      caption: $self.rating + "/5";
      color: [0.6, 0.6, 0.6];
      size: 12;
    });
  });
  
  onEvent(activate, {
    $ui.showDetails($self.id);
  });
});
```

### Navigation Menu Component
```xml
widget(container_y, {
  color: [0.1, 0.1, 0.1];
  padding: 20;
  spacing: 8;
  
  # Menu header
  widget(text, {
    caption: "Main Menu";
    color: [1.0, 1.0, 1.0];
    size: 18;
    bold: true;
    margin: [0, 15];
  });
  
  # Menu items
  cloner($self.menuItems, container_x, {
    padding: 12;
    spacing: 12;
    focusable: true;
    color: $self.focused ? [0.3, 0.3, 0.3] : [0.2, 0.2, 0.2];
    
    # Icon
    widget(image, {
      source: $self.icon;
      width: 24;
      height: 24;
    });
    
    # Label
    widget(text, {
      caption: $self.label;
      color: [1.0, 1.0, 1.0];
      size: 14;
      weight: 1.0;
    });
    
    # Badge (if present)
    widget(text, {
      caption: $self.badge;
      color: [1.0, 1.0, 1.0];
      size: 10;
      hidden: !$self.badge;
      color: [0.8, 0.2, 0.2];
      padding: [2, 6];
    });
    
    onEvent(activate, {
      $ui.navigate($self.url);
    });
  });
});
```

### Settings Panel Component
```xml
widget(container_y, {
  spacing: 20;
  padding: 25;
  color: [0.12, 0.12, 0.12];
  
  # Panel title
  widget(text, {
    caption: "Video Settings";
    color: [1.0, 1.0, 1.0];
    size: 20;
    bold: true;
    margin: [0, 15];
  });
  
  # Quality setting
  widget(container_x, {
    spacing: 15;
    
    widget(text, {
      caption: "Quality:";
      color: [0.9, 0.9, 0.9];
      size: 14;
      width: 120;
    });
    
    widget(container_x, {
      spacing: 8;
      weight: 1.0;
      
      cloner(["Auto", "1080p", "720p", "480p"], button, {
        caption: $self;
        focusable: true;
        color: $parent.selectedQuality == $self ? [0.2, 0.6, 1.0] : [0.3, 0.3, 0.3];
        padding: [6, 12];
        
        onEvent(activate, {
          $parent.selectedQuality = $self;
        });
      });
    });
  });
  
  # Volume setting
  widget(container_x, {
    spacing: 15;
    
    widget(text, {
      caption: "Volume:";
      color: [0.9, 0.9, 0.9];
      size: 14;
      width: 120;
    });
    
    widget(slider, {
      min: 0;
      max: 100;
      value: $self.volume;
      weight: 1.0;
      
      onEvent(changed, {
        $self.volume = $self.value;
      });
    });
    
    widget(text, {
      caption: $self.volume + "%";
      color: [0.7, 0.7, 0.7];
      size: 12;
      width: 40;
    });
  });
  
  # Action buttons
  widget(container_x, {
    spacing: 15;
    margin: [20, 0];
    
    widget(button, {
      caption: "Save";
      focusable: true;
      color: [0.2, 0.8, 0.2];
      weight: 1.0;
      padding: 12;
      
      onEvent(activate, {
        $ui.saveSettings();
      });
    });
    
    widget(button, {
      caption: "Reset";
      focusable: true;
      color: [0.8, 0.2, 0.2];
      weight: 1.0;
      padding: 12;
      
      onEvent(activate, {
        $ui.resetSettings();
      });
    });
  });
});
```

## Interactive Showcase

For hands-on experimentation with these components, use the [Interactive View File Editor](../../../static/view-file-editor.html) which provides:

### Features
- **Live Preview:** See your components rendered in real-time
- **Syntax Validation:** Immediate feedback on syntax errors
- **Component Templates:** Pre-built examples to get started quickly
- **Responsive Testing:** Test how components adapt to different screen sizes

### Available Templates
1. **Hello World** - Basic text display
2. **Card Layout** - Media card with image and text
3. **List View** - Dynamic list with items
4. **Button Grid** - Interactive button layout
5. **Image Gallery** - Responsive image grid
6. **Settings Form** - Configuration interface

### Usage Tips
1. Start with a template that matches your needs
2. Modify properties to see immediate changes
3. Use the validation feature to catch syntax errors
4. Experiment with responsive expressions
5. Test different color schemes and layouts

This comprehensive component library provides all the building blocks needed to create sophisticated user interfaces in Movian. Each component is designed to be flexible, customizable, and responsive to different screen sizes and user interactions.

## Next Steps

- Explore [View File Syntax](view-files.md) for detailed syntax reference
- Learn about [Theming and Styling](theming-guide.md) for advanced customization
- Check out the [Interactive Editor](../../../static/view-file-editor.html) for hands-on practice