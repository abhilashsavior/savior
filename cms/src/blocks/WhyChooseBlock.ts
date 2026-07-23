import { Block } from 'payload'

export const WhyChooseBlock: Block = {
  slug: 'why-choose',
  interfaceName: 'WhyChooseBlock',
  labels: {
    singular: 'Home-7: Why Choose',
    plural: 'Home-7: Why Choose',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
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
  ],
}

export default WhyChooseBlock