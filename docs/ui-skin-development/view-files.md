# View File Syntax Documentation

Complete reference for Movian view file syntax, validation, and interactive editing.

## Table of Contents

1. [Basic Syntax](#basic-syntax)
2. [Widget Types](#widget-types)
3. [Properties Reference](#properties-reference)
4. [Expressions and Variables](#expressions-and-variables)
5. [Advanced Features](#advanced-features)
6. [Syntax Validation](#syntax-validation)
7. [Interactive Editor](#interactive-editor)

## Basic Syntax

View files use a declarative, XML-like syntax to define user interfaces. The syntax is designed to be simple, readable, and easy to parse.

### Document Structure

A `.view` file consists of a tree of nested widget definitions. The root is a single widget that can contain other widgets as children.

### Fundamental Syntax Rules

#### Widget Declaration
```
widget(type, { properties... });
```

Declares a widget with the specified type and properties block.

**Example:**
```xml
widget(text, { 
  caption: "Hello World"; 
  color: [1.0, 1.0, 1.0]; 
});
```

#### Property Assignment
```
property: value;
```

Assigns a value to a widget property. All property assignments must end with a semicolon.

**Example:**
```xml
widget(container_y, {
  spacing: 10;
  padding: 15;
  align: center;
});
```

#### Comments
```
# comment text
```

Single-line comments start with a hash symbol and continue to the end of the line.

**Example:**
```xml
# Main container for the interface
widget(container_y, {
  # Set background color to dark gray
  color: [0.2, 0.2, 0.2];
});
```

#### String Literals
```
"text content"
```

String values must be enclosed in double quotes.

**Example:**
```xml
widget(text, {
  caption: "Welcome to Movian";
  font: "Arial";
});
```

## Widget Types

### Container Widgets

#### container_x
Horizontal container that arranges child widgets side by side.

**Properties:** `spacing`, `padding`, `margin`, `align`, `valign`

**Example:**
```xml
widget(container_x, {
  spacing: 10;
  
  widget(text, { caption: "Left"; });
  widget(text, { caption: "Center"; });
  widget(text, { caption: "Right"; });
});
```

#### container_y
Vertical container that arranges child widgets top to bottom.

**Properties:** `spacing`, `padding`, `margin`, `align`, `valign`

**Example:**
```xml
widget(container_y, {
  spacing: 5;
  align: center;
  
  widget(text, { caption: "Top"; });
  widget(text, { caption: "Middle"; });
  widget(text, { caption: "Bottom"; });
});
```

#### container_z
Stack container that layers child widgets on top of each other.

**Properties:** `padding`, `margin`, `align`, `valign`

**Example:**
```xml
widget(container_z, {
  widget(image, { 
    source: "background.jpg"; 
    alpha: 0.5; 
  });
  widget(text, { 
    caption: "Overlay text"; 
    color: [1.0, 1.0, 1.0];
  });
});
```

### Display Widgets

#### text / label
Displays text content with various formatting options.

**Properties:** `caption`, `color`, `size`, `align`, `font`, `bold`, `italic`

**Example:**
```xml
widget(text, {
  caption: "Styled Text";
  color: [0.9, 0.9, 0.9];
  size: 18;
  align: center;
  bold: true;
});
```

#### image
Displays images from files or URLs.

**Properties:** `source`, `width`, `height`, `alpha`, `aspect`, `color`

**Example:**
```xml
widget(image, {
  source: "skin://graphics/logo.png";
  width: 128;
  height: 64;
  alpha: 1.0;
  align: center;
});
```

### Interactive Widgets

#### button
Clickable button widget with event handling.

**Properties:** `caption`, `color`, `focusable`, `onEvent`

**Example:**
```xml
widget(button, {
  caption: "Click Me";
  focusable: true;
  color: [0.2, 0.4, 0.8];
  
  onEvent(activate, {
    $ui.message = "Button clicked!";
  });
  
  onEvent(focus, {
    $self.color = [0.3, 0.5, 0.9];
  });
});
```

### Layout Widgets

#### list
Scrollable list container for dynamic content.

**Properties:** `spacing`, `padding`, `scrollable`, `cloner`

**Example:**
```xml
widget(list, {
  id: "itemList";
  spacing: 2;
  
  cloner($self.items, container_y, {
    padding: 10;
    
    widget(text, {
      caption: $self.title;
      size: 16;
    });
    
    widget(text, {
      caption: $self.description;
      size: 12;
      color: [0.7, 0.7, 0.7];
    });
  });
});
```

#### deck
Stack of widgets where only one is visible at a time.

**Properties:** `page`, `transition`

**Example:**
```xml
widget(deck, {
  page: $self.currentPage;
  transition: "fade";
  
  widget(text, { caption: "Page 1 Content"; });
  widget(text, { caption: "Page 2 Content"; });
  widget(text, { caption: "Page 3 Content"; });
});
```

#### expander
Collapsible container widget.

**Properties:** `caption`, `expanded`, `focusable`

**Example:**
```xml
widget(expander, {
  caption: "Advanced Options";
  focusable: true;
  expanded: false;
  
  widget(container_y, {
    spacing: 5;
    
    widget(text, { caption: "Option 1"; });
    widget(text, { caption: "Option 2"; });
    widget(text, { caption: "Option 3"; });
  });
});
```

## Properties Reference

### Text Properties

#### caption
**Type:** `string`  
**Description:** Text content to display  
**Example:** `"Hello World"`, `"Welcome to Movian"`

#### font
**Type:** `string`  
**Description:** Font family name  
**Example:** `"Arial"`, `"Helvetica"`, `"monospace"`

#### size
**Type:** `number`  
**Description:** Font size in pixels  
**Example:** `12`, `16`, `24`, `32`

#### bold
**Type:** `boolean`  
**Description:** Whether text should be bold  
**Example:** `true`, `false`

#### italic
**Type:** `boolean`  
**Description:** Whether text should be italic  
**Example:** `true`, `false`

### Dimension Properties

#### width
**Type:** `number|percentage|expression`  
**Description:** Widget width in pixels, percentage, or expression  
**Example:** `100`, `"50%"`, `$parent.width / 2`

#### height
**Type:** `number|percentage|expression`  
**Description:** Widget height in pixels, percentage, or expression  
**Example:** `50`, `"25%"`, `$parent.height * 0.8`

#### spacing
**Type:** `number`  
**Description:** Spacing between child widgets  
**Example:** `5`, `10`, `15`

#### padding
**Type:** `number|array`  
**Description:** Internal spacing around widget content  
**Example:** `10`, `[10, 15]`, `[5, 10, 5, 10]`

#### margin
**Type:** `number|array`  
**Description:** External spacing around widget  
**Example:** `5`, `[10, 0]`, `[5, 10, 5, 10]`

### Color Properties

#### color
**Type:** `array|expression`  
**Description:** RGB color values between 0.0 and 1.0  
**Example:** `[1.0, 1.0, 1.0]`, `[0.5, 0.8, 0.2]`, `$theme.primaryColor`

#### alpha
**Type:** `number`  
**Description:** Transparency value between 0.0 (transparent) and 1.0 (opaque)  
**Example:** `1.0`, `0.5`, `0.0`

### Alignment Properties

#### align
**Type:** `keyword`  
**Description:** Horizontal alignment  
**Values:** `left`, `center`, `right`  
**Example:** `align: center;`

#### valign
**Type:** `keyword`  
**Description:** Vertical alignment  
**Values:** `top`, `center`, `bottom`  
**Example:** `valign: top;`

### Behavior Properties

#### focusable
**Type:** `boolean`  
**Description:** Whether the widget can receive focus  
**Example:** `true`, `false`

#### hidden
**Type:** `boolean|expression`  
**Description:** Whether the widget is hidden  
**Example:** `true`, `false`, `$self.shouldHide`

#### weight
**Type:** `number`  
**Description:** Layout weight for flexible sizing  
**Example:** `1.0`, `2.0`, `0.5`

### File Properties

#### source
**Type:** `string|expression`  
**Description:** File path or URL for images  
**Example:** `"icon.png"`, `"skin://graphics/logo.png"`, `$self.imageUrl`

## Expressions and Variables

### Variable Syntax
Variables are prefixed with a dollar sign (`$`) and provide access to runtime data.

#### Common Variables
- `$self` - Current widget instance
- `$parent` - Parent widget
- `$ui` - UI system object
- `$core` - Core application object
- `$nav` - Navigation object

**Examples:**
```xml
widget(text, {
  caption: $self.title;
  color: $self.focused ? [1.0, 1.0, 1.0] : [0.7, 0.7, 0.7];
});

widget(image, {
  width: $parent.width / 3;
  height: $ui.height < 600 ? 100 : 150;
});
```

### Mathematical Expressions
Perform calculations within property values.

**Examples:**
```xml
widget(container_x, {
  width: $parent.width - 40;
  spacing: $ui.width / 100;
});

widget(text, {
  size: $ui.width < 800 ? 14 : 18;
});
```

### Conditional Expressions
Use ternary operators for conditional values.

**Syntax:** `condition ? value1 : value2`

**Examples:**
```xml
widget(image, {
  source: $self.hasImage ? $self.imageUrl : "placeholder.png";
  alpha: $self.loading ? 0.5 : 1.0;
});

widget(container_y, {
  spacing: $ui.isMobile ? 5 : 10;
  padding: $self.expanded ? 20 : 10;
});
```

### Logical Expressions
Combine conditions with logical operators.

**Examples:**
```xml
widget(button, {
  hidden: !$self.visible || $self.disabled;
  color: $self.focused && $self.enabled ? [0.3, 0.5, 0.9] : [0.2, 0.4, 0.8];
});
```

## Advanced Features

### Include Files
Include content from other view files using the `#include` directive.

**Syntax:** `#include "filename.view"`

**Example:**
```xml
#include "common-styles.view"
#include "theme-colors.view"

widget(container_y, {
  color: THEME_BACKGROUND;
  
  widget(text, {
    caption: "Styled with included theme";
    color: THEME_TEXT;
  });
});
```

### Macro Definitions
Define reusable constants and macros with `#define`.

**Syntax:** `#define NAME value`

**Examples:**
```xml
#define PRIMARY_COLOR [0.2, 0.4, 0.8]
#define SECONDARY_COLOR [0.8, 0.4, 0.2]
#define BUTTON_HEIGHT 40
#define SPACING_SMALL 5
#define SPACING_LARGE 15

widget(button, {
  color: PRIMARY_COLOR;
  height: BUTTON_HEIGHT;
  margin: SPACING_SMALL;
});
```

### Complex Macros
Create reusable widget templates.

**Example:**
```xml
#define STYLED_BUTTON(caption, action) {
  widget(button, {
    caption: caption;
    focusable: true;
    color: PRIMARY_COLOR;
    height: BUTTON_HEIGHT;
    
    onEvent(focus, {
      $self.color = SECONDARY_COLOR;
    });
    
    onEvent(blur, {
      $self.color = PRIMARY_COLOR;
    });
    
    onEvent(activate, action);
  });
}

// Usage
STYLED_BUTTON("Play Video", {
  $ui.playVideo($self.videoUrl);
});

STYLED_BUTTON("Show Details", {
  $ui.navigate("details", $self.itemId);
});
```

### Event Handling
Handle user interactions and system events.

**Syntax:** `onEvent(eventType, { actions... })`

#### Common Events
- `activate` - Widget activated (clicked/selected)
- `focus` - Widget gained focus
- `blur` - Widget lost focus
- `changed` - Widget value changed

**Examples:**
```xml
widget(button, {
  caption: "Interactive Button";
  
  onEvent(activate, {
    $ui.message = "Button was clicked!";
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

### Cloner System
Generate dynamic content using the `cloner` function.

**Syntax:** `cloner(dataSource, widgetType, { template... })`

**Example:**
```xml
widget(list, {
  cloner($self.menuItems, container_x, {
    padding: 10;
    focusable: true;
    color: $self.focused ? [0.3, 0.3, 0.3] : [0.1, 0.1, 0.1];
    
    widget(image, {
      source: $self.icon;
      width: 32;
      height: 32;
    });
    
    widget(text, {
      caption: $self.title;
      color: [1.0, 1.0, 1.0];
      weight: 1.0;
      margin: [10, 0];
    });
    
    onEvent(activate, {
      $ui.navigate($self.url);
    });
  });
});
```

## Syntax Validation

### Common Syntax Errors

#### Unbalanced Braces
```xml
<!-- INCORRECT -->
widget(container_y, {
  widget(text, {
    caption: "Missing closing brace";
  });
<!-- Missing closing brace for container_y -->

<!-- CORRECT -->
widget(container_y, {
  widget(text, {
    caption: "Properly closed";
  });
});
```

#### Missing Semicolons
```xml
<!-- INCORRECT -->
widget(text, {
  caption: "Hello"  // Missing semicolon
  color: [1.0, 1.0, 1.0]  // Missing semicolon
});

<!-- CORRECT -->
widget(text, {
  caption: "Hello";
  color: [1.0, 1.0, 1.0];
});
```

#### Invalid Property Values
```xml
<!-- INCORRECT -->
widget(text, {
  color: [2.0, 1.5, 1.0];  // Values > 1.0
  size: "large";           // String instead of number
  align: middle;           // Invalid alignment value
});

<!-- CORRECT -->
widget(text, {
  color: [1.0, 0.8, 0.6];  // Values 0.0-1.0
  size: 18;                // Numeric value
  align: center;           // Valid alignment
});
```

### Validation Rules

1. **Brace Balance:** Every opening brace `{` must have a corresponding closing brace `}`
2. **Semicolon Termination:** All property assignments must end with a semicolon `;`
3. **String Quoting:** String values must be enclosed in double quotes `"`
4. **Color Values:** RGB color values must be between 0.0 and 1.0
5. **Widget Types:** Widget types must be valid and recognized
6. **Property Names:** Property names must be valid for the widget type
7. **Expression Syntax:** Variable expressions must use proper `$` syntax

## Interactive Editor

The view file syntax system includes an interactive editor with the following features:

### Features
- **Real-time Syntax Validation:** Immediate feedback on syntax errors
- **Syntax Highlighting:** Color-coded syntax for better readability
- **Live Preview:** Visual preview of the view file structure
- **Code Templates:** Pre-built templates for common patterns
- **Auto-formatting:** Automatic code indentation and formatting

### Usage
1. Enter or paste view file code in the editor
2. Validation results appear automatically
3. Use templates to quickly start with common patterns
4. Click "Preview" to see a visual representation
5. Use "Format" to clean up code indentation

### Code Templates
- **Hello World:** Basic text display
- **Card Layout:** Image and text card
- **List View:** Dynamic list with items
- **Button Grid:** Grid of interactive buttons

This comprehensive syntax documentation provides everything needed to create sophisticated view files for Movian plugins and skins. Use the interactive editor to experiment with different syntax patterns and validate your code in real-time.

## Next Steps

- Explore [UI Components](ui-components.md) for detailed widget reference
- Learn about [Theming and Styling](theming-guide.md) for advanced customization
- Check out practical examples in the code samples section