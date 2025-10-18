# Advanced Theming Techniques

Advanced techniques for creating sophisticated and dynamic themes.

## Dynamic Color Systems

### Content-Aware Colors
```xml
// Extract dominant color from content
#define CONTENT_COLOR($item) {
  $item.dominantColor ? $item.dominantColor : THEME_ACCENT
}

// Blend colors for subtle effects
#define BLEND_COLOR(base, overlay, strength) {
  [
    base[0] + (overlay[0] - base[0]) * strength,
    base[1] + (overlay[1] - base[1]) * strength,
    base[2] + (overlay[2] - base[2]) * strength
  ]
}

widget(container_y, {
  color: BLEND_COLOR(THEME_BACKGROUND, CONTENT_COLOR($self.currentItem), 0.1);
  
  widget(container_x, {
    color: CONTENT_COLOR($self.currentItem);
    alpha: 0.8;
    
    // Content that adapts to dominant color
  });
});
```

### Time-Based Themes
```xml
#define TIME_OF_DAY {
  $ui.hour < 6 ? "night" :
  $ui.hour < 12 ? "morning" :
  $ui.hour < 18 ? "afternoon" :
  "evening"
}

#define TIME_BASED_COLOR {
  TIME_OF_DAY == "night" ? [0.05, 0.05, 0.1] :
  TIME_OF_DAY == "morning" ? [0.9, 0.95, 1.0] :
  TIME_OF_DAY == "afternoon" ? [1.0, 0.98, 0.9] :
  [0.2, 0.15, 0.3]
}

widget(container_y, {
  color: BLEND_COLOR(THEME_BACKGROUND, TIME_BASED_COLOR, 0.2);
  time: 1.0; // Smooth transition
});
```

## Advanced Animations

### Staggered Animations
```xml
cloner($ui.items, container_y, {
  widget(container_y, {
    alpha: $ui.isVisible ? 1.0 : 0.0;
    translate: $ui.isVisible ? [0, 0] : [0, 50];
    time: 0.3;
    delay: $self.index * 0.1; // Stagger effect
    
    // Item content
  });
});
```

### Physics-Based Animations
```xml
widget(container_y, {
  focusable: true;
  
  // Spring animation on focus
  scale: $self.focused ? 1.1 : 1.0;
  time: 0.6;
  easing: "spring"; // Spring easing function
  
  // Parallax effect
  translate: [0, $ui.scrollOffset * 0.3];
});
```

### Particle Effects
```xml
// Simple particle system for background effects
cloner($ui.particles, container_y, {
  widget(image, {
    source: "skin://effects/particle.png";
    width: $self.size;
    height: $self.size;
    alpha: $self.alpha;
    color: THEME_ACCENT;
    
    // Animated position
    translate: [
      $self.x + sin($ui.time * $self.speed) * $self.amplitude,
      $self.y + cos($ui.time * $self.speed) * $self.amplitude
    ];
  });
});
```

## Conditional Theming

### User Preference Themes
```xml
#define USER_THEME $ui.settings.selectedTheme

#define THEME_COLORS {
  USER_THEME == "dark" ? {
    primary: [0.2, 0.4, 0.8],
    background: [0.1, 0.1, 0.1],
    text: [0.9, 0.9, 0.9]
  } :
  USER_THEME == "light" ? {
    primary: [0.3, 0.5, 0.9],
    background: [0.95, 0.95, 0.95],
    text: [0.1, 0.1, 0.1]
  } :
  USER_THEME == "auto" ? (
    TIME_OF_DAY == "night" || TIME_OF_DAY == "evening" ? 
    DARK_THEME : LIGHT_THEME
  ) :
  DEFAULT_THEME
}
```

### Content-Type Specific Themes
```xml
#define CONTENT_THEME($type) {
  $type == "movie" ? {
    accent: [0.9, 0.3, 0.3],
    secondary: [0.2, 0.2, 0.4]
  } :
  $type == "tv" ? {
    accent: [0.3, 0.9, 0.3],
    secondary: [0.2, 0.4, 0.2]
  } :
  $type == "music" ? {
    accent: [0.9, 0.6, 0.2],
    secondary: [0.4, 0.3, 0.1]
  } :
  DEFAULT_CONTENT_THEME
}

widget(container_y, {
  color: CONTENT_THEME($ui.currentContentType).secondary;
  
  // Content-specific styling
});
```

## Performance Optimization

### Efficient Color Calculations
```xml
// Pre-calculate derived colors to avoid runtime computation
#define THEME_HOVER_CACHED [
  min(1.0, THEME_PRIMARY[0] + 0.1),
  min(1.0, THEME_PRIMARY[1] + 0.1),
  min(1.0, THEME_PRIMARY[2] + 0.1)
]

// Use cached values instead of calculating each time
widget(container_y, {
  color: $self.focused ? THEME_HOVER_CACHED : THEME_PRIMARY;
});
```

### Conditional Rendering
```xml
// Only render expensive effects when needed
widget(container_y, {
  // Expensive blur effect only when focused
  $self.focused ? widget(blur, {
    intensity: 10;
    
    widget(image, {
      source: $self.background;
    });
  }) : void;
  
  // Regular content
  widget(text, {
    caption: $self.title;
  });
});
```

## Accessibility Features

### High Contrast Mode
```xml
#define HIGH_CONTRAST $ui.settings.highContrast

#define ACCESSIBLE_COLORS {
  HIGH_CONTRAST ? {
    background: [0.0, 0.0, 0.0],
    text: [1.0, 1.0, 1.0],
    accent: [1.0, 1.0, 0.0],
    border: [1.0, 1.0, 1.0]
  } : THEME_COLORS
}

widget(text, {
  caption: $self.title;
  color: ACCESSIBLE_COLORS.text;
  size: HIGH_CONTRAST ? 18 : 16; // Larger text in high contrast
  bold: HIGH_CONTRAST; // Bold text for better readability
});
```

### Focus Indicators
```xml
widget(container_y, {
  focusable: true;
  
  // Enhanced focus indicator for accessibility
  border: $self.focused ? 2 : 0;
  borderColor: THEME_ACCENT;
  
  // Audio feedback
  onEvent(focus, {
    $ui.playSound("focus");
  });
  
  // Screen reader support
  accessibilityLabel: $self.title + ", " + $self.description;
});
```

## Theme Inheritance and Modularity

### Base Theme System
```xml
// base-theme.view
#define BASE_SPACING 15
#define BASE_PADDING 20
#define BASE_BORDER_RADIUS 8

#define BASE_ANIMATIONS {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4
}

// Inherit and extend base theme
#include "base-theme.view"

#define CUSTOM_SPACING (BASE_SPACING * 1.2)
#define CUSTOM_COLORS {
  primary: [0.3, 0.6, 0.9],
  secondary: [0.9, 0.6, 0.3]
}
```

### Component Mixins
```xml
// Define reusable mixins
#define CARD_MIXIN(content) {
  color: THEME_CARD;
  padding: THEME_PADDING;
  focusable: true;
  time: THEME_ANIM_NORMAL;
  
  scale: $self.focused ? 1.05 : 1.0;
  
  content;
}

// Use mixin
CARD_MIXIN({
  widget(text, {
    caption: $self.title;
    color: THEME_TEXT;
  });
});
```

These advanced techniques allow for creating highly sophisticated and dynamic themes that respond to user preferences, content, and environmental factors while maintaining good performance and accessibility.
