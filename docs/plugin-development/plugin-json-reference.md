# Plugin.json Reference

This document provides a complete reference for the `plugin.json` configuration file used in Movian plugins.

## Overview

The `plugin.json` file is the main configuration file for Movian plugins. It defines metadata, dependencies, and behavior settings for your plugin.

## Required Fields

### type

- **Type:** string
- **Required:** Yes
- **Description:** Plugin type - determines the JavaScript engine used
- **Examples:** `ecmascript`, `javascript`

### id

- **Type:** string
- **Required:** Yes
- **Description:** Unique plugin identifier
- **Examples:** `youtube`, `tmdb`, `soap4.me`, `HDRezka`

### file

- **Type:** string
- **Required:** Yes
- **Description:** Main plugin JavaScript file
- **Examples:** `main.js`, `plugin.js`, `index.js`

## Optional Fields

### apiversion

- **Type:** number
- **Required:** No
- **Description:** Plugin API version to use
- **Allowed values:** `1`, `2`
- **Examples:** `2`
- **Default:** `1`

### title

- **Type:** string
- **Required:** No
- **Description:** Human-readable plugin name displayed in UI
- **Examples:** `"YouTube"`, `"TMDb"`, `"Theme Manager"`

### author

- **Type:** string
- **Required:** No
- **Description:** Plugin author name and optional email
- **Examples:** `"John Doe"`, `"Jane Smith &lt;jane@example.com&gt;"`

### version

- **Type:** string
- **Required:** No
- **Description:** Plugin version in semantic versioning format
- **Examples:** `"1.0.0"`, `"2.7.6"`, `"7.3.0"`

### synopsis

- **Type:** string
- **Required:** No
- **Description:** Short one-line description of the plugin
- **Examples:** `"YouTube: Broadcast Yourself"`, `"themoviedb.org movie database"`

### description

- **Type:** string
- **Required:** No
- **Description:** Detailed plugin description, may contain HTML
- **Examples:** `"<p>Plugin for accessing YouTube videos</p>"`

### icon

- **Type:** string
- **Required:** No
- **Description:** Plugin icon file (PNG, JPG, GIF)
- **Examples:** `"icon.png"`, `"logo.png"`

### category

- **Type:** string
- **Required:** No
- **Description:** Plugin category for organization in UI
- **Allowed values:** `video`, `audio`, `other`, `settings`
- **Examples:** `"video"`, `"audio"`, `"other"`, `"settings"`

### showtimeVersion

- **Type:** string
- **Required:** No
- **Description:** Minimum required Movian/Showtime version
- **Examples:** `"5.0"`, `"4.8"`, `"5.0.462"`

### homepage

- **Type:** string
- **Required:** No
- **Description:** Plugin homepage or repository URL
- **Examples:** `"https://github.com/user/plugin"`

### downloadURL

- **Type:** string
- **Required:** No
- **Description:** Direct download URL for plugin updates
- **Examples:** `"http://example.com/plugin.zip"`

### prefix

- **Type:** string
- **Required:** No
- **Description:** URL prefix handled by this plugin
- **Examples:** `"soap4.me"`, `"youtube"`

### control

- **Type:** object
- **Required:** No
- **Description:** Plugin control configuration

### i18n

- **Type:** object
- **Required:** No
- **Description:** Internationalization strings
- **Examples:** `{"SettingsTitle":"Settings","ErrorMessage":"Error occurred"}`

