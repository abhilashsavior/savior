import { Block } from 'payload'

export const BrandsBlock: Block = {
  slug: 'brands',
  interfaceName: 'BrandsBlock',
  labels: {
    singular: 'Home-2: Brands',
    plural: 'Home-2: Brands',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default BrandsBlock
