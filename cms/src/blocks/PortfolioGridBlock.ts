import { Block } from 'payload'

export const PortfolioGridBlock: Block = {
  slug: 'portfolio-grid',
  interfaceName: 'PortfolioGridBlock',
  labels: {
    singular: 'About: Portfolio Grid',
    plural: 'About: Portfolio Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Some of Our Best Work',
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      defaultValue: [
        { label: 'App', isActive: false },
        { label: 'E-commerce', isActive: true },
        { label: 'Cannabis/CBD', isActive: false },
        { label: 'Corporate', isActive: false },
        { label: 'manufacturing', isActive: false },
        { label: 'Real Estate', isActive: false },
        { label: 'Health Care', isActive: false },
      ],
    },
    {
      name: 'items',
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
          name: 'category',
          type: 'text',
          localized: true,
          admin: {
            description: 'Must match one of the category labels above (e.g. "E-commerce")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          defaultValue: 'Lorem ipsum is placeholder text commonly used in the.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'metrics',
          type: 'array',
          required: true,
          minRows: 4,
          maxRows: 4,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
          defaultValue: [
            { label: 'Sales', value: '+93%' },
            { label: 'Conversion Rate', value: '+11%' },
            { label: 'Web Sessions', value: '+89%' },
            { label: 'Total Orders', value: '+95%' },
          ],
        },
        {
          name: 'ctaLink',
          type: 'text',
        },
      ],
      defaultValue: [
        { title: 'Youthful impact' },
        { title: 'Alkey Tab' },
        { title: 'Adamson adhoot' },
        { title: 'Marco piano' },
        { title: 'Edgewater parts' },
        { title: 'DMK' },
      ],
    },
  ],
}

export default PortfolioGridBlock