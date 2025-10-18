# Color Scheme Examples

This document showcases all available color schemes with visual examples and code snippets.

## Dark Blue

### Color Palette
```xml
#define THEME_PRIMARY [0.2, 0.4, 0.8]
#define THEME_SECONDARY [0.8, 0.4, 0.2]
#define THEME_BACKGROUND [0.1, 0.1, 0.1]
#define THEME_TEXT [0.9, 0.9, 0.9]
#define THEME_ACCENT [0.3, 0.8, 0.3]
```

### Usage Example
```xml
widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(container_x, {
    color: THEME_PRIMARY;
    padding: 20;
    
    widget(text, {
      caption: "Header Text";
      color: THEME_TEXT;
      size: 24;
    });
  });
  
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: 15;
    
    widget(text, {
      caption: "Content Text";
      color: THEME_TEXT;
      size: 16;
    });
    
    widget(container_y, {
      color: THEME_ACCENT;
      padding: 10;
      focusable: true;
      
      widget(text, {
        caption: "Button";
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```

### Preview
*A dark blue color scheme with deep navy backgrounds and bright blue accents*

---

## Warm Orange

### Color Palette
```xml
#define THEME_PRIMARY [0.9, 0.5, 0.2]
#define THEME_SECONDARY [0.2, 0.6, 0.9]
#define THEME_BACKGROUND [0.15, 0.1, 0.05]
#define THEME_TEXT [0.95, 0.9, 0.85]
#define THEME_ACCENT [0.8, 0.3, 0.3]
```

### Usage Example
```xml
widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(container_x, {
    color: THEME_PRIMARY;
    padding: 20;
    
    widget(text, {
      caption: "Header Text";
      color: THEME_TEXT;
      size: 24;
    });
  });
  
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: 15;
    
    widget(text, {
      caption: "Content Text";
      color: THEME_TEXT;
      size: 16;
    });
    
    widget(container_y, {
      color: THEME_ACCENT;
      padding: 10;
      focusable: true;
      
      widget(text, {
        caption: "Button";
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```

### Preview
*A warm orange color scheme with sunset-inspired colors and cozy atmosphere*

---

## Forest Green

### Color Palette
```xml
#define THEME_PRIMARY [0.2, 0.6, 0.3]
#define THEME_SECONDARY [0.6, 0.3, 0.2]
#define THEME_BACKGROUND [0.05, 0.15, 0.1]
#define THEME_TEXT [0.9, 0.95, 0.9]
#define THEME_ACCENT [0.4, 0.8, 0.4]
```

### Usage Example
```xml
widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(container_x, {
    color: THEME_PRIMARY;
    padding: 20;
    
    widget(text, {
      caption: "Header Text";
      color: THEME_TEXT;
      size: 24;
    });
  });
  
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: 15;
    
    widget(text, {
      caption: "Content Text";
      color: THEME_TEXT;
      size: 16;
    });
    
    widget(container_y, {
      color: THEME_ACCENT;
      padding: 10;
      focusable: true;
      
      widget(text, {
        caption: "Button";
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```

### Preview
*A forest green color scheme with natural earth tones and calming greens*

---

## Purple Night

### Color Palette
```xml
#define THEME_PRIMARY [0.5, 0.2, 0.8]
#define THEME_SECONDARY [0.8, 0.6, 0.2]
#define THEME_BACKGROUND [0.1, 0.05, 0.15]
#define THEME_TEXT [0.9, 0.85, 0.95]
#define THEME_ACCENT [0.7, 0.3, 0.9]
```

### Usage Example
```xml
widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(container_x, {
    color: THEME_PRIMARY;
    padding: 20;
    
    widget(text, {
      caption: "Header Text";
      color: THEME_TEXT;
      size: 24;
    });
  });
  
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: 15;
    
    widget(text, {
      caption: "Content Text";
      color: THEME_TEXT;
      size: 16;
    });
    
    widget(container_y, {
      color: THEME_ACCENT;
      padding: 10;
      focusable: true;
      
      widget(text, {
        caption: "Button";
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```

### Preview
*A purple night color scheme with deep purples and mystical dark tones*

---

## Minimal Gray

### Color Palette
```xml
#define THEME_PRIMARY [0.4, 0.4, 0.4]
#define THEME_SECONDARY [0.6, 0.6, 0.6]
#define THEME_BACKGROUND [0.12, 0.12, 0.12]
#define THEME_TEXT [0.9, 0.9, 0.9]
#define THEME_ACCENT [0.8, 0.8, 0.8]
```

### Usage Example
```xml
widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(container_x, {
    color: THEME_PRIMARY;
    padding: 20;
    
    widget(text, {
      caption: "Header Text";
      color: THEME_TEXT;
      size: 24;
    });
  });
  
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: 15;
    
    widget(text, {
      caption: "Content Text";
      color: THEME_TEXT;
      size: 16;
    });
    
    widget(container_y, {
      color: THEME_ACCENT;
      padding: 10;
      focusable: true;
      
      widget(text, {
        caption: "Button";
        color: THEME_TEXT;
        align: center;
      });
    });
  });
});
```

### Preview
*A minimal gray color scheme with clean lines and subtle monochromatic tones*

---

