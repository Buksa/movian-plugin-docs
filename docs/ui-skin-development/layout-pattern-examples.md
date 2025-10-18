# Layout Pattern Examples

Common layout patterns for Movian themes with responsive design considerations.

## Grid Layouts

### Media Grid (4 Columns)
```xml
widget(container_y, {
  spacing: THEME_SPACING;
  
  cloner($ui.mediaItems, container_x, {
    spacing: THEME_SPACING;
    
    cloner($self.items, container_y, {
      width: ($parent.width - (THEME_SPACING * 3)) / 4;
      
      widget(container_y, {
        color: THEME_CARD;
        padding: THEME_PADDING;
        focusable: true;
        
        widget(image, {
          source: $self.poster;
          aspect: 2/3;
        });
        
        widget(text, {
          caption: $self.title;
          color: THEME_TEXT;
          align: center;
        });
      });
    });
  });
});
```

### Responsive Grid
```xml
#define GRID_COLUMNS {
  $ui.width > 1200 ? 5 :
  $ui.width > 800 ? 4 :
  $ui.width > 600 ? 3 :
  2
}

widget(container_y, {
  spacing: THEME_SPACING;
  
  cloner($ui.mediaItems, container_x, {
    spacing: THEME_SPACING;
    
    cloner($self.items, container_y, {
      width: ($parent.width - (THEME_SPACING * (GRID_COLUMNS - 1))) / GRID_COLUMNS;
      
      // Grid item content
    });
  });
});
```

## List Layouts

### Horizontal List
```xml
widget(container_x, {
  spacing: THEME_SPACING;
  
  cloner($ui.items, container_y, {
    width: 200;
    
    widget(container_y, {
      color: THEME_CARD;
      padding: THEME_PADDING;
      
      widget(image, {
        source: $self.thumbnail;
        width: 180;
        height: 100;
      });
      
      widget(text, {
        caption: $self.title;
        color: THEME_TEXT;
        maxlines: 2;
      });
    });
  });
});
```

### Vertical List
```xml
widget(container_y, {
  spacing: THEME_SPACING / 2;
  
  cloner($ui.items, container_y, {
    widget(container_x, {
      color: THEME_CARD;
      padding: THEME_PADDING;
      spacing: THEME_SPACING;
      focusable: true;
      
      widget(image, {
        source: $self.thumbnail;
        width: 80;
        height: 60;
      });
      
      widget(container_y, {
        weight: 1.0;
        
        widget(text, {
          caption: $self.title;
          color: THEME_TEXT;
          size: 16;
          bold: true;
        });
        
        widget(text, {
          caption: $self.description;
          color: THEME_TEXT;
          size: 12;
          alpha: 0.8;
        });
      });
    });
  });
});
```

## Card Layouts

### Media Card with Metadata
```xml
widget(container_y, {
  color: THEME_CARD;
  padding: THEME_PADDING;
  spacing: THEME_SPACING;
  focusable: true;
  
  // Hover effect
  scale: $self.focused ? 1.05 : 1.0;
  time: 0.2;
  
  widget(image, {
    source: $self.poster;
    aspect: 2/3;
    align: center;
  });
  
  widget(container_y, {
    spacing: THEME_SPACING / 2;
    
    widget(text, {
      caption: $self.title;
      color: THEME_TEXT;
      size: 16;
      bold: true;
      align: center;
      maxlines: 2;
    });
    
    widget(text, {
      caption: $self.year + " • " + $self.genre;
      color: THEME_TEXT;
      size: 12;
      alpha: 0.8;
      align: center;
    });
    
    // Rating stars
    widget(container_x, {
      align: center;
      spacing: 2;
      
      cloner($self.rating, container_x, {
        widget(image, {
          source: "skin://icons/star.png";
          width: 12;
          height: 12;
          color: THEME_ACCENT;
        });
      });
    });
  });
});
```

## Navigation Layouts

### Sidebar Navigation
```xml
widget(container_y, {
  width: 250;
  color: THEME_SECONDARY;
  padding: THEME_PADDING;
  spacing: THEME_SPACING;
  
  widget(text, {
    caption: "Navigation";
    color: THEME_TEXT;
    size: 18;
    bold: true;
    margin: [0, 0, THEME_SPACING, 0];
  });
  
  cloner($ui.navigation, container_y, {
    widget(container_x, {
      focusable: true;
      color: $self.focused ? THEME_HOVER : transparent;
      padding: THEME_SPACING;
      spacing: THEME_SPACING;
      time: 0.15;
      
      widget(image, {
        source: $self.icon;
        width: 24;
        height: 24;
        color: THEME_TEXT;
      });
      
      widget(text, {
        caption: $self.title;
        color: THEME_TEXT;
        size: 16;
        weight: 1.0;
      });
      
      widget(text, {
        caption: $self.count;
        color: THEME_TEXT;
        size: 12;
        alpha: 0.7;
      });
    });
  });
});
```

### Tab Navigation
```xml
widget(container_x, {
  height: 50;
  color: THEME_PRIMARY;
  
  cloner($ui.tabs, container_x, {
    widget(container_y, {
      weight: 1.0;
      focusable: true;
      color: $self.active ? THEME_ACCENT : transparent;
      
      widget(text, {
        caption: $self.title;
        color: THEME_TEXT;
        size: 16;
        align: center;
        bold: $self.active;
      });
      
      // Active indicator
      widget(container_x, {
        height: 3;
        color: $self.active ? THEME_ACCENT : transparent;
      });
    });
  });
});
```
