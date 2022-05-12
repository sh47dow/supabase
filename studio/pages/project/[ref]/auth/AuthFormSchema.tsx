import { object, string } from 'yup'

export default [
  {
    name: 'Email',
    icon: 'email-icon',
    form: [
      {
        type: 'text',
        name: 'email-app-id',
        label: 'email App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'email-id-key',
        label: 'email client ID',
        description: '',
      },
      {
        type: 'text',
        name: 'email-id-key',
        label: 'email client ID',
        description: '',
      },
      {
        type: 'text',
        name: 'email-id-key',
        label: 'email client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Phone',
    icon: 'phone-icon',
    form: [
      {
        type: 'select',
        name: 'phone-app-provider',
        label: 'Phone service provider',
        description: 'You can use a provider etc etc',
      },
      {
        type: 'text',
        name: 'phone-id-key',
        label: 'phone client ID',
        description: '',
      },
      {
        type: 'text',
        name: 'phone-id-key',
        label: 'phone client ID',
        description: '',
      },
      {
        type: 'text',
        name: 'phone-id-key',
        label: 'phone client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Google',
    icon: 'google-icon',
    validationSchema: object({
      'google-app-id': string()
        .required('You need THIS')
        .min(7, 'Needs to be at least 7 characters')
        .max(10, 'Can not be longer than 10 characters'),
      'google-id-key': string()
        .required('You need THIS')
        .min(7, 'Needs to be at least 7 characters')
        .max(10, 'Can not be longer than 10 characters'),
    }),
    form: [
      {
        type: 'text',
        name: 'google-app-id',
        label: 'Google App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'google-id-key',
        label: 'Google client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Facebook',
    icon: 'facebook-icon',
    form: [
      {
        type: 'text',
        name: 'facebook-app-id',
        label: 'Facebook App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'facebook-id-key',
        label: 'Facebook client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Twitter',
    icon: 'twitter-icon',
    form: [
      {
        type: 'text',
        name: 'twitter-app-id',
        label: 'Twitter App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'twitter-id-key',
        label: 'Twitter client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Apple',
    icon: 'apple-icon',
    form: [
      {
        type: 'text',
        name: 'apple-app-id',
        label: 'Apple App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'apple-id-key',
        label: 'Apple client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Microsoft',
    icon: 'microsoft-icon',
    form: [
      {
        type: 'text',
        name: 'microsoft-app-id',
        label: 'Microsoft App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'microsoft-id-key',
        label: 'Microsoft client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Gitlab',
    icon: 'gitlab-icon',
    form: [
      {
        type: 'text',
        name: 'gitlab-app-id',
        label: 'Gitlab App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'gitlab-id-key',
        label: 'Gitlab client ID',
        description: '',
      },
    ],
  },

  {
    name: 'Bitbucket',
    icon: 'bitbucket-icon',
    form: [
      {
        type: 'text',
        name: 'bitbucket-app-id',
        label: 'Bitbucket App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'bitbucket-id-key',
        label: 'Bitbucket client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Discord',
    icon: 'discord-icon',
    form: [
      {
        type: 'text',
        name: 'discord-app-id',
        label: 'Discord App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'discord-id-key',
        label: 'Discord client ID',
        description: '',
      },
    ],
  },

  {
    name: 'Github',
    icon: 'github-icon-dark',
    form: [
      {
        type: 'text',
        name: 'github-app-id',
        label: 'Github App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'github-id-key',
        label: 'Github client ID',
        description: '',
      },
    ],
  },

  {
    name: 'Slack',
    icon: 'slack-icon',
    form: [
      {
        type: 'text',
        name: 'slack-app-id',
        label: 'Slack App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'slack-id-key',
        label: 'Slack client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Spotify',
    icon: 'spotify-icon',
    form: [
      {
        type: 'text',
        name: 'spotify-app-id',
        label: 'Spotify App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'spotify-id-key',
        label: 'Spotify client ID',
        description: '',
      },
    ],
  },
  {
    name: 'Twitch',
    icon: 'twitch-icon',
    form: [
      {
        type: 'text',
        name: 'twitch-app-id',
        label: 'Twitch App Id',
        description: '',
      },
      {
        type: 'text',
        name: 'twitch-id-key',
        label: 'Twitch client ID',
        description: '',
      },
    ],
  },
]
