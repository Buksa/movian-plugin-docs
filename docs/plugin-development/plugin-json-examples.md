# Plugin.json Examples

This document contains real-world examples of plugin.json configurations from existing Movian plugins.

## Other Plugins

### async_page_load

**Plugin ID:** `async_page_load`

```json
{
  "type": "ecmascript",
  "id": "async-page-load",
  "file": "async_page_load.js",
  "apiversion": 2,
  "version": "1.0.0",
  "author": "Plugin Developer",
  "title": "Async Page Load Example"
}
```

### example_itemhook

**Plugin ID:** `example-itemhook`

```json
{
  "type": "javascript",
  "id": "example-itemhook",
  "file": "example_itemhook.js",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "title": "Item Hook Example"
}
```

### Trakt

**Plugin ID:** `trakt`

**Author:** Fábio Ferreira

**Synopsis:** Track TV & movies

```json
{
  "author": "Fábio Ferreira",
  "title": "Trakt",
  "synopsis": "Track TV & movies",
  "description": "Track TV & movies",
  "version": "0.9.2",
  "file": "trakt.js",
  "showtimeVersion": "5.0.241",
  "type": "ecmascript",
  "id": "trakt",
  "icon": "logo.png",
  "category": "other",
  "apiversion": 2
}
```

### example_music

**Plugin ID:** `example-music`

```json
{
  "type": "ecmascript",
  "id": "example-music",
  "file": "example_music.js",
  "apiversion": 2,
  "version": "1.0.0",
  "author": "Plugin Developer",
  "title": "Music Example"
}
```

### example_settings

**Plugin ID:** `example-settings`

```json
{
  "type": "ecmascript",
  "id": "example-settings",
  "file": "example_settings.js",
  "apiversion": 2,
  "version": "1.0.0",
  "author": "Plugin Developer",
  "title": "Settings Example"
}
```

### example_subscriptions

**Plugin ID:** `example-subscriptions`

```json
{
  "type": "javascript",
  "id": "example-subscriptions",
  "file": "example_subscriptions.js",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "title": "Subscriptions Example"
}
```

### TMDb

**Plugin ID:** `tmdb`

**Author:** facanferff

**Synopsis:** themoviedb.org is a free and community maintained movie database.

```json
{
  "author": "facanferff",
  "title": "TMDb",
  "synopsis": "themoviedb.org is a free and community maintained movie database.",
  "description": "themoviedb.org is a free and community maintained movie database.",
  "version": "1.3.7",
  "file": "tmdb.js",
  "showtimeVersion": "5.0",
  "type": "ecmascript",
  "id": "tmdb",
  "icon": "logo.png",
  "category": "other"
}
```

**Validation Notes:**
- Warnings:
  - Consider specifying apiversion: 2 for ecmascript plugins

### devplug

**Plugin ID:** `devplug`

```json
{
  "type": "ecmascript",
  "id": "devplug",
  "file": "devplug.js",
  "apiversion": 2
}
```

**Validation Notes:**
- Warnings:
  - Consider adding a title for better user experience
  - Consider adding version for update management

### Xperience

**Plugin ID:** `xperience`

**Author:** Fábio Ferreira

**Synopsis:** Xperience is the newest skin plugin that promises to improve your experience with Movian. It tries to bring the best themes of other Media Centers to Movian, including Xperience 1080. Note: Touchscreen is not supported

```json
{
  "type": "ecmascript",
  "author": "Fábio Ferreira",
  "homepage": "",
  "title": "Xperience",
  "synopsis": "Xperience is the newest skin plugin that promises to improve your experience with Movian. It tries to bring the best themes of other Media Centers to Movian, including Xperience 1080. Note: Touchscreen is not supported",
  "description": "Xperience is the newest skin plugin that promises to improve your experience with Movian.",
  "version": "1.1.2",
  "showtimeVersion": "5.0.312",
  "file": "xperience.js",
  "id": "xperience",
  "icon": "logo.png",
  "category": "other",
  "glwviews": [
    {
      "file": "views/info_list/info_list.view",
      "title": "Info List (Xperience)",
      "class": "directory"
    }
  ],
  "apiversion": 2
}
```

**Validation Notes:**
- Errors:
  - homepage does not match required pattern: ^https?://
- Warnings:
  - Unknown field: glwviews

## Video Plugins

### Dailymotion

**Plugin ID:** `dailymotion`

**Author:** Fábio Ferreira

**Synopsis:** Dailymotion: Video Sharing Service

```json
{
  "description": "Dailymotion is a French video-sharing website on which users can upload, watch and share videos.",
  "author": "Fábio Ferreira",
  "homepage": "https://github.com/facanferff/movian-plugin-dailymotion",
  "title": "Dailymotion",
  "synopsis": "Dailymotion: Video Sharing Service",
  "version": "1.0.7",
  "file": "dailymotion.js",
  "showtimeVersion": "5.0.156",
  "type": "ecmascript",
  "id": "dailymotion",
  "icon": "icon.png",
  "category": "video",
  "apiversion": 2
}
```

### LostFilm.TV

**Plugin ID:** `testlostfilm`

**Author:** mpertsov

**Synopsis:** LostFilm.TV. Лучшие сериалы.

```json
{
  "type": "ecmascript",
  "id": "testlostfilm",
  "file": "lostfilm.js",
  "showtimeVersion": "4.9.401",
  "version": "0.4.7",
  "author": "mpertsov",
  "homepage": "https://github.com/mpertsov/movian-lostfilm",
  "title": "LostFilm.TV",
  "icon": "logo.png",
  "synopsis": "LostFilm.TV. Лучшие сериалы.",
  "category": "video"
}
```

**Validation Notes:**
- Warnings:
  - Consider specifying apiversion: 2 for ecmascript plugins

### anilibria.tv

**Plugin ID:** `anilibria.tv`

**Author:** Buksa

**Synopsis:** https://www.anilibria.tv

```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "anilibria.tv",
  "file": "index.js",
  "showtimeVersion": "5",
  "version": "0.2.2",
  "author": "Buksa",
  "title": "anilibria.tv",
  "icon": "logo.png",
  "category": "video",
  "synopsis": "https://www.anilibria.tv",
  "description": "<p>anilibria plugin - is the integration of the website <a href=\"https://www.anilibria.tv\">www.anilibria.tv</a> into Movian"
}
```

### soap4.me

**Plugin ID:** `soap4.me`

**Author:** Anton Ignatov &lt;abietis@gmail.com&gt;

**Synopsis:** soap4.me online tv series

```json
{
  "id": "soap4.me",
  "apiversion": 2,
  "type": "ecmascript",
  "showtimeVersion": "4.8",
  "title": "soap4.me",
  "prefix": "soap4.me",
  "synopsis": "soap4.me online tv series",
  "icon": "logo.png",
  "category": "video",
  "file": "index.js",
  "author": "Anton Ignatov &lt;abietis@gmail.com&gt;",
  "version": "1.0.7",
  "homepage": "https://github.com/a-ignatov-parc/movian-soap4.me#readme",
  "description": "Movian media server plugin for soap4.me video service",
  "i18n": {
    "SettingsGeneralSection": "General",
    "SettingsMarkAsWatched": "Mark episodes as watched",
    "SettingsShowNotWatchingSeries": "Show not watching series on main screen",
    "SettingsVideoSection": "Video",
    "SettingsTraslation": "Translation",
    "SettingsTraslationOptions": {
      "any": "Any",
      "russian": "Only Russian",
      "subtitles": "Only Subtitles"
    },
    "SettingsVideoQuality": "Quality",
    "SettingsVideoQualityOptions": {
      "720p": "HD",
      "SD": "SD"
    },
    "SettingsAuthSection": "Authorization",
    "SettingsLogout": "Logout",
    "LogoutMessage": "You have successfully logged out",
    "LoginRequired": "Login required",
    "LoginIncorrect": "Incorrect login or password! Try again",
    "LoginError": "Something went wrong on authorisation endpoint! Try again later",
    "SectionUnwatched": "New episodes",
    "SectionWatched": "Watched",
    "SectionClosed": "Closed",
    "SectionOthers": "Not watching",
    "SectionTranslation": "Translation",
    "SectionSubtitles": "Subtitles",
    "SeasonTitle": "Season",
    "EpisodeNewPrefix": "* ",
    "ErrorUnknown": "Something went wrong",
    "ErrorRetrieveVideoLink": "Unable to retrieve video link"
  }
}
```

### Youtube deank(fix)

**Plugin ID:** `youtube`

**Author:** Andreas Smas, deank

**Synopsis:** Youtube: Broadcast Yourself

```json
{
  "description": "The best resource available on the Internet for Video sharing. (mod)",
  "author": "Andreas Smas, deank",
  "title": "Youtube deank(fix)",
  "synopsis": "Youtube: Broadcast Yourself",
  "version": "7.3.0",
  "file": "youtube.js",
  "showtimeVersion": "5.0.462",
  "type": "ecmascript",
  "id": "youtube",
  "icon": "logo.png",
  "category": "video",
  "apiversion": 2,
  "control": {
    "uriprefixes": [
      "youtube:",
      "youtube.com/",
      "http://www.youtube.com/",
      "https://www.youtube.com/",
      "http://youtube.com/",
      "https://youtube.com/",
      "http://youtu.be/",
      "https://youtu.be/"
    ]
  }
}
```

### HDRezka

**Plugin ID:** `HDRezka`

**Author:** Buksa

**Synopsis:** HDRezka - онлайн фильмы в хорошем качестве

```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "HDRezka",
  "file": "HDRezka.js",
  "showtimeVersion": "5",
  "version": "2.7.6",
  "downloadURL": "http://bit.ly/_Rezka",
  "author": "Buksa",
  "title": "HDRezka",
  "icon": "HDRezka.png",
  "category": "video",
  "synopsis": "HDRezka - онлайн фильмы в хорошем качестве",
  "description": "<p>HDRezka - plugin is the integration of the website <a href=\"http://hdrezka.me\">HDRezka.me</a> into Movian",
  "homepage": "https://github.com/Buksa/movian-plugin-HDRezka.tv"
}
```

## Glwview Plugins

### Oceanus

**Plugin ID:** `oceanus`

**Author:** Fábio Ferreira (facanferff)

**Synopsis:** First skin plugin

```json
{
  "description": "Oceanus is the first ever skin plugin to be created for Showtime Media Center. From the same creator (facanferff) of Youtube and Navi-X plugins.",
  "author": "Fábio Ferreira (facanferff)",
  "homepage": "",
  "title": "Oceanus",
  "synopsis": "First skin plugin",
  "version": "1.0.5",
  "showtimeVersion": "4.1",
  "type": "views",
  "id": "oceanus",
  "icon": "logo.jpg",
  "category": "glwview",
  "glwviews": [
    {
      "file": "views/list2.view",
      "title": "List 2",
      "class": "directory"
    },
    {
      "file": "views/list.view",
      "title": "List",
      "class": "directory"
    },
    {
      "file": "views/shift.view",
      "title": "Shift",
      "class": "album"
    },
    {
      "file": "views/coverflow.view",
      "title": "Coverflow",
      "class": "directory"
    },
    {
      "file": "views/posters.view",
      "title": "Posters",
      "class": "movies"
    },
    {
      "file": "views/posters.view",
      "title": "Posters",
      "class": "directory"
    },
    {
      "file": "views/posters.view",
      "title": "Posters",
      "class": "artists"
    },
    {
      "file": "views/array.view",
      "title": "Array",
      "class": "directory"
    }
  ]
}
```

**Validation Notes:**
- Errors:
  - Missing required field: file
  - homepage does not match required pattern: ^https?://
  - type must be one of: ecmascript, javascript
  - category must be one of: video, audio, other, settings
- Warnings:
  - Unknown field: glwviews

## Subtitles Plugins

### Opensubtitles

**Plugin ID:** `opensubtitles`

**Author:** Andreas Öman

**Synopsis:** Biggest multi-language subtitle database

```json
{
  "type": "ecmascript",
  "id": "opensubtitles",
  "file": "opensubtitles.js",
  "category": "subtitles",
  "showtimeVersion": "4.8",
  "version": "2.0",
  "author": "Andreas Öman",
  "title": "Opensubtitles",
  "icon": "logo.jpg",
  "synopsis": "Biggest multi-language subtitle database",
  "homepage": "http://www.opensubtitles.org/",
  "description": "Installing this plugin will make Showtime automatically search for subtitles online at opensubtitles.org when playing a movie"
}
```

**Validation Notes:**
- Errors:
  - category must be one of: video, audio, other, settings
  - version does not match required pattern: ^\d+\.\d+\.\d+
- Warnings:
  - Consider specifying apiversion: 2 for ecmascript plugins

## Settings Plugins

### Theme Manager

**Plugin ID:** `theme-manager`

**Author:** Gemini

**Synopsis:** Install, manage, and switch between UI themes.

```json
{
  "id": "theme-manager",
  "title": "Theme Manager",
  "author": "Gemini",
  "version": "1.0.0",
  "synopsis": "Install, manage, and switch between UI themes.",
  "description": "A simple plugin to view, activate, install from a URL, and delete GLW skins.",
  "file": "main.js",
  "icon": "logo.png",
  "type": "ecmascript",
  "apiversion": 2,
  "category": "settings"
}
```

