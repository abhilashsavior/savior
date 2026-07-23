import { Block } from 'payload'

export const TransparencyBlock: Block = {
  slug: 'transparency',
  interfaceName: 'TransparencyBlock',
  labels: {
    singular: 'Home-4: Transparency',
    plural: 'Home-4: Transparency',
  },
  fields: [
    {
      name: 'decorativeImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
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
          name: 'showCta',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'ctaButton',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.showCta,
          },
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
            },
          ],
        },
        {
          name: 'phoneCta',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.showCta,
          },
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
    },
  ],
}

export default TransparencyBlock