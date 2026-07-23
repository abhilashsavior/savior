import { Block } from 'payload'

export const SecretsBlock: Block = {
  slug: 'secrets',
  interfaceName: 'SecretsBlock',
  labels: {
    singular: 'Secrets Section',
    plural: 'Secrets Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'headingHighlight',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
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
          name: 'isExpanded',
          type: 'checkbox',
          defaultValue: false,
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
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
  ],
}

export default SecretsBlock