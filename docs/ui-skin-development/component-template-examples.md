# Component Template Examples

Reusable component templates for common UI patterns in Movian themes.

## Media Card

### Template Code
```xml
#include "colors.view"

// Media Card Component
#define MEDIA_CARD(item) {
  widget(container_y, {
    color: THEME_CARD;
    padding: THEME_PADDING;
    spacing: THEME_SPACING;
    focusable: true;
    time: THEME_ANIM_NORMAL;
    
    scale: $self.focused ? 1.05 : 1.0;
    color: $self.focused ? THEME_FOCUS : THEME_CARD;
    
    widget(image, {
      source: item.poster;
      aspect: 2/3;
      align: center;
    });
    
    widget(container_y, {
      spacing: THEME_SPACING / 2;
      
      widget(text, {
        caption: item.title;
        color: THEME_TEXT;
        size: 16;
        bold: true;
        align: center;
        maxlines: 2;
      });
      
      widget(text, {
        caption: item.year + " • " + item.genre;
        color: THEME_TEXT;
        size: 12;
        alpha: 0.8;
        align: center;
      });
      
      widget(container_x, {
        spacing: 5;
        align: center;
        
        cloner(item.rating, container_x, {
          widget(image, {
            source: "skin://icons/star.png";
            width: 12;
            height: 12;
            color: THEME_ACCENT;
          });
        });
      });
    });
    
    onEvent(activate, {
      $ui.openItem(item);
    });
  });
}
```

### Usage Example
```xml
#include "components.view"

widget(container_y, {
  // Use the media-card template
  MEDIA_CARD($ui.items);
});
```

---

## Navigation Menu

### Template Code
```xml
#include "colors.view"

// Navigation Menu Component
#define NAVIGATION_MENU(items) {
  widget(container_y, {
    color: THEME_SECONDARY;
    padding: THEME_PADDING;
    spacing: THEME_SPACING;
    
    widget(text, {
      caption: "Menu";
      color: THEME_TEXT;
      size: 18;
      bold: true;
      margin: [0, 0, THEME_SPACING, 0];
    });
    
    cloner(items, container_y, {
      widget(container_x, {
        focusable: true;
        color: $self.focused ? THEME_HOVER : transparent;
        padding: THEME_SPACING;
        spacing: THEME_SPACING;
        time: THEME_ANIM_FAST;
        
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
        
        onEvent(activate, {
          $ui.navigate($self.url);
        });
      });
    });
  });
}
```

### Usage Example
```xml
#include "components.view"

widget(container_y, {
  // Use the navigation-menu template
  NAVIGATION_MENU($ui.items);
});
```

---

## Button Grid

### Template Code
```xml
#include "colors.view"

// Button Grid Component
#define BUTTON_GRID(buttons, columns) {
  widget(container_y, {
    spacing: THEME_SPACING;
    
    cloner(buttons, container_x, {
      spacing: THEME_SPACING;
      
      cloner($self.items, container_y, {
        width: ($parent.width - (THEME_SPACING * (columns - 1))) / columns;
        
        widget(container_y, {
          focusable: true;
          color: $self.focused ? THEME_HOVER : THEME_ACCENT;
          padding: THEME_PADDING;
          spacing: THEME_SPACING / 2;
          time: THEME_ANIM_FAST;
          
          widget(image, {
            source: $self.icon;
            width: 48;
            height: 48;
            color: THEME_TEXT;
            align: center;
          });
          
          widget(text, {
            caption: $self.title;
            color: THEME_TEXT;
            size: 14;
            bold: true;
            align: center;
          });
          
          onEvent(activate, {
            $self.action();
          });
        });
      });
    });
  });
}
```

### Usage Example
```xml
#include "components.view"

widget(container_y, {
  // Use the button-grid template
  BUTTON_GRID($ui.items);
});
```

---

## Content List

### Template Code
```xml
#include "colors.view"

// Content List Component
#define CONTENT_LIST(items) {
  widget(container_y, {
    spacing: THEME_SPACING / 2;
    
    cloner(items, container_y, {
      widget(container_x, {
        focusable: true;
        color: $self.focused ? THEME_HOVER : transparent;
        padding: THEME_SPACING;
        spacing: THEME_SPACING;
        time: THEME_ANIM_FAST;
        
        widget(image, {
          source: $self.thumbnail;
          width: 80;
          height: 60;
          aspect: 4/3;
        });
        
        widget(container_y, {
          weight: 1.0;
          spacing: THEME_SPACING / 3;
          
          widget(text, {
            caption: $self.title;
            color: THEME_TEXT;
            size: 16;
            bold: true;
            maxlines: 1;
          });
          
          widget(text, {
            caption: $self.description;
            color: THEME_TEXT;
            size: 12;
            alpha: 0.8;
            maxlines: 2;
          });
          
          widget(text, {
            caption: $self.duration;
            color: THEME_TEXT;
            size: 10;
            alpha: 0.6;
          });
        });
        
        widget(text, {
          caption: $self.date;
          color: THEME_TEXT;
          size: 12;
          alpha: 0.7;
        });
        
        onEvent(activate, {
          $ui.openItem($self);
        });
      });
    });
  });
}
```

### Usage Example
```xml
#include "components.view"

widget(container_y, {
  // Use the content-list template
  CONTENT_LIST($ui.items);
});
```

---

## Player Controls

### Template Code
```xml
#include "colors.view"

// Player Controls Component
#define PLAYER_CONTROLS() {
  widget(container_y, {
    color: THEME_BACKGROUND;
    padding: THEME_PADDING;
    spacing: THEME_SPACING;
    
    // Progress Bar
    widget(container_x, {
      height: 6;
      color: THEME_BORDER;
      
      widget(container_x, {
        width: ($ui.playbackPosition / $ui.playbackDuration) * $parent.width;
        color: THEME_ACCENT;
      });
    });
    
    // Time Display
    widget(container_x, {
      widget(text, {
        caption: $ui.playbackTime;
        color: THEME_TEXT;
        size: 12;
        weight: 1.0;
      });
      
      widget(text, {
        caption: $ui.playbackDuration;
        color: THEME_TEXT;
        size: 12;
      });
    });
    
    // Control Buttons
    widget(container_x, {
      spacing: THEME_SPACING * 2;
      align: center;
      
      widget(container_y, {
        focusable: true;
        color: $self.focused ? THEME_HOVER : transparent;
        padding: THEME_SPACING;
        
        widget(image, {
          source: "skin://icons/previous.png";
          width: 32;
          height: 32;
          color: THEME_TEXT;
        });
        
        onEvent(activate, {
          $ui.previousTrack();
        });
      });
      
      widget(container_y, {
        focusable: true;
        color: $self.focused ? THEME_HOVER : THEME_ACCENT;
        padding: THEME_SPACING * 1.5;
        
        widget(image, {
          source: $ui.isPlaying ? "skin://icons/pause.png" : "skin://icons/play.png";
          width: 48;
          height: 48;
          color: THEME_TEXT;
        });
        
        onEvent(activate, {
          $ui.togglePlayback();
        });
      });
      
      widget(container_y, {
        focusable: true;
        color: $self.focused ? THEME_HOVER : transparent;
        padding: THEME_SPACING;
        
        widget(image, {
          source: "skin://icons/next.png";
          width: 32;
          height: 32;
          color: THEME_TEXT;
        });
        
        onEvent(activate, {
          $ui.nextTrack();
        });
      });
    });
  });
}
```

### Usage Example
```xml
#include "components.view"

widget(container_y, {
  // Use the player-controls template
  PLAYER_CONTROLS($ui.items);
});
```

---

