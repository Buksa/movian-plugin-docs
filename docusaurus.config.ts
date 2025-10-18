import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Movian Plugin Development Guide',
  tagline: 'Comprehensive documentation for developing Movian plugins and skins',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://Buksa.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/movian-plugin-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Buksa', // Usually your GitHub org/user name.
  projectName: 'movian-plugin-docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Buksa/movian-plugin-docs/tree/main/',
        },
        blog: false, // Disable blog for documentation site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Movian Plugin Development',
      logo: {
        alt: 'Movian Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/movian/movian',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/introduction',
            },
            {
              label: 'Plugin Development',
              to: '/docs/plugin-development/plugin-architecture',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/http-api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/movian/movian/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/movian/movian/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Movian Project',
              href: 'https://github.com/movian/movian',
            },
            {
              label: 'Examples',
              to: '/docs/examples/basic-content-plugin/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Movian Development Team. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
