/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  sidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro', 'migration-guide', 'release-notes'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Usage',
      items: ['usage/usage'],
      collapsed: false,
    },
    // {
    //   type: "category",
    //   label: "Release Notes",
    //   items: ["release-notes"],
    // },
  ],
}

module.exports = sidebars
