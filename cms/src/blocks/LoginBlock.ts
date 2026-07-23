import { Block } from 'payload'

export const LoginBlock: Block = {
  slug: 'login',
  interfaceName: 'LoginBlock',
  labels: {
    singular: 'Login Block',
    plural: 'Login Blocks',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'titleHighlight',
      type: 'text',
      localized: true,
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      localized: true,
    },
    {
      name: 'passwordPlaceholder',
      type: 'text',
      localized: true,
    },
    {
      name: 'forgotPasswordLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'forgotPasswordLink',
      type: 'relationship',
      relationTo: 'pages',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'registerLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'registerIcon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'registerLink',
      type: 'relationship',
      relationTo: 'pages',
    },
  ],
}

export default LoginBlock