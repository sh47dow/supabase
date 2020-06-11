/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Supabase',
  tagline: 'The open source Firebase alternative.',
  url: 'https://supabase.io',
  baseUrl: '/',
  favicon: '/favicon.ico',
  organizationName: 'supabase', // Usually your GitHub org/user name.
  projectName: 'supabase', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: '766d56f13dd1e82f43253559b7c86636',
      indexName: 'supabase',
    },
    forceDarkMode: true,
    darkMode: true,
    image: '/img/supabase-og-image.png', // used for meta tag, in particular og:image and twitter:image
    metaImage: '/img/supabase-og-image.png',
    googleAnalytics: {
      trackingID: 'UA-155232740-1',
    },
    announcementBar: {
      id: 'support_us', // Any value that will identify this message
      content:
        'Join our early alpha: <a target="_blank" rel="noopener noreferrer" href="https://app.supabase.io">app.supabase.io</a>',
      backgroundColor: '#111111', // Defaults to `#fff`
      textColor: '#ddd', // Defaults to `#000`
    },
    navbar: {
      classNames: 'shadow--md',
      // title: 'supabase',
      logo: {
        alt: 'Supabase',
        src: '/supabase-light.svg',
        srcDark: '/supabase-dark.svg',
      },
      links: [
        {
          to: '/docs/about',
          label: 'Docs',
          position: 'left',
          // items: [
          //   {
          //     label: 'Realtime',
          //     to: '/docs/library/subscribe',
          //   },
          //   {
          //     label: 'Reading',
          //     to: '/docs/library/get',
          //   },
          //   {
          //     label: 'Creating',
          //     to: '/docs/library/post',
          //   },
          //   {
          //     label: 'Updating',
          //     to: '/docs/library/patch',
          //   },
          //   {
          //     label: 'Stored Procedures',
          //     to: '/docs/library/stored-procedures',
          //   },
          //   {
          //     label: 'Self Hosting',
          //     to: '/docs/hosting/hosting-realtime',
          //   },
          // ],
        },
        { to: '/docs/pricing', label: 'Pricing', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { href: 'https://github.com/supabase/supabase', label: 'GitHub', position: 'left' },
        { href: 'https://app.supabase.io', label: 'Login', position: 'right' },
        // {
        //   href: 'https://github.com/supabase/supabase',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    prism: {
      defaultLanguage: 'js',
      plugins: ['line-numbers', 'show-language'],
      theme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
      darkTheme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
    },
    footer: {
      links: [
        {
          title: 'Company',
          items: [
            {
              label: 'Humans',
              to: 'https://supabase.io/humans.txt',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Opensource',
              to: '/oss',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              to: '/docs/about',
            },
            {
              label: 'Pricing',
              to: '/docs/pricing',
            },
            {
              label: 'Support',
              to: '/docs/support',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/supabase/supabase',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/supabase_io',
            },
            {
              label: 'DevTo',
              href: 'https://dev.to/supabase',
            },
            {
              label: 'Stackshare',
              href: 'https://stackshare.io/supabase',
            },
            {
              label: 'Product Hunt',
              href: 'https://www.producthunt.com/posts/supabase-alpha',
            },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus"
            // }
          ],
        },
        {
          title: 'Alpha',
          items: [
            {
              label: 'Join our alpha',
              href: 'https://app.supabase.io',
            },
          ],
        },
      ],
      // logo: {
      //   alt: "Flock",
      //   src: "/img/logo-white.svg",
      //   // href: "https://opensource.facebook.com/"
      // },
      copyright: `Copyright © ${new Date().getFullYear()} Supabase.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
