import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/development-environment',
        'getting-started/first-plugin',
      ],
    },
    {
      type: 'category',
      label: 'Plugin Development',
      items: [
        'plugin-development/plugin-architecture',
        'plugin-development/plugin-structure',
        'plugin-development/plugin-json-reference',
        'plugin-development/plugin-json-examples',
        'plugin-development/plugin-patterns-analysis',
        'plugin-development/file-structure-templates',
        {
          type: 'category',
          label: 'Plugin Analysis',
          items: [
            'plugin-development/plugin-analysis/youtube-analysis',
            'plugin-development/plugin-analysis/tmdb-analysis',
            'plugin-development/plugin-analysis/soap4.me-analysis',
            'plugin-development/plugin-analysis/LostFilm.TV-analysis',
            'plugin-development/plugin-analysis/music-analysis',
            'plugin-development/plugin-analysis/opensubtitles-analysis',
            'plugin-development/plugin-analysis/theme-manager-analysis',
            'plugin-development/plugin-analysis/settings-analysis',
            'plugin-development/plugin-analysis/subscriptions-analysis',
            'plugin-development/plugin-analysis/videoscrobbling-analysis',
            'plugin-development/plugin-analysis/webpopupplugin-analysis',
            'plugin-development/plugin-analysis/xperience-analysis',
            'plugin-development/plugin-analysis/movian-plugin-trakt-analysis',
            'plugin-development/plugin-analysis/movian-plugin-anilibria.tv-analysis',
            'plugin-development/plugin-analysis/itemhook-analysis',
            'plugin-development/plugin-analysis/dailymotion-analysis',
            'plugin-development/plugin-analysis/async_page_load-analysis',
            'plugin-development/plugin-analysis/oceanus_v1.0.5_ST_ver4.1-analysis',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/basic-plugin-tutorial',
        'tutorials/content-provider-tutorial',
        'tutorials/video-streaming-tutorial',
        'tutorials/search-functionality-tutorial',
        'tutorials/api-integration-examples',
      ],
    },
    {
      type: 'category',
      label: 'UI & Skin Development',
      items: [
        'ui-skin-development/view-files',
        'ui-skin-development/ui-components',
        'ui-skin-development/theming-guide',
        'ui-skin-development/responsive-design-examples',
        'ui-skin-development/layout-pattern-examples',
        'ui-skin-development/component-template-examples',
        'ui-skin-development/color-scheme-examples',
        'ui-skin-development/advanced-theming-techniques',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/http-api',
        'api-reference/page-ui-api',
        'api-reference/metadata-storage-api',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced-topics/debugging',
        'advanced-topics/performance',
        'advanced-topics/compatibility-testing',
        'advanced-topics/error-reference',
        'advanced-topics/coding-standards',
        'advanced-topics/code-review-checklist',
        'advanced-topics/project-organization',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/packaging',
        'deployment/versioning',
        'deployment/installation-update-mechanisms',
        'deployment/update-examples',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/basic-content-plugin/README',
      ],
    },
  ],
};

export default sidebars;