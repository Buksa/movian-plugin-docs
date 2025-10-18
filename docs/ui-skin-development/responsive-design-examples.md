# Responsive Design Examples

Creating themes that adapt to different screen sizes and orientations.

## Screen Size Breakpoints

### Defining Breakpoints
```xml
#define SCREEN_MOBILE ($ui.width < 600)
#define SCREEN_TABLET ($ui.width >= 600 && $ui.width < 1024)
#define SCREEN_DESKTOP ($ui.width >= 1024)

#define IS_PORTRAIT ($ui.height > $ui.width)
#define IS_LANDSCAPE ($ui.width > $ui.height)
```

## Responsive Grid System

### Adaptive Column Count
```xml
#define GRID_COLUMNS {
  SCREEN_MOBILE ? (IS_PORTRAIT ? 2 : 3) :
  SCREEN_TABLET ? (IS_PORTRAIT ? 3 : 4) :
  SCREEN_DESKTOP ? 5 :
  4
}

widget(container_y, {
  spacing: THEME_SPACING;
  
  cloner($ui.content, container_x, {
    spacing: THEME_SPACING;
    
    cloner($self.items, container_y, {
      width: ($parent.width - (THEME_SPACING * (GRID_COLUMNS - 1))) / GRID_COLUMNS;
      
      widget(container_y, {
        color: THEME_CARD;
        padding: SCREEN_MOBILE ? THEME_PADDING / 2 : THEME_PADDING;
        
        widget(image, {
          source: $self.poster;
          aspect: 2/3;
        });
        
        widget(text, {
          caption: $self.title;
          color: THEME_TEXT;
          size: SCREEN_MOBILE ? 14 : 16;
          maxlines: SCREEN_MOBILE ? 1 : 2;
        });
      });
    });
  });
});
```

## Responsive Navigation

### Collapsible Sidebar
```xml
#define SIDEBAR_WIDTH {
  SCREEN_MOBILE ? 0 :
  SCREEN_TABLET ? 200 :
  250
}

#define SHOW_SIDEBAR (!SCREEN_MOBILE)

widget(container_x, {
  // Sidebar
  widget(container_y, {
    width: SIDEBAR_WIDTH;
    alpha: SHOW_SIDEBAR ? 1.0 : 0.0;
    color: THEME_SECONDARY;
    
    // Navigation content
    cloner($ui.navigation, container_y, {
      widget(container_x, {
        padding: THEME_SPACING;
        
        widget(image, {
          source: $self.icon;
          width: 24;
          height: 24;
        });
        
        widget(text, {
          caption: SCREEN_TABLET ? $self.shortTitle : $self.title;
          color: THEME_TEXT;
          size: SCREEN_TABLET ? 14 : 16;
        });
      });
    });
  });
  
  // Main content
  widget(container_y, {
    weight: 1.0;
    
    // Mobile navigation overlay
    widget(container_x, {
      height: SCREEN_MOBILE ? 50 : 0;
      alpha: SCREEN_MOBILE ? 1.0 : 0.0;
      color: THEME_PRIMARY;
      
      widget(container_y, {
        focusable: SCREEN_MOBILE;
        padding: THEME_SPACING;
        
        widget(image, {
          source: "skin://icons/menu.png";
          width: 24;
          height: 24;
          color: THEME_TEXT;
        });
        
        onEvent(activate, {
          $ui.toggleMobileMenu();
        });
      });
      
      widget(text, {
        caption: $ui.currentSection;
        color: THEME_TEXT;
        size: 18;
        weight: 1.0;
        align: center;
      });
    });
    
    // Content area
    widget(container_y, {
      weight: 1.0;
      padding: SCREEN_MOBILE ? THEME_PADDING / 2 : THEME_PADDING;
      
      // Content goes here
    });
  });
});
```

## Responsive Typography

### Adaptive Text Sizes
```xml
#define TITLE_SIZE {
  SCREEN_MOBILE ? 20 :
  SCREEN_TABLET ? 24 :
  28
}

#define BODY_SIZE {
  SCREEN_MOBILE ? 14 :
  SCREEN_TABLET ? 16 :
  16
}

#define CAPTION_SIZE {
  SCREEN_MOBILE ? 12 :
  SCREEN_TABLET ? 13 :
  14
}

widget(container_y, {
  spacing: SCREEN_MOBILE ? THEME_SPACING / 2 : THEME_SPACING;
  
  widget(text, {
    caption: $self.title;
    color: THEME_TEXT;
    size: TITLE_SIZE;
    bold: true;
    maxlines: SCREEN_MOBILE ? 2 : 3;
  });
  
  widget(text, {
    caption: $self.description;
    color: THEME_TEXT;
    size: BODY_SIZE;
    maxlines: SCREEN_MOBILE ? 3 : 5;
  });
  
  widget(text, {
    caption: $self.metadata;
    color: THEME_TEXT;
    size: CAPTION_SIZE;
    alpha: 0.8;
  });
});
```

## Responsive Spacing

### Adaptive Margins and Padding
```xml
#define RESPONSIVE_PADDING {
  SCREEN_MOBILE ? THEME_PADDING / 2 :
  SCREEN_TABLET ? THEME_PADDING * 0.8 :
  THEME_PADDING
}

#define RESPONSIVE_SPACING {
  SCREEN_MOBILE ? THEME_SPACING / 2 :
  SCREEN_TABLET ? THEME_SPACING * 0.8 :
  THEME_SPACING
}

widget(container_y, {
  padding: RESPONSIVE_PADDING;
  spacing: RESPONSIVE_SPACING;
  
  // Content with responsive spacing
});
```

## Orientation-Specific Layouts

### Portrait vs Landscape
```xml
widget(container_y, {
  // Switch layout based on orientation
  IS_PORTRAIT ? container_y : container_x;
  
  widget(image, {
    source: $self.poster;
    width: IS_PORTRAIT ? $parent.width : 300;
    height: IS_PORTRAIT ? 200 : $parent.height;
  });
  
  widget(container_y, {
    weight: IS_LANDSCAPE ? 1.0 : 0;
    padding: RESPONSIVE_PADDING;
    
    widget(text, {
      caption: $self.title;
      size: IS_PORTRAIT ? 18 : 24;
    });
    
    widget(text, {
      caption: $self.description;
      maxlines: IS_PORTRAIT ? 3 : 8;
    });
  });
});
```

## Touch-Friendly Design

### Larger Touch Targets for Mobile
```xml
#define TOUCH_TARGET_SIZE {
  SCREEN_MOBILE ? 44 : 32
}

widget(container_x, {
  spacing: SCREEN_MOBILE ? THEME_SPACING * 2 : THEME_SPACING;
  
  cloner($ui.actions, container_x, {
    widget(container_y, {
      width: TOUCH_TARGET_SIZE;
      height: TOUCH_TARGET_SIZE;
      color: THEME_ACCENT;
      focusable: true;
      
      widget(image, {
        source: $self.icon;
        width: SCREEN_MOBILE ? 24 : 20;
        height: SCREEN_MOBILE ? 24 : 20;
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```
