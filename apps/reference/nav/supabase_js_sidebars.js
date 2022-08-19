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
      items: [
        'intro',
        'installing',
        'generated/initializing',
        'typescript-support',
        'release-notes',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Auth',
      items: [
        'generated/auth-signup',
        'generated/auth-signinwithpassword',
        'generated/auth-signinwithotp',
        'generated/auth-signinwithoauth',
        'generated/auth-signout',
        'generated/auth-verifyotp',
        'generated/auth-getsession',
        'generated/auth-getuser',
        'generated/auth-updateuser',
        'generated/auth-setsession',
        'generated/auth-onauthstatechange',
        'generated/auth-resetpasswordforemail',
      ],
      collapsed: true,
    },
    {
      type: 'category',
      label: 'Auth (Server Only)',
      items: [
        'generated/auth-admin-listusers',
        'generated/auth-admin-createuser',
        'generated/auth-admin-deleteuser',
        'generated/auth-admin-generatelink',
        'generated/auth-admin-inviteuserbyemail',
        'generated/auth-admin-getuserbyid',
        'generated/auth-admin-updateuserbyid',
      ],
      collapsed: true,
    },
    {
      type: 'category',
      label: 'Functions',
      items: ['generated/invoke'],
      collapsed: true,
    },
    {
      type: 'category',
      label: 'Database',
      items: [
        'generated/select',
        'generated/insert',
        'generated/update',
        'generated/upsert',
        'generated/delete',
        'generated/rpc',
        {
          type: 'category',
          label: 'Modifiers',
          items: [
            'generated/using-modifiers',
            'generated/limit',
            'generated/order',
            'generated/range',
            'generated/single',
            'generated/maybesingle',
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: 'Filters',
          items: [
            'generated/using-filters',
            'generated/or',
            'generated/not',
            'generated/match',
            'generated/eq',
            'generated/neq',
            'generated/gt',
            'generated/gte',
            'generated/lt',
            'generated/lte',
            'generated/like',
            'generated/ilike',
            'generated/is',
            'generated/in',
            'generated/contains',
            'generated/containedby',
            'generated/rangelt',
            'generated/rangegt',
            'generated/rangegte',
            'generated/rangelte',
            'generated/rangeadjacent',
            'generated/overlaps',
            'generated/textsearch',
            'generated/filter',
          ],
          collapsed: true,
        },
      ],
      collapsed: true,
    },
    {
      type: 'category',
      label: 'Realtime',
      items: [
        'generated/subscribe',
        'generated/removechannel',
        'generated/removeallchannels',
        'generated/getchannels',
      ],
      collapsed: true,
    },
    {
      type: 'category',
      label: 'Storage',
      items: [
        'generated/storage-createbucket',
        'generated/storage-getbucket',
        'generated/storage-listbuckets',
        'generated/storage-updatebucket',
        'generated/storage-deletebucket',
        'generated/storage-emptybucket',
        'generated/storage-from-upload',
        'generated/storage-from-download',
        'generated/storage-from-list',
        'generated/storage-from-update',
        'generated/storage-from-move',
        'generated/storage-from-copy',
        'generated/storage-from-remove',
        'generated/storage-from-createsignedurl',
        'generated/storage-from-createsignedurls',
        'generated/storage-from-getpublicurl',
      ],
      collapsed: true,
    },
    // {
    //   type: "category",
    //   label: "Release Notes",
    //   items: ["release-notes"],
    // },
  ],
}

module.exports = sidebars
