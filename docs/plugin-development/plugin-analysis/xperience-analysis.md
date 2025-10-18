# Plugin Architecture Analysis: xperience

## Overview

This document provides an architectural analysis of the plugin located at `D:\movian_stuff\movian\plugin_examples\xperience`.

## File Structure

### Essential Files

- **plugin.json** - Plugin configuration and metadata
- **src\log.js** - Main plugin JavaScript file
- **src\plugin.js** - Main plugin JavaScript file
- **xperience.js** - Main plugin JavaScript file

### Common Files

- **logo.png** - Plugin logo

### Other Files

- tree.md
- tree.py
- tree.txt
- views\info_list\header.view
- views\info_list\img\ic_chevron_left_48px.svg
- views\info_list\info_list.view
- views\info_list\panel\info\items\common.view
- views\info_list\panel\info\items\default.view
- views\info_list\panel\info\items\image.view
- views\info_list\panel\info\items\img\ic_add_48px.svg
- views\info_list\panel\info\items\img\ic_alarm_48px.svg
- views\info_list\panel\info\items\img\ic_alarm_add_48px.svg
- views\info_list\panel\info\items\img\ic_alarm_off_48px.svg
- views\info_list\panel\info\items\img\ic_alarm_on_48px.svg
- views\info_list\panel\info\items\img\ic_album_48px.svg
- views\info_list\panel\info\items\img\ic_apps_48px.svg
- views\info_list\panel\info\items\img\ic_arrow_back_48px.svg
- views\info_list\panel\info\items\img\ic_arrow_drop_down_48px.svg
- views\info_list\panel\info\items\img\ic_arrow_drop_down_circle_48px.svg
- views\info_list\panel\info\items\img\ic_arrow_drop_up_48px.svg
- views\info_list\panel\info\items\img\ic_arrow_forward_48px.svg
- views\info_list\panel\info\items\img\ic_audiotrack_48px.svg
- views\info_list\panel\info\items\img\ic_bookmark_48px.svg
- views\info_list\panel\info\items\img\ic_bookmark_border_48px.svg
- views\info_list\panel\info\items\img\ic_cancel_48px.svg
- views\info_list\panel\info\items\img\ic_check_48px.svg
- views\info_list\panel\info\items\img\ic_check_box_48px.svg
- views\info_list\panel\info\items\img\ic_check_box_outline_blank_48px.svg
- views\info_list\panel\info\items\img\ic_chevron_left_48px.svg
- views\info_list\panel\info\items\img\ic_chevron_right_48px.svg
- views\info_list\panel\info\items\img\ic_close_48px.svg
- views\info_list\panel\info\items\img\ic_collections_bookmark_24px.svg
- views\info_list\panel\info\items\img\ic_delete_48px.svg
- views\info_list\panel\info\items\img\ic_description_48px.svg
- views\info_list\panel\info\items\img\ic_device_hub_24px.svg
- views\info_list\panel\info\items\img\ic_error_48px.svg
- views\info_list\panel\info\items\img\ic_exit_to_app_48px.svg
- views\info_list\panel\info\items\img\ic_expand_less_48px.svg
- views\info_list\panel\info\items\img\ic_expand_more_48px.svg
- views\info_list\panel\info\items\img\ic_extension_48px.svg
- views\info_list\panel\info\items\img\ic_favorite_48px.svg
- views\info_list\panel\info\items\img\ic_file_48px.svg
- views\info_list\panel\info\items\img\ic_folder_48px.svg
- views\info_list\panel\info\items\img\ic_folder_shared_48px.svg
- views\info_list\panel\info\items\img\ic_fullscreen_48px.svg
- views\info_list\panel\info\items\img\ic_fullscreen_exit_48px.svg
- views\info_list\panel\info\items\img\ic_help_48px.svg
- views\info_list\panel\info\items\img\ic_home_48px.svg
- views\info_list\panel\info\items\img\ic_info_48px.svg
- views\info_list\panel\info\items\img\ic_info_outline_48px.svg
- views\info_list\panel\info\items\img\ic_keyboard_48px.svg
- views\info_list\panel\info\items\img\ic_language_48px.svg
- views\info_list\panel\info\items\img\ic_list_48px.svg
- views\info_list\panel\info\items\img\ic_local_movies_48px.svg
- views\info_list\panel\info\items\img\ic_lock_48px.svg
- views\info_list\panel\info\items\img\ic_menu_48px.svg
- views\info_list\panel\info\items\img\ic_more_horiz_48px.svg
- views\info_list\panel\info\items\img\ic_more_vert_48px.svg
- views\info_list\panel\info\items\img\ic_movie_48px.svg
- views\info_list\panel\info\items\img\ic_my_library_books_48px.svg
- views\info_list\panel\info\items\img\ic_other_48px.svg
- views\info_list\panel\info\items\img\ic_pause_48px.svg
- views\info_list\panel\info\items\img\ic_person_48px.svg
- views\info_list\panel\info\items\img\ic_play_arrow_48px.svg
- views\info_list\panel\info\items\img\ic_power_settings_new_48px.svg
- views\info_list\panel\info\items\img\ic_radio_button_off_48px.svg
- views\info_list\panel\info\items\img\ic_radio_button_on_48px.svg
- views\info_list\panel\info\items\img\ic_refresh_48px.svg
- views\info_list\panel\info\items\img\ic_sd_storage_48px.svg
- views\info_list\panel\info\items\img\ic_search_48px.svg
- views\info_list\panel\info\items\img\ic_settings_48px.svg
- views\info_list\panel\info\items\img\ic_settings_ethernet_48px.svg
- views\info_list\panel\info\items\img\ic_shopping_cart_48px.svg
- views\info_list\panel\info\items\img\ic_skip_next_48px.svg
- views\info_list\panel\info\items\img\ic_skip_previous_48px.svg
- views\info_list\panel\info\items\img\ic_skip_previous_48px2.svg
- views\info_list\panel\info\items\img\ic_speaker_48px.svg
- views\info_list\panel\info\items\img\ic_stop_48px.svg
- views\info_list\panel\info\items\img\ic_subscriptions_48px.svg
- views\info_list\panel\info\items\img\ic_subtitles_48px.svg
- views\info_list\panel\info\items\img\ic_thumb_down_48px.svg
- views\info_list\panel\info\items\img\ic_thumb_up_48px.svg
- views\info_list\panel\info\items\img\ic_tv_48px.svg
- views\info_list\panel\info\items\img\ic_unfold_less_48px.svg
- views\info_list\panel\info\items\img\ic_unfold_more_48px.svg
- views\info_list\panel\info\items\img\ic_usb_48px.svg
- views\info_list\panel\info\items\img\ic_videocam_48px.svg
- views\info_list\panel\info\items\img\movian.svg
- views\info_list\panel\info\items\img\plugin.svg
- views\info_list\panel\info\items\img\scrollbar.png
- views\info_list\panel\info\items\img\separator_horizontal.png
- views\info_list\panel\info\items\img\server.svg
- views\info_list\panel\info\items\img\Star.svg
- views\info_list\panel\info\items\video.view
- views\info_list\panel\info\items\video_default.view
- views\info_list\panel\info\items\video_movie.view
- views\info_list\panel\info\panel.view
- views\info_list\panel\list\common.view
- views\info_list\panel\list\img\backdrop.png
- views\info_list\panel\list\img\focus.png
- views\info_list\panel\list\img\panel.png
- views\info_list\panel\list\img\scrollbar.png
- views\info_list\panel\list\items\action.view
- views\info_list\panel\list\items\audio.view
- views\info_list\panel\list\items\default.view
- views\info_list\panel\list\items\image.view
- views\info_list\panel\list\items\img\ic_add_48px.svg
- views\info_list\panel\list\items\img\ic_alarm_48px.svg
- views\info_list\panel\list\items\img\ic_alarm_add_48px.svg
- views\info_list\panel\list\items\img\ic_alarm_off_48px.svg
- views\info_list\panel\list\items\img\ic_alarm_on_48px.svg
- views\info_list\panel\list\items\img\ic_album_48px.svg
- views\info_list\panel\list\items\img\ic_apps_48px.svg
- views\info_list\panel\list\items\img\ic_arrow_back_48px.svg
- views\info_list\panel\list\items\img\ic_arrow_drop_down_48px.svg
- views\info_list\panel\list\items\img\ic_arrow_drop_down_circle_48px.svg
- views\info_list\panel\list\items\img\ic_arrow_drop_up_48px.svg
- views\info_list\panel\list\items\img\ic_arrow_forward_48px.svg
- views\info_list\panel\list\items\img\ic_audiotrack_48px.svg
- views\info_list\panel\list\items\img\ic_bookmark_48px.svg
- views\info_list\panel\list\items\img\ic_bookmark_border_48px.svg
- views\info_list\panel\list\items\img\ic_cancel_48px.svg
- views\info_list\panel\list\items\img\ic_check_48px.svg
- views\info_list\panel\list\items\img\ic_check_box_48px.svg
- views\info_list\panel\list\items\img\ic_check_box_outline_blank_48px.svg
- views\info_list\panel\list\items\img\ic_chevron_left_48px.svg
- views\info_list\panel\list\items\img\ic_chevron_right_48px.svg
- views\info_list\panel\list\items\img\ic_close_48px.svg
- views\info_list\panel\list\items\img\ic_collections_bookmark_24px.svg
- views\info_list\panel\list\items\img\ic_delete_48px.svg
- views\info_list\panel\list\items\img\ic_description_48px.svg
- views\info_list\panel\list\items\img\ic_device_hub_24px.svg
- views\info_list\panel\list\items\img\ic_error_48px.svg
- views\info_list\panel\list\items\img\ic_exit_to_app_48px.svg
- views\info_list\panel\list\items\img\ic_expand_less_48px.svg
- views\info_list\panel\list\items\img\ic_expand_more_48px.svg
- views\info_list\panel\list\items\img\ic_extension_48px.svg
- views\info_list\panel\list\items\img\ic_favorite_48px.svg
- views\info_list\panel\list\items\img\ic_file_48px.svg
- views\info_list\panel\list\items\img\ic_folder_48px.svg
- views\info_list\panel\list\items\img\ic_folder_shared_48px.svg
- views\info_list\panel\list\items\img\ic_fullscreen_48px.svg
- views\info_list\panel\list\items\img\ic_fullscreen_exit_48px.svg
- views\info_list\panel\list\items\img\ic_help_48px.svg
- views\info_list\panel\list\items\img\ic_home_48px.svg
- views\info_list\panel\list\items\img\ic_info_48px.svg
- views\info_list\panel\list\items\img\ic_info_outline_48px.svg
- views\info_list\panel\list\items\img\ic_keyboard_48px.svg
- views\info_list\panel\list\items\img\ic_language_48px.svg
- views\info_list\panel\list\items\img\ic_list_48px.svg
- views\info_list\panel\list\items\img\ic_local_movies_48px.svg
- views\info_list\panel\list\items\img\ic_lock_48px.svg
- views\info_list\panel\list\items\img\ic_menu_48px.svg
- views\info_list\panel\list\items\img\ic_more_horiz_48px.svg
- views\info_list\panel\list\items\img\ic_more_vert_48px.svg
- views\info_list\panel\list\items\img\ic_movie_48px.svg
- views\info_list\panel\list\items\img\ic_my_library_books_48px.svg
- views\info_list\panel\list\items\img\ic_other_48px.svg
- views\info_list\panel\list\items\img\ic_pause_48px.svg
- views\info_list\panel\list\items\img\ic_person_48px.svg
- views\info_list\panel\list\items\img\ic_play_arrow_48px.svg
- views\info_list\panel\list\items\img\ic_power_settings_new_48px.svg
- views\info_list\panel\list\items\img\ic_radio_button_off_48px.svg
- views\info_list\panel\list\items\img\ic_radio_button_on_48px.svg
- views\info_list\panel\list\items\img\ic_refresh_48px.svg
- views\info_list\panel\list\items\img\ic_sd_storage_48px.svg
- views\info_list\panel\list\items\img\ic_search_48px.svg
- views\info_list\panel\list\items\img\ic_settings_48px.svg
- views\info_list\panel\list\items\img\ic_settings_ethernet_48px.svg
- views\info_list\panel\list\items\img\ic_shopping_cart_48px.svg
- views\info_list\panel\list\items\img\ic_skip_next_48px.svg
- views\info_list\panel\list\items\img\ic_skip_previous_48px.svg
- views\info_list\panel\list\items\img\ic_skip_previous_48px2.svg
- views\info_list\panel\list\items\img\ic_speaker_48px.svg
- views\info_list\panel\list\items\img\ic_stop_48px.svg
- views\info_list\panel\list\items\img\ic_subscriptions_48px.svg
- views\info_list\panel\list\items\img\ic_subtitles_48px.svg
- views\info_list\panel\list\items\img\ic_thumb_down_48px.svg
- views\info_list\panel\list\items\img\ic_thumb_up_48px.svg
- views\info_list\panel\list\items\img\ic_tv_48px.svg
- views\info_list\panel\list\items\img\ic_unfold_less_48px.svg
- views\info_list\panel\list\items\img\ic_unfold_more_48px.svg
- views\info_list\panel\list\items\img\ic_usb_48px.svg
- views\info_list\panel\list\items\img\ic_videocam_48px.svg
- views\info_list\panel\list\items\img\movian.svg
- views\info_list\panel\list\items\img\plugin.svg
- views\info_list\panel\list\items\img\separator_horizontal.png
- views\info_list\panel\list\items\img\server.svg
- views\info_list\panel\list\items\search.view
- views\info_list\panel\list\items\separator.view
- views\info_list\panel\list\items\station.view
- views\info_list\panel\list\items\video.view
- views\info_list\panel\list\panel.view

## API Usage

This plugin uses the following Movian APIs:

### SETTINGS API

Plugin settings and configuration

**Usage count:** 6 occurrences

**Files:** `xperience.js`

**Examples:**
```javascript
var settings = require("movian/settings");
```

```javascript
settings.createBool("enabled", "Enable feature", true);
```

## Plugin Lifecycle

```mermaid
graph TD
    A[Plugin Load] --> B[Parse plugin.json]
    B --> C[Load JavaScript File]
    C --> E[Plugin Ready]
    E --> H[Handle User Requests]

```

### Lifecycle Features

- **Initialization function:** No
- **Settings support:** No
- **Service creation:** No
- **URI handling:** No

## Data Flow

```mermaid
graph LR
    User[User] --> Plugin[Plugin]
    Plugin --> Settings[Settings API]
    Settings --> Config[Configuration]
    Config --> User

```

