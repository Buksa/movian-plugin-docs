# Page and UI API Reference

Complete reference for page manipulation and UI components in Movian plugins

# Overview

The Page and UI APIs in Movian provide the foundation for creating interactive plugin interfaces. These APIs allow you to manipulate page content, add items, control loading states, and create custom user interfaces.

## Page API Features

- Add items to pages with metadata
- Control loading states and user feedback
- Set page metadata (title, icon, background)
- Handle page navigation and redirects
- Manage page types and content organization

## Property API Features

- Create and manage properties for data storage
- Subscribe to property changes for reactive updates
- Set and get property values with type safety
- Link properties for data binding

## UI Component Features

- Layout containers for organizing content
- Text and image display components
- Interactive elements like buttons
- Responsive design capabilities
- Event handling and user interaction

# Page API

The Page API provides methods for manipulating page content and controlling page behavior.

## page.appendItem

Add an item to the current page

### Syntax

```javascript
page.appendItem(url, type, metadata)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL or identifier for the item

#### type (required)
- **Type:** string
- **Values:** item, directory, video, audio, image
- **Description:** The type of item to add

#### metadata (optional)
- **Type:** object
- **Description:** Metadata for the item

**Properties:**

- **title** (string): Display title for the item
- **description** (string): Description or synopsis
- **icon** (string): URL or path to item icon/thumbnail
- **duration** (number): Duration in seconds (for media items)
- **year** (number): Release year
- **genre** (string): Genre classification

### Returns

**Type:** void

No return value

### Examples

#### Add a Video Item

Add a video item to the page with metadata

```javascript
// Add a video item
page.appendItem('http://example.com/video.mp4', 'video', {
  title: 'Sample Video',
  description: 'A sample video file',
  icon: 'http://example.com/thumbnail.jpg',
  duration: 3600, // 1 hour in seconds
  year: 2023
});

// Increment the entries counter
page.entries++;
```

#### Add a Directory Item

Add a directory/folder item for navigation

```javascript
// Add a directory item
page.appendItem('plugin:browse:movies', 'directory', {
  title: 'Movies',
  description: 'Browse movie collection',
  icon: Plugin.path + 'icons/movies.png'
});

page.entries++;
```

#### Add Multiple Items

Add multiple items in a loop

```javascript
// Add multiple items from search results
searchResults.forEach(function(item) {
  page.appendItem(item.url, 'item', {
    title: item.title,
    description: item.synopsis,
    icon: item.poster,
    year: item.year,
    genre: item.genre
  });
  page.entries++;
});
```

## page.loading

Control the loading state of the page

### Syntax

```javascript
page.loading = boolean
```

### Parameters

#### value (required)
- **Type:** boolean
- **Description:** true to show loading indicator, false to hide

### Examples

#### Show Loading Indicator

Display loading indicator while fetching data

```javascript
// Show loading indicator
page.loading = true;

try {
  // Fetch data from API
  var response = http.request('https://api.example.com/movies');
  var data = JSON.parse(response.toString());
  
  // Process and add items
  data.results.forEach(function(movie) {
    page.appendItem(movie.url, 'video', {
      title: movie.title,
      description: movie.overview,
      icon: movie.poster_path
    });
    page.entries++;
  });
} finally {
  // Always hide loading indicator
  page.loading = false;
}
```

## page.metadata

Set metadata for the current page

### Syntax

```javascript
page.metadata.property = value
```

### Parameters

#### title (optional)
- **Type:** string
- **Description:** Page title

#### icon (optional)
- **Type:** string
- **Description:** Page icon URL

#### background (optional)
- **Type:** string
- **Description:** Background image URL

### Examples

#### Set Page Metadata

Configure page title and icon

```javascript
// Set page metadata
page.metadata.title = 'Search Results: ' + query;
page.metadata.icon = Plugin.path + 'icon.png';
page.metadata.background = 'http://example.com/bg.jpg';
```

## page.type

Set the page type

### Syntax

```javascript
page.type = type
```

### Parameters

#### type (required)
- **Type:** string
- **Values:** directory, video, audio, image, item
- **Description:** The page type

### Examples

#### Set Page Type

Configure the page as a directory

```javascript
// Set page as directory for browsing
page.type = 'directory';
```

## page.entries

Counter for the number of items on the page

### Syntax

```javascript
page.entries++
```

### Examples

#### Track Page Entries

Increment counter when adding items

```javascript
// Initialize entries counter
page.entries = 0;

// Add items and increment counter
movies.forEach(function(movie) {
  page.appendItem(movie.url, 'video', movie.metadata);
  page.entries++; // Increment for each item added
});

console.log('Added ' + page.entries + ' items to page');
```

## page.redirect

Redirect to another URL or page

### Syntax

```javascript
page.redirect(url)
```

### Parameters

#### url (required)
- **Type:** string
- **Description:** The URL to redirect to

### Examples

#### Redirect to Video

Redirect directly to a video URL

```javascript
// Redirect to HLS stream
var hlsUrl = 'hls:' + streamUrl;
page.redirect(hlsUrl);
```

#### Redirect with Data URI

Redirect to a data URI with encoded content

```javascript
// Create data URI and redirect
var playlistData = generateM3U8Playlist(streams);
var encodedData = btoa(playlistData);
var dataUri = 'data:application/x-mpegURL;base64,' + encodedData;
page.redirect('hls:' + dataUri);
```



# Property API

The Property API provides methods for creating and managing properties for data storage and binding.

## prop.create

Create a new property

### Syntax

```javascript
prop.create(name)
```

### Parameters

#### name (optional)
- **Type:** string
- **Description:** Optional name for the property

### Examples

#### Create Property

Create a new property for data storage

```javascript
// Create a new property
var myProp = prop.create('myData');
prop.set(myProp, 'Hello World');
```

## prop.set

Set a property value

### Syntax

```javascript
prop.set(property, value, type)
```

### Parameters

#### property (required)
- **Type:** object
- **Description:** The property object

#### value (required)
- **Type:** any
- **Description:** The value to set

#### type (optional)
- **Type:** string
- **Description:** Optional type specification

### Examples

#### Set Property Values

Set different types of property values

```javascript
// Set string value
prop.set(titleProp, 'Movie Title');

// Set number value
prop.set(yearProp, 2023);

// Set boolean value
prop.set(enabledProp, true);
```

## prop.subscribe

Subscribe to property changes

### Syntax

```javascript
prop.subscribe(property, callback, options)
```

### Parameters

#### property (required)
- **Type:** object
- **Description:** The property to subscribe to

#### callback (required)
- **Type:** function
- **Description:** Function to call when property changes

#### options (optional)
- **Type:** object
- **Description:** Subscription options

### Examples

#### Subscribe to Changes

Listen for property value changes

```javascript
// Subscribe to property changes
prop.subscribe(settingsProp, function(value) {
  console.log('Settings changed:', value);
  updateUI(value);
});
```



# UI Components

UI Components are the building blocks for creating custom user interfaces in Movian view files.

## container_x

**Type:** layout

Horizontal container for arranging child elements

### Properties

#### width
- **Type:** number|percentage
- **Description:** Container width

#### height
- **Type:** number|percentage
- **Description:** Container height

#### spacing
- **Type:** number
- **Description:** Space between child elements

#### align
- **Type:** string
- **Values:** left, center, right
- **Description:** Horizontal alignment

### Examples

#### Horizontal Layout

Create a horizontal layout with buttons

```javascript
widget(container_x, {
  width: 100%;
  height: 50;
  spacing: 10;
  align: center;
  
  widget(button, {
    caption: "Play";
    width: 100;
  });
  
  widget(button, {
    caption: "Stop";
    width: 100;
  });
});
```

## container_y

**Type:** layout

Vertical container for arranging child elements

### Properties

#### width
- **Type:** number|percentage
- **Description:** Container width

#### height
- **Type:** number|percentage
- **Description:** Container height

#### spacing
- **Type:** number
- **Description:** Space between child elements

#### align
- **Type:** string
- **Values:** top, center, bottom
- **Description:** Vertical alignment

### Examples

#### Vertical Layout

Create a vertical layout with text and image

```javascript
widget(container_y, {
  width: 300;
  height: 400;
  spacing: 15;
  align: center;
  
  widget(image, {
    source: "poster.jpg";
    width: 200;
    height: 300;
  });
  
  widget(text, {
    caption: "Movie Title";
    size: 18;
  });
});
```

## text

**Type:** display

Display text content

### Properties

#### caption
- **Type:** string
- **Description:** Text content to display

#### size
- **Type:** number
- **Description:** Font size

#### color
- **Type:** color
- **Description:** Text color

#### align
- **Type:** string
- **Values:** left, center, right
- **Description:** Text alignment

### Examples

#### Text Display

Display formatted text

```javascript
widget(text, {
  caption: "Welcome to My Plugin";
  size: 24;
  color: 0xffffff;
  align: center;
});
```

## image

**Type:** display

Display images

### Properties

#### source
- **Type:** string
- **Description:** Image URL or path

#### width
- **Type:** number
- **Description:** Image width

#### height
- **Type:** number
- **Description:** Image height

#### alpha
- **Type:** number
- **Description:** Transparency (0-1)

### Examples

#### Image Display

Display an image with specific dimensions

```javascript
widget(image, {
  source: "http://example.com/poster.jpg";
  width: 300;
  height: 450;
  alpha: 1.0;
});
```

## button

**Type:** interactive

Interactive button element

### Properties

#### caption
- **Type:** string
- **Description:** Button text

#### width
- **Type:** number
- **Description:** Button width

#### height
- **Type:** number
- **Description:** Button height

#### enabled
- **Type:** boolean
- **Description:** Whether button is enabled

### Examples

#### Interactive Button

Create a clickable button

```javascript
widget(button, {
  caption: "Play Movie";
  width: 150;
  height: 40;
  enabled: true;
  
  onEvent(activate, {
    // Handle button click
    fireEvent(play());
  });
});
```



# Best Practices

## Page Management

- Always set `page.loading = true` before long operations
- Remember to set `page.loading = false` when done
- Increment `page.entries` for each item added
- Set appropriate page metadata for better user experience

## Item Organization

- Use descriptive titles and descriptions
- Provide thumbnails/icons when available
- Group related items using directories
- Use consistent metadata structure

## Performance

- Limit the number of items per page (pagination)
- Use caching for frequently accessed data
- Optimize image sizes for thumbnails
- Implement lazy loading for large datasets

## User Experience

- Provide loading indicators for slow operations
- Use appropriate page types for content
- Implement error handling and user feedback
- Ensure responsive design for different screen sizes

