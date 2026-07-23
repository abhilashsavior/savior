import { Block } from 'payload'

export const DynamicWordPressBlock: Block = {
  slug: 'dynamic-wordpress',
  interfaceName: 'DynamicWordPressBlock',
  labels: {
    singular: 'Home-9: Dynamic WordPress',
    plural: 'Home-9: Dynamic WordPress',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'boldHeading',
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
      name: 'ctaButton',
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

export default DynamicWordPressBlock