import { Block } from 'payload'

export const AgencyHeroBrandsBlock: Block = {
  slug: 'agency-hero-brands',
  interfaceName: 'AgencyHeroBrandsBlock',
  labels: {
    singular: 'Home-11: Agency Hero Brands',
    plural: 'Home-11: Agency Hero Brands',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Our Agency is A',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Hero For Your Business',
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'width',
          type: 'number',
          min: 1,
        },
        {
          name: 'height',
          type: 'number',
          min: 1,
        },
      ],
    },
  ],
}

export default AgencyHeroBrandsBlock
