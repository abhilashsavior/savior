import { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'Home-3: About',
    plural: 'Home-3: About',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'externalUrl',
          type: 'text',
          admin: {
            description: 'Use this instead of link for external URLs',
          },
        },
      ],
    },
    {
      name: 'phoneCta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

export default AboutBlock