import { Block } from 'payload'

export const PricingSectionBlock: Block = {
  slug: 'pricing-section',
  interfaceName: 'PricingSectionBlock',
  labels: {
    singular: 'Pricing Section',
    plural: 'Pricing Sections',
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
      type: 'text',
      localized: true,
    },
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'features',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'ctaLabel',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Start plan',
        },
      ],
    },
  ],
}

export default PricingSectionBlock