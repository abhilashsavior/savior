import { Block } from 'payload'

export const OnlineBusinessBlock: Block = {
  slug: 'online-business',
  interfaceName: 'OnlineBusinessBlock',
  labels: {
    singular: 'Service-1: Online Business',
    plural: 'Service-1: Online Business',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'boldHeading',
      type: 'text',
      localized: true,
      admin: {
        description: 'Bold portion of the heading',
      },
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
  ],
}

export default OnlineBusinessBlock
