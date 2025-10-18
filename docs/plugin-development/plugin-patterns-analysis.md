# Plugin Patterns Analysis

This document provides a comprehensive analysis of common patterns found in Movian plugins.

## API Usage Statistics

| API | Usage Count | Percentage | Plugins |
|-----|-------------|------------|----------|
| PAGE | 12 | 63.2% | async_page_load, itemhook, LostFilm.TV... |
| HTTP | 7 | 36.8% | LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt... |
| SETTINGS | 6 | 31.6% | LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt... |
| SERVICE | 6 | 31.6% | LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt... |
| POPUP | 4 | 21.1% | movian-plugin-trakt, theme-manager, youtube... |
| STORAGE | 1 | 5.3% | _HDRezka |

## File Structure Patterns

### File Types Distribution

- **.svg**: 167 files
  - Common names: in-progress, watched, ic_chevron_left_48px, ic_add_48px, ic_alarm_48px
- **.view**: 95 files
  - Common names: details, captchaLogin, customImage, customString, episode
- **.png**: 87 files
  - Common names: icon, logo, check, eye, fanart_default
- **.js**: 81 files
  - Common names: async_page_load, Gruntfile, example_itemhook, http, lostfilm
- **.sample**: 42 files
  - Common names: applypatch-msg, commit-msg, fsmonitor-watchman, post-update, pre-applypatch
- **(no extension)**: 40 files
  - Common names: config, description, HEAD, index, exclude
- **.json**: 23 files
  - Common names: plugin, eslint, package, tsconfig
- **.ts**: 16 files
  - Common names: dailymotion, html.d, http.d, page.d, prop.d
- **.bmp**: 10 files
  - Common names: array, coverflow, infoOverlayTop, list, posterdiffuse
- **.md**: 9 files
  - Common names: README, History, Readme, readme, tree
- **.zip**: 8 files
  - Common names: release_1.0.1, release_1.0.2, release_1.0.3, release_1.0.4, release_1.0.5
- **.jpg**: 6 files
  - Common names: logo, gradient_blue_jpg, person, box_gradient, nophoto
- **.py**: 4 files
  - Common names: tree
- **.ttf**: 4 files
  - Common names: segoeuil, Quattrocento-Regular
- **.idx**: 3 files
  - Common names: pack-f5c4f50d9d6e6f6000d76e843b23d036e3c821af, pack-5ab404f3ef632634fee32da91ab97b1bb5f1fd93, pack-66f52aba504149adb2e09e8f74c711081fb6bdc8
- **.pack**: 3 files
  - Common names: pack-f5c4f50d9d6e6f6000d76e843b23d036e3c821af, pack-5ab404f3ef632634fee32da91ab97b1bb5f1fd93, pack-66f52aba504149adb2e09e8f74c711081fb6bdc8
- **.rev**: 3 files
  - Common names: pack-f5c4f50d9d6e6f6000d76e843b23d036e3c821af, pack-5ab404f3ef632634fee32da91ab97b1bb5f1fd93, pack-66f52aba504149adb2e09e8f74c711081fb6bdc8
- **.yml**: 3 files
  - Common names: .travis, .zuul
- **.txt**: 3 files
  - Common names: tree
- **.gif**: 1 files
  - Common names: loading
- **.markdown**: 1 files
  - Common names: README

## Lifecycle Patterns

| Feature | Count | Percentage |
|---------|-------|------------|
| init | 1 | 5.3% |
| settings | 2 | 10.5% |
| service | 6 | 31.6% |
| uri handler | 0 | 0.0% |

## Common Implementation Patterns

### Most Popular APIs

#### PAGE API (12 plugins)

Used by 63.2% of analyzed plugins.

**Plugins using this API:** async_page_load, itemhook, LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt, music, soap4.me, subscriptions, theme-manager, tmdb, youtube, _HDRezka

#### HTTP API (7 plugins)

Used by 36.8% of analyzed plugins.

**Plugins using this API:** LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt, theme-manager, webpopupplugin, youtube, _HDRezka

#### SETTINGS API (6 plugins)

Used by 31.6% of analyzed plugins.

**Plugins using this API:** LostFilm.TV, movian-plugin-anilibria.tv, movian-plugin-trakt, tmdb, xperience, _HDRezka

### Plugin Categories

#### Other (9 plugins)

async_page_load, itemhook, movian-plugin-trakt, music, settings, subscriptions, tmdb, webpopupplugin, xperience

#### Video (6 plugins)

dailymotion, LostFilm.TV, movian-plugin-anilibria.tv, soap4.me, youtube, _HDRezka

#### Glwview (1 plugins)

oceanus_v1.0.5_ST_ver4.1

#### Subtitles (1 plugins)

opensubtitles

#### Settings (1 plugins)

theme-manager

#### Unknown (1 plugins)

videoscrobbling

